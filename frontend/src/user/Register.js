import {Button, Col, Container, FloatingLabel, Form, Row} from "react-bootstrap";
import {getUserEmail, login, register} from "../api/UserApi";
import {useContext, useState} from "react";
import {MathContext} from "../App";
import {useHistory} from "react-router-dom";
import {fieldHasErrors, getErrorMessageForField} from "../utils/formUtils";
import {PageHeader} from "../menu/PageHeader";


export function Register() {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState([]);
  const {loggedIn} = useContext(MathContext);
  const [userLoggedIn, setUserLoggedIn] = loggedIn;

  function callRegister(event) {
    event.preventDefault();
    register(username, email, password, passwordConfirm, firstName, lastName, (status, data, newErrors) => {
      if (status === 200) {
        // We registered successfully - let's login
        login(username, password, (status, data, newErrors) => {
          if (status === 200) {
            setUserLoggedIn(true);
            history.push("/");
          } else {
            // This may not work as it isn't the login form!  But... general errors will work
            setErrors(newErrors);
          }
        });
      } else { // status is not 200
        setErrors(newErrors);
      }
    });
  }

  return (
      <div>
        <PageHeader pageTitle="Register"/>
        <Form onSubmit={callRegister}>
          <Container fluid className="math-container-narrow">
            <Row>
              <Col className="mb-3">
                <Form.Group controlId="username">
                  <FloatingLabel
                      controlId="username"
                      label="Username"
                  >
                    <Form.Control
                        type="text"
                        name="username"
                        placeholder="username"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        isInvalid={fieldHasErrors(errors, 'username')}/>
                    <Form.Control.Feedback type="invalid">
                      {getErrorMessageForField(errors, 'username')}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col className="mb-3">
                <Form.Group controlId="email">
                  <FloatingLabel
                      controlId="email"
                      label="Email"
                  >
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        isInvalid={fieldHasErrors(errors, 'email')}/>
                    <Form.Control.Feedback type="invalid">
                      {getErrorMessageForField(errors, 'email')}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col className="mb-3">
                <Form.Group controlId="password">
                  <FloatingLabel controlId="password" label="Password">
                    <Form.Control type="password"
                                  placeholder="Password"
                                  required
                                  name="password"
                                  value={password}
                                  onChange={e => setPassword(e.target.value)}
                                  isInvalid={fieldHasErrors(errors, 'password')}/>
                    <Form.Control.Feedback type="invalid">
                      {getErrorMessageForField(errors, 'password')}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col className="mb-3">
                <Form.Group controlId="passwordConfirm">
                  <FloatingLabel controlId="passwordConfirm" label="Confirm Password">
                    <Form.Control type="password"
                                  placeholder="Confirm Password"
                                  required
                                  name="passwordConfirm"
                                  value={passwordConfirm}
                                  onChange={e => setPasswordConfirm(e.target.value)}
                                  isInvalid={fieldHasErrors(errors, 'passwordconfirm')}/>
                    <Form.Control.Feedback type="invalid">
                      {getErrorMessageForField(errors, 'passwordconfirm')}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col className="mb-3">
                <Form.Group controlId="firstName">
                  <FloatingLabel controlId="firstName" label="First Name">
                    <Form.Control type="text"
                                  placeholder="First Name"
                                  required
                                  name="firstName"
                                  value={firstName}
                                  onChange={e => setFirstName(e.target.value)}
                                  isInvalid={fieldHasErrors(errors, 'first_name')}/>
                    <Form.Control.Feedback type="invalid">
                      {getErrorMessageForField(errors, 'first_name')}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col className="mb-3">
                <Form.Group controlId="lastName">
                  <FloatingLabel controlId="lastName" label="Last Name">
                    <Form.Control type="text"
                                  placeholder="Last Name"
                                  required
                                  name="lastName"
                                  value={lastName}
                                  onChange={e => setLastName(e.target.value)}
                                  isInvalid={fieldHasErrors(errors, 'last_name')}/>
                    <Form.Control.Feedback type="invalid">
                      {getErrorMessageForField(errors, 'last_name')}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>

            {fieldHasErrors(errors, '') &&
            <Row>
              <Col className="text-center mb-3 math-error-message">
                {getErrorMessageForField(errors, '')}
              </Col>
            </Row>
            }

            <Row>
              <Col className="text-center mb-3">
                <Button type="submit">Create Account</Button>
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
        </Form>
      </div>
  );

}
