import {Link, useHistory, useLocation} from "react-router-dom";
import React, {Fragment, useContext, useEffect, useState} from "react";
import "./MainMenu.scss"
import {MathContext} from "../App";
import {logout} from "../api/UserApi";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {isForceLogout} from "../utils/networkUtils";
import {scrollToTop} from "../utils/miscUtils";

export function MainMenu() {
  const history = useHistory();
  const [burgerExpanded, setBurgerExpanded] = useState(false);
  const {loggedIn,} = useContext(MathContext);
  const [userLoggedIn, setUserLoggedIn] = loggedIn;
  const location = useLocation();
  const currentPath = location.pathname;


  useEffect(() => {
    if (isForceLogout()) {
      callLogout(); // this will reset the forceLogout flag
    }
    if (burgerExpanded) {
      scrollToTop();
    }
    setBurgerExpanded(false);
  }, [location]);

  function toggleBurger() {
    scrollToTop();
    setBurgerExpanded(!burgerExpanded)
  }

  // These are children of the parent path - used for marking the left menu selected
  // The child paths are prefixes so child /a will match /asdf
  const childPaths = {};

  function getClassNames(path, mobileOnly = false) {
    let classNames = "menu-item "
    if (mobileOnly) {
      classNames += "menu-mobile-only "
    }
    // If path matches, or if the currentPath is a child we highlight
    if ((path === currentPath) || childPaths[path]?.find(p => currentPath.startsWith(p))) {
      classNames += "menu-selected-path "
    }
    return classNames
  }

  function callLogout() {
    logout(history, setUserLoggedIn)
  }

  return (
      <div className={"main-menu " + (burgerExpanded ? "burger-expanded" : "burger-collapsed")}>
        <div id='menu-title' className="menu-title">
          <FontAwesomeIcon icon="fa-bars" className="menu-burger" onClick={() => toggleBurger()}/>
          <div className="title">Math Practice</div>
        </div>

        {userLoggedIn &&
        <Fragment>
          <Link className={getClassNames("/")} to="/">
            <FontAwesomeIcon icon="fa-house"/>Dashboard
          </Link>
        </Fragment>
        }

        {userLoggedIn &&
        <div className={getClassNames("/logout", true)} onClick={callLogout}>
          <FontAwesomeIcon icon="fa-right-from-bracket"/>Logout
        </div>
        }
      </div>
  );
}
