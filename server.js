const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

let db = [];
//{socketId, peerId, roomId, username, video: true}

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

    db.push({
      userId: userId,
      socketId: socket.id,
      roomId: roomId,
      video: true,
    });

    socket.to(roomId).emit("user-connected", userId);

    let roomUsers = db.filter((user) => {return user.roomId == roomId});
    console.log(roomUsers);

    socket.emit("update-room-users", roomUsers);
    console.log(`${userId} joined ${roomId}`);
  });

  socket.on("new-message", (msg, roomId, userId) => {
    console.log(msg);
    io.in(roomId).emit("msg-received", msg, userId);
  });

  socket.on("play-video", (roomId, userId) => {
    let user = db.indexOf(userId);
    user.video = true;
    io.in(roomId).emit("play-video", userId);
  });
  socket.on("stop-video", (roomId, userId) => {
    let user = db.indexOf(userId);
    user.video = false;
    io.in(roomId).emit("stop-video", userId);
  });

  socket.on("disconnect", (roomId, userId) => {
    console.log("user left", socket.id);

    //get the user object
    let userObj = db.filter((user) => {
      return user.socketId == socket.id;
    });

    //remove the user object from db
    db = db.filter((user) => {
      return user.socketId != socket.id;
    });

    console.log(userObj);
    console.log(db);

    if (userObj && userObj[0])
      socket.to(userObj[0].roomId).emit("user-disconnected", userObj[0].userId);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
