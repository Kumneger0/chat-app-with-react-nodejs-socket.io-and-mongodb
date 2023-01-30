import React, { useState, useEffect, createContext } from "react";
import Chat from "./Chat/chat";
import Each from "./Chat/eachChat";
import { io } from "socket.io-client";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Nav from "./Nav/Nav";
import Home from "./Home/Homepage";
import Footer from "./footer/Footer";
import "./app.css";
export const userContext = createContext();
const AUTH_TOKEN = localStorage.getItem("auth_token");
export let socket = io("wss://kunechat.kumnegerwondimu.repl.co", {
  auth: {
    token: AUTH_TOKEN,
  },
});
function App() {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (!AUTH_TOKEN) {
      navigate("/login");
    }
  }, []);

  socket.on("connect", () => {
    socket.emit(
      "send_myInfo",
      "my",
      localStorage.getItem("auth_token"),
      socket.id
    );
  });

  socket.on("myInfo", (myInfo) => {
    setUser(myInfo.user.username);
  });

  return (
    <>
      <userContext.Provider value={{ user, setUser }}>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<Each />} />
        </Routes>

        <Footer />
      </userContext.Provider>
    </>
  );
}

export default App;
