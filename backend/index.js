require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const server = require("http").createServer(app);
const mongoose = require("mongoose");
const { users, token } = require("./Model/userModel.js");
let DBconnecStatus = false;
mongoose
  .connect(process.env.DB_URI_2)
  .then((res) => {
    console.log("connected");
    DBconnecStatus = true;
  })
  .catch((err) => {
    console.log(err);
  });
app.use(cors());
app.use(express.json());
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.use(function (socket, next) {
  if (socket.handshake.auth) {
    const token = socket.handshake.auth.token.split(" ")[1];
    jwt.verify(token, "privateKey", function (err, decoded) {
      if (err) {
        return next(new Error("Authentication error"));
      }
      socket.decoded = decoded.user;
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
});
io.on("connection", async (client) => {
  console.log(`connected ${client.id}`);

  const sockets = (await io.fetchSockets()).map((socket) => {
    return {
      id: socket.id,
      username: socket.decoded.username,
      firstName: socket.decoded.firstName,
      lastName: socket.decoded.lastName,
    };
  });
  client.on("new-message", (msg) => {
    io.emit("recieve", msg);
  });

  client.on("join_me", async (room) => {
    if (!DBconnecStatus) return;
    const user = sockets.filter((user) => user.username == room);
    if (user.length > 0) {
      client.join(user[0].id);
      io.to(user[0].id).emit("joined", "joined");
    }
    const isThereUserInDB = await users.findOne({ username: room });
    if (!isThereUserInDB?.username)
      return io.to(client.id).emit("no_user", "no user found");
  });

  client.on("oneToOne", async (msg, room) => {
    if (!DBconnecStatus) return;
    console.log(msg);
    let user;
    try {
      user = await users.findOne({ username: room });
    } catch (err) {}

    if (!user?.username)
      return io.to(client.id).emit("no_user", "no user found");

    let user2;
    try {
      user2 = await users.findOne({ username: client.decoded.username });
    } catch (err) {}

    const chatVar =
      user.chats.length > 0
        ? user.chats.find((ele) => ele.name == client.decoded.username)
        : {};

    const chatVar2 =
      user2.chats.length > 0 ? user2.chats.find((ele) => ele.name == room) : {};

    const mesag = chatVar?.messages?.length > 0 ? [...chatVar.messages] : [];

    const mesag2 = chatVar2?.messages?.length > 0 ? [...chatVar2.messages] : [];

    const messages = [];
    const msgObj = {
      msg,
      from: client.decoded.username,
      to: user.username,
    };
    messages.push(msgObj);
    if (mesag.length > 0 && mesag2.length > 0) {
      mesag.push(msgObj);

      chatVar.messages = mesag;
      chatVar2.name = room;
      chatVar2.messages = mesag;
      let idx;
      let idx2;
      user.chats.forEach((ele, i) => {
        if (ele.name == client.decoded.username) {
          idx = i;
        }
      });
      user2.chats.forEach((ele, i) => {
        if (ele.name == room) {
          idx2 = i;
        }
      });
      user.chats[idx] = chatVar;
      user2.chats[idx2] = chatVar2;
      await user.save();
      await user2.save();
      io.emit("saved", "saved");
      displayToConsole(client.decoded.username, room);
    }
    const obj = {
      name: client.decoded.username,
      messages,
    };
    const obj2 = {
      name: room,
      messages,
    };
    if (mesag.length == 0 && mesag2.length == 0) {
      user.chats.push(obj);
      user2.chats.push(obj2);
      await user.save();
      await user2.save();
      displayToConsole(client.decoded.username, room);
      io.emit("saved", "saved");
    }
  });

  client.on("all_chats", async (user) => {
    if (!DBconnecStatus) {
      io.to(client.id).emit("DBConnectError", "DB not connected");
      return;
    }
    const myProfile = await users.findOne({ username: user });
    io.to(client.id).emit("allChats", myProfile.chats);
  });

  client.on("send", async (room) => {
    if (!DBconnecStatus) return;
    const user = await users.findOne({ username: client.decoded.username });
    let messages;
    let name;
    user.chats.forEach((chat) => {
      if (chat.name == room) {
        name = chat.name;
        messages = chat.messages;
      }
    });

    if (!name) return;
    io.to(client.id).emit("getIt", messages);
  });

  client.on("send_allUsers", (all) => {
    io.to(client.id).emit("all_users", sockets, client.decoded.username);
  });

  client.on("send_myInfo", async (msg, token, id) => {
    if (token) {
      const urData = await verifyToken(token.split(" ")[1]);
      io.to(id).emit("myInfo", urData);
    } else {
      io.emit("myInfo", client.decoded);
    }
  });
});
async function displayToConsole(user, target) {}
async function verifyToken(token) {
  let decodedToken;
  await jwt.verify(token, "privateKey", function (err, decoded) {
    if (err) {
      return err;
    }
    decodedToken = decoded;
  });
  return decodedToken;
}

app.post("/login", async (req, res) => {
  let AUTH;
  let pasWrong;
  const { email, password } = req.body;
  let user;
  try {
    user = await users.findOne({ email });
  } catch (err) {}

  if (!user?.email)
    return res.json({
      err: "There is no account assosiated with your email please check it again",
    });
  const hash = user.password;

  const isCorrect = bcrypt.compareSync(password, hash);
  if (!isCorrect) return res.json({ err: "pasword not correct" });

  AUTH = jwt.sign({ user }, "privateKey");

  res.json({ auth_token: `Bearer ${AUTH}`, user });
  console.log(AUTH);
});

app.post("/signup", async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;
  const cheek = await users.findOne({ username });
  const isEmailNotUsed = await users.findOne({ email });
  if (cheek?.username) return res.json({ err: "username" });

  if (isEmailNotUsed?.email) return res.json({ err: "email" });
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      if (err) {
        console.log(err);
      }
      console.log(hash);
      const newUser = new users({
        username,
        firstName,
        lastName,
        email,
        password: hash,
      });
      await newUser.save();
      console.log(newUser);
      res.json(newUser);
    });
  });
});

server.listen(3000);
