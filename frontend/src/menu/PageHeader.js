import {Link, useHistory} from "react-router-dom";
import React, {useContext} from "react";
import "./PageHeader.scss"
import {MathContext} from "../App";
import {getUserData, logout} from "../api/UserApi";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Dropdown from 'react-bootstrap/Dropdown';


export function PageHeader({pageTitle}) {
  const history = useHistory();
  const userData = getUserData();
  const {loggedIn} = useContext(MathContext);
  const [userLoggedIn, setUserLoggedIn] = loggedIn;

  function callLogout() {
    logout(history, setUserLoggedIn)
  }

  return (
      <div className="page-header">
        <div className="header-logo">
          <h2>{pageTitle}</h2>

          {userLoggedIn &&
          <Dropdown className="user-menu">
            <Dropdown.Toggle variant="dark" id="user-menu">
              Welcome {userData?.first_name}
            </Dropdown.Toggle>
            <Dropdown.Menu variant="dark">
              <Dropdown.Item as={Link} to="/"><FontAwesomeIcon icon="fa-house"/>Home</Dropdown.Item>
              <Dropdown.Item onClick={callLogout}>
                <FontAwesomeIcon icon="fa-right-from-bracket"/>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          }
        </div>
      </div>
  );
}
