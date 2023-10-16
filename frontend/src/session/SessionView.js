import {PageHeader} from "../menu/PageHeader";
import {Container} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {getOrCreateNewSession} from "../api/SessionApi";
import './Session.scss';
import {handleError} from "../utils/networkUtils";

export function SessionView() {
  const [session, setSession] = useState(null);


  return (
      <div>
        <PageHeader pageTitle="View Session"/>
        <Container fluid className="math-container-wide">
           Session View

        </Container>
      </div>
  );
}
