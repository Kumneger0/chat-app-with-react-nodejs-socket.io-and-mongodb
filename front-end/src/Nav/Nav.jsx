import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Nav.css";
import { socket, userContext } from "../App";
const token = localStorage.getItem("auth_token");
export default function Nav() {
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    navigate("/login");
  };
  return (
    <>
      <nav className="navWrapper">
        <ul className="navBar">
          <li id="brand" className="item">
            <Link to="/">
              <h1>KUNE CHAT</h1>
            </Link>
          </li>
          {user && (
            <li className="item">
              <Link to="/chat">Chat</Link>
            </li>
          )}
          {!user && (
            <li className="item">
              <Link to="/login">Login/signup</Link>
            </li>
          )}
          {user && (
            <li className="item">
              <button onClick={logout}>logout {user}</button>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
