import { useParams } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { socket, userContext } from "../App";
import "./eachChat.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
export default function Each() {
  const { user, setUser } = useContext(userContext);
  const [messages, setMessages] = useState([]);
  const [isNoUser, setIsNoUser] = useState(false);
  const msgRef = useRef();
  const { id } = useParams();
  useEffect(() => {
    socket.emit("join_me", id);
    socket.emit("send", id);
  }, []);
  socket.on("joined", (msg) => {});

  function display(message) {
    setMessages(message);
    console.log(message);
  }

  socket.on("getIt", (message) => {
    display(message);
  });

  const send = (e) => {
    e.preventDefault();
    if (!msgRef.current.value) return;
    socket.emit("oneToOne", msgRef.current.value, id);
    msgRef.current.value = null;
  };

  socket.on("saved", (save) => {
    socket.emit("send", id);
  });

  socket.on("no_user", (noUser) => {
    setIsNoUser(!isNoUser);
  });
  return (
    <>
      <div className="container">
        {isNoUser && (
          <div className="notFound">404 user not found in our server sorry</div>
        )}
        {!isNoUser && <div className="user">{id}</div>}
        {!isNoUser && (
          <div className="msgwrapper">
            {messages?.length > 0 &&
              messages.map((msg, i) => {
                return (
                  <div
                    className="eachMessage"
                    style={{
                      width: "auto",
                      backgroundColor: user == msg.from ? "blue" : "initial",
                      color: msg.from == user ? "#fff" : "initial",
                      alignSelf: user == msg.from ? "end" : "start",
                    }}
                    key={i}
                  >
                    {msg.msg}
                  </div>
                );
              })}{" "}
          </div>
        )}

        <div className="d-flex inputBox">
          <div>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Control ref={msgRef} type="text" placeholder="message" />
            </Form.Group>
          </div>
          <div>
            <Button
              onClick={send}
              className="btnLogin"
              variant="primary"
              type="submit"
            >
              send
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
