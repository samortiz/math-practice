import axios from "axios";
import {showErrorToast} from "./miscUtils";
import {setAuthHeaders} from "../api/UserApi";

export const LOCAL_STORAGE_KEY_USER_LOGGED_IN = "userLoggedIn";
export const LOCAL_STORAGE_KEY_USER_DATA = "userEmail";
export const LOCAL_STORAGE_KEY_USER_TOKEN = "userToken";
export const LOCAL_STORAGE_KEY_USER_FORCED_TO_LOGOUT = "userForcedToLogout"; // flag to indicate user was booted

/**
 * Generates a relative URL adding the site-wide API prefix
 * @param path
 */
export function createUrl(path) {
  return "/api/v1/" + path;
}

/**
 * Sets a new login token - used after a user logs in
 */
export function setToken(token) {
  if (token) {
    // Add header for every request
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    localStorage.setItem(LOCAL_STORAGE_KEY_USER_TOKEN, token);
  } else {
    // Remove the auth header as we aren't logged in
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER_TOKEN);
  }
}

export function setCurrentUser(userData) {
  localStorage.setItem(LOCAL_STORAGE_KEY_USER_LOGGED_IN, "yes");
  const userDataStr = JSON.stringify(userData)
  localStorage.setItem(LOCAL_STORAGE_KEY_USER_DATA, userDataStr);
}

export function unsetCurrentUser() {
  setToken("");
  localStorage.removeItem(LOCAL_STORAGE_KEY_USER_LOGGED_IN);
  localStorage.removeItem(LOCAL_STORAGE_KEY_USER_DATA);
  localStorage.removeItem(LOCAL_STORAGE_KEY_USER_TOKEN);
}

export function setForceLogout() {
  unsetCurrentUser();
  localStorage.setItem(LOCAL_STORAGE_KEY_USER_FORCED_TO_LOGOUT, "yes");
}

export function isForceLogout() {
  return localStorage.getItem(LOCAL_STORAGE_KEY_USER_FORCED_TO_LOGOUT) === "yes";
}

export function clearForceLogout() {
  localStorage.removeItem(LOCAL_STORAGE_KEY_USER_FORCED_TO_LOGOUT);
}

/**
 * Makes a POST network call
 * @param url  URL path (after the api/v1/)
 * @param data  Data to post
 * @param onComplete(code, data, errors) : callback function with signature
 *    (errCode:number, {data...}, [{message:"err msg here", fields:["fieldName"...]}...])
 *    This callback will be called after the endpoint responds with a success or failure.
 *    Check the errCode for 200 for success
 * @param onSuccess(response, onComplete) : alternate callback if you don't want onComplete called on success
 * @param onError(error, onComplete) : alternate callback if you don't want handleError called on error
 */
export function post(url, data, onComplete, onSuccess = null, onError = null) {
  // We set the headers in case the network call occurs before the user info is loaded/refreshed in App.js
  setAuthHeaders();
  axios
      .post(createUrl(url), data || {})
      .then(response => {
        if (onSuccess) {
          onSuccess(response, onComplete);
        } else {
          onComplete(response.data?.status, response.data?.data, response.data?.errors);
        }
      })
      .catch(error => {
        if (onError) {
          onError(error, onComplete);
        } else {
          handleError(error, onComplete);
        }
      });
}

/**
 * Makes a GET network call
 * @param url  URL path (after the api/v1/)
 * @param onComplete(code, data, errors) : callback function with signature
 *    (errCode:number, {data...}, [{message:"err msg here", fields:["fieldName"...]}...])
 *    This callback will be called after the endpoint responds with a success or failure.
 *    Check the errCode for 200 for success
 * @param onSuccess(response, onComplete) : alternate callback if you don't want onComplete called on success
 * @param onError(error, onComplete) : alternate callback if you don't want handleError called on error
 */
export function get(url, onComplete, onSuccess = null, onError = null) {
  // We set the headers in case the network call occurs before the user info is loaded/refreshed in App.js
  setAuthHeaders();
  axios
      .get(createUrl(url))
      .then(response => {
        if (onSuccess) {
          onSuccess(response, onComplete);
        } else {
          onComplete(response.data?.status, response.data?.data, response.data?.errors);
        }
      })
      .catch(error => {
        if (onError) {
          onError(error, onComplete);
        } else {
          handleError(error, onComplete);
        }
      });
}

/**
 * Handles errors.  This will log to the console, show a toast and call the validation callback
 * onComplete has signature (errCode:number, [{message:"err msg here", fields:["fieldName"...]}...])
 */
export function handleError(errors, onComplete=null) {
  console.warn('System error: ', errors);
  if (errors?.response?.status === 401) {
    // If the user gets an "not authorized" error, then we will invalidate their session
    // This can occur when a user session expires in the backend but the browser still keeps the token in the front-end
    // Often when following a saved bookmark, or using a cached browser page.
    setForceLogout();
    window.location.reload(); // force a reload so the user is booted immediately
  } else {
    showErrorToast('Oops! An error has occurred.');
  }
  if (onComplete) {
    onComplete(500, null, [{message: "A system error occurred.", fields: []}]);
  }
}

/**
 * Takes an array of error objects and gets all their messages as a string to display to the user
 * @param errors [{message:"err msg here", fields:["fieldName"...]}...]
 */
export function getErrorMessages(errors) {
  if (!errors) {
    return "";
  }
  return errors.map(e => e.message).join(' - ');
}

// Used to stub the onSuccess callback eg. post(url, data, onCompleteDoNothing);
export const onCompleteDoNothing = (code, data, errors) => {
};
// Used to stub the onSuccess callback eg. get(url, onComplete, onSuccessDoNothing);
export const onSuccessDoNothing = (response, onComplete) => {
};
// Used to stub the onError callback eg. get(url, onComplete, onSuccess, onErrorDoNothing)
// THis will stop the error from logging and toasting
export const onErrorDoNothing = (error, onComplete) => {
};
