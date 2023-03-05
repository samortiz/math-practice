// Used to detect development servers running on localhost
export const LOCAL_HOSTS = {
  'http://localhost:3000': 'http://localhost:8000',
  'http://127.0.0.1:3000': 'http://127.0.0.1:8000',
  'http://192.168.2.23:3000': 'http://192.168.2.23:8000',  // put your local IP here (also add to CORS_ALLOWED_ORIGINS in .env)
};

export const INPUT_TYPE_POSITIVE_INTEGER = "positive integer";
export const INPUT_TYPE_INTEGER = "integer";
export const INPUT_TYPE_POSITIVE_REAL = "positive real";
export const INPUT_TYPE_REAL = "real";
export const INPUT_TYPE_FRACTION = "fraction";
export const INPUT_TYPE_TEXT = "text";
export const INPUT_TYPE_ALL = "all"; // This is a front-end thing... text would be the most general type we usually use

export const NUMS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
export const VALID_CHARS = {
  [INPUT_TYPE_POSITIVE_INTEGER]: [...NUMS],
  [INPUT_TYPE_INTEGER]: [...NUMS, '-'],
  [INPUT_TYPE_POSITIVE_REAL]: [...NUMS, '.'],
  [INPUT_TYPE_REAL]: [...NUMS, '.', '-'],
  // Fraction and text... maybe later
}

export const ANSWER_STATUS_CORRECT = 'correct';
export const ANSWER_STATUS_WRONG = 'wrong';
export const ANSWER_STATUS_TIMEOUT = 'timeout';

export const MASTERY_STATUS_INCOMPLETE = "incomplete";
export const MASTERY_STATUS_NOT_ACCURATE = "not accurate";
export const MASTERY_STATUS_ACCURATE_SLOW = "accurate slow";
export const MASTERY_STATUS_MASTERED = "mastered";

// Front-end Session setup constants

export const FOCUS_QUESTION_COUNT = 10;
export const DEFAULT_QUESTION_MASTERY_COUNT = 12;
