import "./Home.css";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { socket, userContext } from "../App";

export default function Home() {
  const { user, setUser } = useContext(userContext);
  const [allusers, setAllUsers] = useState([]);
  const AUTH_TOKEN = localStorage.getItem("auth_token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!AUTH_TOKEN) navigate("/login");
    socket.emit("send_allUsers", "all");
  }, []);
  const removeDuplicate = (arr) => {
    const users = arr.map((item) => {
      return item.username;
    });
    let unique = users.filter((item, index) => users.indexOf(item) === index);
    return unique;
  };

  socket.on("all_users", (all, username) => {
    const unique = removeDuplicate(all);
    setAllUsers(unique);
  });
  socket.on("connect", () => {
    socket.emit("send_allUsers", "all");
  });
  return (
    <>
      <div className="container">
        <h1>Online Users</h1>
        <div className="onlineUsers">
          {allusers.length > 0 &&
            allusers.map((onlineUser, id) => (
              <div className="users" key={id}>
                {user !== onlineUser && (
                  <Link to={`/chat/${onlineUser}`}>{onlineUser}</Link>
                )}
              </div>
            ))}
          {allusers.length == 1 && allusers[0] == user && (
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alighItem: "center",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                }}
              >
                {" "}
                Currently no online users available
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
