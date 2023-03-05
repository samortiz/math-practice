import React, {useEffect} from "react";
import {Button} from "react-bootstrap";
import './Keypad.scss';
import {INPUT_TYPE_ALL, INPUT_TYPE_INTEGER, INPUT_TYPE_POSITIVE_REAL, INPUT_TYPE_REAL, VALID_CHARS} from "../constants";

export function Keypad({onKeyDown, inputType}) {
  // We remove and add a listener on every render of the parent!  Yuck...
  useEffect(() => {
    const keyHandler = (event) => {
      event.target.blur();
      const keyVal = event.key;
      if (inputType !== INPUT_TYPE_ALL) {
        const validChars = VALID_CHARS[inputType];
        if (!validChars) {
          console.warn("Unable to handle inputType ", inputType);
          return;
        }
        if (!validChars.includes(keyVal)) {
          return;
        }
      }
      if (onKeyDown) {
        onKeyDown(event.key);
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('keydown', keyHandler);
    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }, [onKeyDown, inputType]);

  return (
      <div className="keypad-container">
        <div className="keypad-button-row">
          <Button id="button7" className="keypad-button" onClick={() => {onKeyDown('7')}}> 7 </Button>
          <Button id="button8" className="keypad-button" onClick={() => {onKeyDown('8')}}> 8 </Button>
          <Button id="button9" className="keypad-button" onClick={() => {onKeyDown('9')}}> 9 </Button>
        </div>
        <div className="keypad-button-row">
          <Button id="button4" className="keypad-button" onClick={() => {onKeyDown('4')}}> 4 </Button>
          <Button id="button5" className="keypad-button" onClick={() => {onKeyDown('5')}}> 5 </Button>
          <Button id="button6" className="keypad-button" onClick={() => {onKeyDown('6')}}> 6 </Button>
        </div>
        <div className="keypad-button-row">
          <Button id="button1" className="keypad-button" onClick={() => {onKeyDown('1')}}> 1 </Button>
          <Button id="button2" className="keypad-button" onClick={() => {onKeyDown('2')}}> 2 </Button>
          <Button id="button3" className="keypad-button" onClick={() => {onKeyDown('3')}}> 3 </Button>
        </div>
        <div className="keypad-button-row">
          <Button id="button0" className="keypad-button" onClick={() => {onKeyDown('0')}}> 0 </Button>
          {[INPUT_TYPE_REAL, INPUT_TYPE_POSITIVE_REAL].includes(inputType) &&
            <Button id="button." className="keypad-button" onClick={() => {onKeyDown('.')}}> . </Button>
          }
          {[INPUT_TYPE_INTEGER, INPUT_TYPE_REAL].includes(inputType) &&
            <Button id="button-" className="keypad-button" onClick={() => {onKeyDown('-')}}> - </Button>
          }
        </div>
      </div>
  );
}
