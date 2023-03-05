import {PageHeader} from "../menu/PageHeader";
import {Button, Container} from "react-bootstrap";
import React from "react";
import {useHistory} from "react-router-dom";

export function Dashboard() {
  const history = useHistory();

  function startSession() {
    history.push('/session');
  }

  return (
      <div>
        <PageHeader pageTitle= "Dashboard" />
        <Container fluid className="math-container-wide">
          <Button onClick={() => startSession()}> Start Session</Button>
        </Container>
      </div>
  );
}
