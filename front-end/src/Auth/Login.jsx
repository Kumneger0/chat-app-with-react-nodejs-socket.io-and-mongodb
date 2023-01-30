import React, { useRef, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { validateEmail } from "./validate.js";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { userContext } from "../App.jsx";
import "./Auth.css";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
function Login() {
  const { user, setUser } = useContext(userContext);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      navigate("/");
    }
  }, [user]);
  const emailRef = useRef();
  const errRef = useRef();
  const validEmailRef = useRef();
  const passwordRef = useRef();
  const wrongAccountRef = useRef();
  const checkEmailOnChange = (email) => {
    const status = validateEmail(email);
    if (!status) return (validEmailRef.current.style.display = "initial");
    validEmailRef.current.style.display = "none";
  };

  const login = async (e) => {
    e.preventDefault();
    const emailStatus = validateEmail(emailRef.current.value);
    if (!emailStatus) {
      validEmailRef.current.style.display = "initial";
      return;
    }
    const res = await axios.post(
      "https://kunechat.kumnegerwondimu.repl.co/login",
      { email: emailRef.current.value, password: passwordRef.current.value },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

    if (res.data.err) {
      errRef.current.innerText = res.data.err;
      wrongAccountRef.current.style.display = "initial";
      return;
    }
    if (res.data.auth_token) {
      localStorage.setItem("auth_token", res.data.auth_token);
      setUser(res.data.user.username);
    }
  };
  return (
    <>
      <div className="container loginContainer">
        <Form className="formLogin">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onChange={() => checkEmailOnChange(emailRef.current.value)}
              ref={emailRef}
              type="email"
              placeholder="Enter email"
            />
            <Form.Text
              style={{
                display: "none",
              }}
              ref={validEmailRef}
              className="text-muted"
            >
              Please Enter valid Email
            </Form.Text>
          </Form.Group>
          <Alert ref={wrongAccountRef} className="invalidAccount">
            <Alert.Heading>Error</Alert.Heading>
            <p ref={errRef}>
              Password Should Contain uppercase one lowercase special character
              and number and minimum of of 4 digit
            </p>
          </Alert>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              ref={passwordRef}
              type="password"
              placeholder="Password"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="keep me logged in" />
          </Form.Group>
          <Button
            onClick={login}
            className="btnLogin"
            variant="primary"
            type="submit"
          >
            Login
          </Button>
        </Form>
        <div>
          <div id="or">or</div>
          <Link to="/signup">
            {" "}
            <Button className="btnToSign" variant="danger" type="submit">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login;
