import {PageHeader} from "../menu/PageHeader";
import {Container} from "react-bootstrap";
import React, {Fragment, useEffect, useState} from "react";
import {createAnswer, endSession, getOrCreateNewSession} from "../api/SessionApi";
import {Keypad} from "./Keypad";
import './Session.scss';
import {getNextQuestion, isSessionComplete, questionAnswered, setupSession} from "../utils/questionUtils";
import {ANSWER_STATUS_CORRECT, INPUT_TYPE_ALL} from "../constants";
import {handleError} from "../utils/networkUtils";
import {useHistory} from "react-router-dom";

const STATUS_ANSWERING = 'answering';
const STATUS_WRONG = 'wrong';
const STATUS_CORRECT = 'correct';

export function Session() {
  const [session, setSession] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState(STATUS_ANSWERING);
  const [autoNextTimer, setAutoNextTimer] = useState(0);
  const [startQuestionTime, setStartQuestionTime] = useState(0);
  const history = useHistory();

  useEffect(() => {
    getOrCreateNewSession([7], (code, data, errors) => {
      if (code === 200) {
        setSession(data);
        setupSession(data);
        showNextQuestion(data);
      } else {
        handleError(errors);
      }
    });
  }, []);

  function clearTimer() {
    if (autoNextTimer) {
      clearTimeout(autoNextTimer);
      setAutoNextTimer(0);
    }
  }

  function showNextQuestion(aSession) {
    if (isSessionComplete(aSession)) {
      endSession(aSession.session_id, (code, data, errors) => {
        if (code === 200) {
          history.push("/session-view");
        } else {
          handleError(errors);
        }
      });
      // We won't show the next question, we will attempt to end the session
      return;
    }
    const nextQuestion = getNextQuestion(aSession);
    setQuestion(nextQuestion);
    setAnswer('');
    setStatus(STATUS_ANSWERING)
    setStartQuestionTime(performance.now());
  }

  function saveAnswer(answerValue, newStatus) {
    const timeMs = Math.floor(performance.now() - startQuestionTime);
    setStatus(newStatus);
    setStartQuestionTime(0);
    if (timeMs < 300) {
      console.warn('Not saving question - answer was too fast.. probably a typo');
      clearTimer();
      showNextQuestion(session);
      return;
    }
    questionAnswered(session, question, answerValue, newStatus);
    createAnswer(session.session_id, question.question_id, answerValue, timeMs, newStatus, (code, data, errors) => {
      if (code === 200) {
        if (!session.answers) {
          session.answers = [];
        }
        session.answers.push(data);
      } else {
        handleError(errors)
      }
    });
  }

  function changeAnswer(newKey) {
    // If we are already marked then we move on to the next question
    if (status !== STATUS_ANSWERING) {
      clearTimer();
      showNextQuestion(session);
      return;
    }
    const newAnswer = answer + newKey;
    setAnswer(newAnswer);
    const correctAnswer = question.correct_answer;
    if (newAnswer === correctAnswer) {
      saveAnswer(newAnswer, STATUS_CORRECT);
      setAutoNextTimer(setTimeout(() => {
        showNextQuestion(session);
      }, 1000));
      return;
    }
    // We know it's wrong
    if (!correctAnswer.startsWith(newAnswer)) {
      saveAnswer(newAnswer, STATUS_WRONG);
    }
  }

  function pageClick(e) {
    if (status !== STATUS_ANSWERING) {
      clearTimer();
      showNextQuestion(session);
    }
    e.preventDefault();
    e.stopPropagation();
  }

  return (
      <div style={{height: '100vh'}} onClick={(e) => pageClick(e)}>
        <PageHeader pageTitle="Practice Session"/>
        <Container fluid className="math-container-wide">
          <div className="question-text">
            {question?.text}
            =
            {status === STATUS_CORRECT &&
            <span className="correct">{answer} ✓</span>
            }
            {status === STATUS_WRONG &&
            <Fragment>
              <span className="wrong-answer">{answer}</span>
              <span className="wrong-mark">✗</span>
              <span className="correct-answer">{question?.correct_answer}</span>
            </Fragment>
            }
            {status === STATUS_ANSWERING &&
            <span>{answer}</span>
            }
          </div>
          <div className="keypad-position">
            <Keypad onKeyDown={changeAnswer} inputType={
              status === STATUS_ANSWERING ? question?.input_type : INPUT_TYPE_ALL}/>
          </div>

        </Container>
      </div>
  );
}
