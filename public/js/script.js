const socket = io("/");
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});

//Port : 443 for heroku

let myUserId;
let myVideoStream;
const roomId = ROOM_ID;