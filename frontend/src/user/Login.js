import {Button, Col, Container, FloatingLabel, Form, Row} from "react-bootstrap";
import {getUserEmail, login} from "../api/UserApi";
import {useHistory} from "react-router-dom";
import {useContext, useState} from "react";
import {MathContext} from "../App";
import {fieldHasErrors, getErrorMessageForField} from "../utils/formUtils";
import {PageHeader} from "../menu/PageHeader";


export function Login() {
  const history = useHistory();
  const [usernameEmail, setUsernameEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const {loggedIn, } = useContext(MathContext);
  const [userLoggedIn, setUserLoggedIn] = loggedIn;

  function callLogin(event) {
    event.preventDefault();
    login(usernameEmail, password, (status, data, newErrors) => {
      if (status === 200) {
        setUserLoggedIn(true);
        history.push("/");
      } else {
        setErrors(newErrors);
      }
    });
  }

    return (
      <div>
        <PageHeader pageTitle= "Login" />
        <form onSubmit={callLogin}>
          <Container fluid className="math-container-narrow">
            <Row>
              <Col className="mb-3">
                <FloatingLabel
                    controlId="username"
                    label="Username / Email"
                >
                  <Form.Control
                      type="text"
                      name="username"
                      placeholder="username / email"
                      required
                      value={usernameEmail}
                      onChange={e => setUsernameEmail(e.target.value)}/>
                </FloatingLabel>
              </Col>
            </Row>

            <Row>
              <Col className="mb-3">
                <FloatingLabel controlId="password" label="Password">
                  <Form.Control type="password"
                                placeholder="Password"
                                name="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}/>
                </FloatingLabel>
              </Col>
            </Row>

            {fieldHasErrors(errors,'') &&
            <Row>
              <Col className="text-center mb-3 math-error-message" >
                {getErrorMessageForField(errors, '')}
              </Col>
            </Row>
            }

            <Row>
              <Col className="text-center mt-2 mb-3">
                <Button type="submit">Login</Button>
              </Col>
            </Row>

            <Row>
              <Col className="text-center mt-5 mb-3">
                Forgot your password?
                <Button className="btn btn-link" onClick={() => history.push("/forgot-password-send")}>Reset Password</Button>
              </Col>
            </Row>

            <Row>
              <Col className="text-center mb-3">
                Don't have an account yet?
                <Button className="btn btn-link" onClick={() => history.push("/register")}>Register</Button>
              </Col>
            </Row>

            {userLoggedIn &&
            <Row>
              <Col>
                You are already logged in as {getUserEmail()}
              </Col>
            </Row>
            }
          </Container>
        </form>
      </div>
  );
}
