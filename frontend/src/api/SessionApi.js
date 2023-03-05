import {post} from "../utils/networkUtils";


/**
 * Creates a new session and gets all the questions for it
 */
export function getOrCreateNewSession(categories, onComplete) {
  const data = {categories: categories};
  post("session/getorcreate/", data, onComplete);
}

/**
 * Creates a new session and gets all the questions for it
 */
export function createAnswer(sessionId, questionId, answer, timeMs, answerStatus, onComplete) {
  const data = {
    session_id: sessionId,
    question_id: questionId,
    answer: answer,
    time_ms: timeMs,
    answer_status: answerStatus,
  };
  post("session/answer/create/", data, onComplete);
}
