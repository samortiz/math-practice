/* eslint-disable react-hooks/exhaustive-deps */
import "./App.scss"
import './global_styles.scss';
import React, {useEffect, useState} from "react";
import {BrowserRouter, Route, Switch,} from "react-router-dom";
import {Home} from "./user/Home";
import {Dashboard} from "./user/Dashboard";
import axios from "axios";
import {MainMenu} from "./menu/MainMenu";
import {getCurrentUser, isUserLoggedIn, setAuthHeaders} from "./api/UserApi";
import {library} from '@fortawesome/fontawesome-svg-core'
import {LOCAL_HOSTS} from "./constants";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  faAngleDown,
  faAngleUp,
  faBars,
  faCalendar,
  faCalendarDays,
  faChartLine,
  faCheckDouble,
  faCircle,
  faCircleCheck,
  faCircleMinus,
  faCircleQuestion,
  faCircleRight,
  faCircleXmark,
  faClipboardQuestion,
  faEnvelopeCircleCheck,
  faFileCirclePlus,
  faFileExcel,
  faGear,
  faHouse,
  faKey,
  faPeopleRoof,
  faPersonChalkboard,
  faPersonShelter,
  faPlus,
  faRightFromBracket,
  faRightToBracket,
  faScroll,
  faSpinner,
  faSquarePlus,
  faTrash,
  faUser,
  faUserClock,
  faUserGroup,
  faUserPlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import {Register} from "./user/Register";
import {Session} from "./session/Session";
// Import all the font-awesome fonts we are going to use in the site (Could do a mass import fas but that's around 1MB!)
library.add(
    faAngleUp, faAngleDown, faBars, faCalendar, faCheckDouble, faClipboardQuestion,
    faCalendarDays, faChartLine, faCircle, faCircleCheck, faCircleMinus, faCircleQuestion, faCircleXmark, faFileCirclePlus, faCircleRight,
    faEnvelopeCircleCheck, faFileExcel, faGear, faHouse, faKey, faPersonChalkboard,
    faPersonShelter, faPeopleRoof, faPlus, faRightFromBracket, faRightToBracket, faScroll, faSpinner, faSquarePlus, faTrash,
    faUser, faUserClock, faUserGroup, faUserPlus,
    faXmark,
)
// Setup Axios for local development - need to point to different backend
if (LOCAL_HOSTS[window.location.origin]) {
  axios.defaults.baseURL = LOCAL_HOSTS[window.location.origin];
  axios.defaults.maxRedirects = 0;
}

export const MathContext = React.createContext(null);

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(isUserLoggedIn());


  // When the app starts up we want to load the axios headers
  // If this is called twice it's not a big deal
  useEffect(() => {
    setAuthHeaders();
    if (userLoggedIn) {
      // Load fresh user data
      getCurrentUser(() => {});
    }
  }, []);

  return (
      <BrowserRouter>
        <MathContext.Provider value={
          {
            loggedIn: [userLoggedIn, setUserLoggedIn],
          }
        }>
          <div className="root-container">
            <ToastContainer/>
            <div className="root-left">
              <MainMenu/>
            </div>
            <div className="root-right">
              <Switch>
                <Route exact path="/"><Home/></Route>
                <Route path="/register"><Register/></Route>
                {userLoggedIn && <Route path="/dashboard"><Dashboard/></Route>}
                {userLoggedIn && <Route path="/session"><Session/></Route>}
              </Switch>
            </div>
          </div>
        </MathContext.Provider>
      </BrowserRouter>
  );
}
