import {ANSWER_STATUS_CORRECT, ANSWER_STATUS_WRONG, DEFAULT_QUESTION_MASTERY_COUNT} from "../constants";
import {getRandom} from "./miscUtils";

export function getMasteryCount(question, categories) {
  for (const category of categories) {
    if (category.category_id === question.category_id) {
      return category.mastery_count;
    }
  }
  return DEFAULT_QUESTION_MASTERY_COUNT;
}

/**
 * @return the amount that should be added to the score for this answer
 */
export function scoreAnswer(answer, scoreState) {
  if (scoreState.wrongCount >= 2) {
    // We don't need to process any more answers, we already hit the max wrong count
    return;
  }
  console.log('processing ', answer.question_id, ' ', answer.answer_status, ' scoreState=', scoreState);
  if (answer.answer_status === ANSWER_STATUS_WRONG) {
    scoreState.wrongCount += 1;
  }
  if (answer.answer_status === ANSWER_STATUS_CORRECT) {
    scoreState.correctCount += 1;
  }
}

export function getQuestionScore(question, answers, categories) {
  const masteryCount = getMasteryCount(question, categories);
  const scoreState = {correctCount: 0, wrongCount: 0};
  // Answers in this session
  for (const answer of answers) {
    if (answer.question_id === question.question_id) {
      scoreAnswer(answer, scoreState);
    }
  }
  // Question answers (answers in other sessions)
  for (let answer of question.answers) {
    scoreAnswer(answer, scoreState);
  }
  console.log('state qid=', question.question_id+' score=', scoreState);

  // A lower score means they are better at the question (number of correct answers until mastered)
  return Math.max((masteryCount - scoreState.correctCount), 0);
}

/**
 * Initialize session data (either starting new or resuming a session)
 * @param session backend session object
 */
export function setupSession(session) {
  const focusQuestions = [];
  const questions = session.questions || [];
  for (let question of questions) {
    question.score = getQuestionScore(question, session.answers, session.categories);
  } // for question

  session.state = {
    focusQuestions: focusQuestions,
  };
}

export function questionAnswered(session, question, answerValue, newStatus) {
  session.prevQuestion = question;
  // adjust the score
  if (newStatus === ANSWER_STATUS_WRONG) {
    // reset their score if they just got it wrong now
    question.score = getMasteryCount(question, session.categories);
  }
  if (newStatus === ANSWER_STATUS_CORRECT) {
    question.score = Math.max((question.score - 1), 0);
  }
}


/**
 * Gets the next question to ask.
 * @param session backend session object
 * @returns question object
 */
export function getNextQuestion(session) {
  const state = session.state;
  if (!state) {
    console.warn('No state set!  cannot calculate nextQuestionIndex');
    return null;
  }
  const questions = session.questions || [];
  const sumOfScores = questions.map(q => q.score).reduce((prev, next) => prev + next);
  const scoreIndex = Math.floor(Math.random() * sumOfScores);
  console.log(`nextQuestion sumOfScores=${sumOfScores} scoreIndex=${scoreIndex} `, questions.filter(q=> q.score > 0).map(q => q.text + 's='+q.score));
  let currSum = 0;
  for (const question of questions) {
    currSum = currSum + question.score;
    if (scoreIndex <= currSum) {
      return question;
    }
  } // for question
  // shouldn't happen
  console.warn(`Could not get next question ${sumOfScores} scoreIndex=${scoreIndex} currSum=${currSum}`);
  return getRandom(questions);
}
