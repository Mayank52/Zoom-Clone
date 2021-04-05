const socket = io("/");
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});

let myUserId;
let myVideoStream;
let isFirstCall = true;
