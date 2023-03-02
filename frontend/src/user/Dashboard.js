import {PageHeader} from "../menu/PageHeader";
import {Col, Container, Row} from "react-bootstrap";
import React from "react";

export function Dashboard() {
  return (
      <div>
        <PageHeader pageTitle= "Dashboard" />
        <Container fluid className="math-container-wide">
          <Row className="u-card-top u-card-title">
            <Col className="col-12">
               TODO Some content would go here
            </Col>
          </Row>

        </Container>
      </div>
  );
}
