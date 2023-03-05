import {toast} from "react-toastify";


export function getToastOptions() {
  return {
    position: toast.POSITION.TOP_RIGHT,
    hideProgressBar: true,
    autoClose: 3000, // ms
    close: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
}

export function showSuccessToast(message) {
  toast.success(message, getToastOptions());
}

export function showErrorToast(message) {
  toast.error(message, getToastOptions());
}

export function showInfoToast(message) {
  toast.info(message, getToastOptions());
}

/**
 * Makes a deep copy of the object (not including functions, and funny stuff... just JSON data)
 */
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function scrollToTop() {
  // NOTE: This doesn't always work on mobile all the time (android Chrome)
  // If there are network calls pending, then the page height may be small, and the page is not at the top after the data has loaded.
  // We could possibly add listeners (global var or axios Promise.all) to all the network calls and then wait for the final render
  setTimeout(() => {
    document.getElementById('menu-title').scrollIntoView({ behavior: "smooth" })
  }, 300);
}

/**
 * Returns the intersection of two arrays (in a new array)
 * intersect([1, 2, 3], [2,4,1,1]) => [1,2]
 */
export function intersect(a, b) {
  if (!a || !b || a.length === 0 || b.length === 0) {
    return [];
  }
  return a.filter(aVal => b.indexOf(aVal) > -1)
      .filter((e, i, c) => c.indexOf(e) === i); // remove duplicates
}

/***
 * Gets a random element from the array.
 */
export function getRandom(arr) {
  if (!arr || !arr.length) {
    return null;
  }
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}