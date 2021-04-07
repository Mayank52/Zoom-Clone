const socket = io("/");
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});

//Port : 443 for heroku

let myUserId;
let myVideoStream;
const roomId = ROOM_ID;
