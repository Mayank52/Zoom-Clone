const socket = io("/");
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});

let myUserId;
let myVideoStream;
let isFirstCall = true;
