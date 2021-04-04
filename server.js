const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// const cors = require('cors')
// app.use(cors())

//peerJS -> to send and receive video and audio in realtime
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(http, {
  debug: true,
});

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  // res.render("room");
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    console.log(`${userId} joined ${roomId}`);
  });

  socket.on("new-message", (msg, roomId, userId) => {
    console.log(msg);
    io.in(roomId).emit("msg-received", msg, userId);
  });

  //cant get the room id if person does not leave the meeting and presses the close button
  //possible solution -> keep a list of {socket id : (user id, room, id)} then use the socket id of disconnected user
  socket.on("disconnect", (roomId, userId) => {
    console.log("user left");
    socket.to(roomId).emit("user-disconnected", userId);
  });
});

const PORT = 3000 || process.env.PORT;
http.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
