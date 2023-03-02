// Utility functions for working with forms

import {intersect} from "./miscUtils";

export function errorAppliesToField(error, fieldName) {
  // No error, or general error not specific to any field
  if ((!error || !error.fields || !error.fields.length || error.fields.includes('')) && !fieldName) {
    return true;
  }
  if (error && error.fields) {
    return error.fields.includes(fieldName); // fieldName matches
  }
}

/**
 * Check if the field has an associated error
 * @param errors list of errors from backend
 * @param fieldName form field name
 * @returns {boolean} True if the field has an associated error
 */
export function fieldHasErrors(errors, fieldName) {
  for (const error of (errors || [])) {
    if (errorAppliesToField(error, fieldName)) {
      return true;
    }
  } // for error
  return false;
}

/**
 * Returns true if any field in the list has errors
 * @param errors error list object from backend
 * @param fieldNameList array of field names
 */
export function anyFieldHasErrors(errors, fieldNameList) {
  if (!errors || !fieldNameList || !fieldNameList?.length) {
    return false;
  }
  for (const fieldName of fieldNameList) {
    if (fieldHasErrors(errors, fieldName)) {
      return true;
    }
  }
  return false;
}

/**
 * Returns a single error message for all the errors associated to the field
 * @param errors list of all errors from backend
 * @param fieldName form field name
 * @returns {string} a single error message string
 */
export function getErrorMessageForField(errors, fieldName) {
  let message = "";
  for (const error of (errors || [])) {
    if (errorAppliesToField(error, fieldName)) {
      message += error?.message + " ";
    }
  } // for error
  return message.trim();
}

/**
 * Returns a single error message for all errors associated to any of the fields
 * @param errors list of all errors from backend
 * @param fieldNameList array of form field name
 * @returns {string} a single error message string
 */
export function getErrorMessageForAllFields(errors, fieldNameList) {
  let message = "";
  for (const fieldName of fieldNameList) {
      message += getErrorMessageForField(errors, fieldName) + " ";
  } // for fieldName
  return message.trim();
}

/**
 * Mutates the error array removing errors that match the field
 * @param errors list of all errors from backend
 * @param fieldNameList all the fields to filter out
 */
export function removeErrorsForFields(errors, fieldNameList) {
  if (!errors || errors.length === 0 || !fieldNameList || fieldNameList.length === 0) {
    return;
  }
  for (let i=errors.length-1; i>=0; i--) {
    if (intersect(errors[i]?.fields, fieldNameList).length > 0) {
      errors.splice(i,1);
    }
  }
}

