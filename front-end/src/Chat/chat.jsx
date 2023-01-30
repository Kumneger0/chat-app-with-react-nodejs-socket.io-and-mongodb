import { useEffect, useState, useContext } from "react";
import { socket, userContext } from "../App.jsx";
import { Link, useNavigate } from "react-router-dom";
import "./chat.css";
function Chat() {
  const { user } = useContext(userContext);

  const [allChats, setAllChats] = useState([]);
  const AUTH_TOKEN = localStorage.getItem("auth_token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!AUTH_TOKEN) navigate("/login");
    if (!user) return;
    socket.emit("all_chats", user);
  }, []);

  socket.on("DBConnectError", (err) => {
    // console.log(err)
  });

  const removeDuplicate = (arr) => {
    const users = arr.map((item) => {
      return item.name;
    });
    let unique = users.filter(
      (item, index) => users.indexOf(item) === index && item !== user
    );
    return unique;
  };

  socket.on("allChats", (all) => {
    const unique = removeDuplicate(all);
    setAllChats(unique);
  });
  return (
    <>
      <div className="container">
        <div className="allChat">
          <h3>All Chats </h3>
          <div className="previousChat">
            {allChats.length > 0 &&
              allChats.map((chat, i) => (
                <div className="linkToEachChat" key={i}>
                  <Link to={`/chat/${chat}`}>{chat}</Link>
                </div>
              ))}
          </div>
          <div>
            {allChats.length == 0 && (
              <div>You don't have previous chat history</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default Chat;
