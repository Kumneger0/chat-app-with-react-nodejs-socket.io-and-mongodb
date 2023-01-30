import React, { useRef } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "./validate.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Auth.css";
function Signup() {
  const navigate = useNavigate();
  const usernameRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const validUserRef = useRef();
  const alertRef = useRef();
  const validEmailRef = useRef();
  const passRef = useRef();
  const rePassRef = useRef();
  const register = async (e) => {
    e.preventDefault();
    if (passRef.current.value !== rePassRef.current.value) {
      alert("password not match");
      return;
    }
    const isValidEmail = validateEmail(emailRef.current.value);
    if (!isValidEmail) return (validEmailRef.current.style.display = "initial");
    validEmailRef.current.style.display = "none";

    const isStrongPass = validatePassword(passRef.current.value);
    if (!isStrongPass) return (alertRef.current.style.display = "initial");
    alertRef.current.style.display = "none";

    const res = await axios.post(
      "https://kunechat.kumnegerwondimu.repl.co/signup",
      {
        email: emailRef.current.value,
        password: passRef.current.value,
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        username: usernameRef.current.value,
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    if (res?.data?.err && res.data.err == "username")
      return (validUserRef.current.style.display = "initial");
    if (res?.data?.err && res.data.err == "email") {
      validEmail.current.innerText = "email taken";
      validEmail.current.style.display = "initial";
      return;
    }
    alert("account created");
    navigate("/login");
  };
  return (
    <>
      <div className="container">
        <Form className="wrapper">
          <Form.Group className="mb-3 " controlId="formBasicText">
            <Form.Label>FirstName</Form.Label>
            <Form.Control
              ref={firstNameRef}
              type="text"
              placeholder="FirstName"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>LastName</Form.Label>
            <Form.Control
              ref={lastNameRef}
              type="text"
              placeholder="LastName"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>username</Form.Label>
            <Form.Control
              ref={usernameRef}
              type="text"
              placeholder="username"
            />

            <Form.Text
              style={{
                display: "none",
              }}
              ref={validUserRef}
              className="text-muted"
            >
              username taken
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
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

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              ref={passRef}
              type="password"
              placeholder="Password"
            />
          </Form.Group>
          <Alert
            ref={alertRef}
            style={{
              display: "none",
            }}
            variant="warning"
          >
            <Alert.Heading>Error</Alert.Heading>
            <p>
              Password Should Contain uppercase one lowercase special character
              and number and minimum of of 4 digit
            </p>
          </Alert>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Re Enter Password</Form.Label>
            <Form.Control
              ref={rePassRef}
              type="password"
              placeholder="Re Enter Password"
            />
          </Form.Group>

          <Button
            onClick={register}
            className="btnLogin"
            variant="primary"
            type="submit"
          >
            Sign Up
          </Button>
        </Form>
      </div>
    </>
  );
}

export default Signup;
