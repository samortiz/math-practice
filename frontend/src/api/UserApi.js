import axios from "axios";
import {
  clearForceLogout,
  get,
  handleError,
  LOCAL_STORAGE_KEY_USER_DATA,
  LOCAL_STORAGE_KEY_USER_LOGGED_IN,
  LOCAL_STORAGE_KEY_USER_TOKEN,
  post,
  setCurrentUser,
  setToken,
  unsetCurrentUser
} from "../utils/networkUtils";


/**
 * Logs a user into the site. Gets their token and user info and sets it.
 */
export function login(usernameEmail, password, onComplete) {
  const data = {username_email: usernameEmail, password: password};
  const onSuccess = (response, onComplete) => {
    handleResponseToken(response, onComplete);
  };
  const onError = (error, onComplete) => {
    unsetCurrentUser();
    handleError(error, onComplete);
  };
  post("login/", data, onComplete, onSuccess, onError);
}

/**
 * This will handle receiving a new token from the server.
 * This calls getCurrentUser and onComplete is called after the new user is loaded.
 * The calling code needs to handle calling setUserLoggedIn(true) in the onComplete if you want the UI to update (left menu items etc..).
 * You may also need to call setEmailVerified(true)
 */
export function handleResponseToken(response, onComplete) {
  if (response.data?.status === 200) {
    // Successful login responding with a new token
    const token = response.data?.data?.token;
    if (token) {
      setToken(token);
      // Load the newly logged in user
      getCurrentUser(onComplete);
    } else {
      // Should not happen.. if the server sends a 200 it should include a token
      onComplete(400, null, [{message: "Did not receive token from server.", fields: []}]);
    }
  } else {
    // There was a validation error 400 etc..
    onComplete(response.data?.status, null, response.data?.errors);
  }
}


/**
 * This will set the auth headers with axios if the user is currently logged in and the header is missing
 * This is used if the user reloads the page, the localStorage has their login token, but the JS is reloaded
 */
export function setAuthHeaders() {
  if (!axios.defaults.headers.common["Authorization"]) {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY_USER_TOKEN);
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Token " + token;
    }
  }
}

/**
 * Calls the /me endpoint and gets the user's data. This will store the user data in localStorage
 * onComplete : callback function with signature (errCode:number, [{message:"err msg here", fields:["fieldName"...]}...])
 *    This callback will be called after the endpoint responds with a success or failure.
 *    Check the errCode for 200 for success
 */
export function getCurrentUser(onComplete) {
  const onSuccess = (response, onComplete) => {
    setCurrentUser(response.data?.data);
    onComplete(200, null, []);
  };
  const onError = (error, onComplete) => {
    unsetCurrentUser();
    handleError(error, onComplete);
  };
  get("me/", onComplete, onSuccess, onError);
}

export function isUserLoggedIn() {
  const isLoggedIn = localStorage.getItem(LOCAL_STORAGE_KEY_USER_LOGGED_IN);
  return isLoggedIn === "yes";
}

export function getUserEmail() {
  return getUserData()?.email;
}

export function getUserId() {
  return getUserData()?.id;
}


export function hasPermission(permission) {
  // Everyone has no permission
  if (!permission) {
    return true;
  }
  const userData = getUserData();
  if (!userData || !userData.permissions) {
    return false;
  }
  return userData.permissions.includes(permission);
}

/**
 * @returns The object with all the user data, or null if not logged in or the data can't be found
 *  eg. {id, username, email, email_verified, first_name, last_name...}
 */
export function getUserData() {
  const userDataStr = localStorage.getItem(LOCAL_STORAGE_KEY_USER_DATA);
  if (!userDataStr) {
    return null;
  }
  return JSON.parse(userDataStr);
}

/**
 * Logs the user out, then navigates to home
 */
export function logout(history, setUserLoggedIn) {
  // This will be called for onSuccess and onError (only one will be called)
  const logOut = () => {
    // we won't log or notify about errors logging out!  The network traffic will show the error anyway.
    unsetCurrentUser();
    setUserLoggedIn(false);
    clearForceLogout(); // if it's set (probably not)
    history.push("/");
  }
  get("logout/", null, logOut, logOut);
}

/**
 * Registers a new user on the site.
 * onComplete : callback function with signature (errCode:number, [{message:"err msg here", fields:["fieldName"...]}...])
 *    This callback will be called after the endpoint responds with a success or failure.
 *    Check the errCode for 200 for success
 */
export function register(username, email, password, passwordConfirm, firstName, lastName, onComplete) {
  const data = {
    username: username,
    email: email,
    password: password,
    password_confirm: passwordConfirm,
    first_name: firstName || '',
    last_name: lastName || '',
  };
  post("register/", data, onComplete);
}