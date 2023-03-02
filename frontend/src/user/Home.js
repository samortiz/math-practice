import {isUserLoggedIn} from "../api/UserApi";
import {Dashboard} from "./Dashboard";
import {Login} from "./Login";

export function Home() {
  const loggedIn = isUserLoggedIn();
  return  loggedIn ? <Dashboard/> : <Login/>;
}
