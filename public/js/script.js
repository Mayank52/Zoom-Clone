const socket = io("/");
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});

const videoGrid = document.querySelector("#video-grid");
const myVideo = document.createElement("video");
let myUserId;
let myVideoStream;
let isFirstCall = true;
myVideo.muted = true;

//Audio/Video========================================================================
//to get video and audio input from browser => returns a Promise
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    console.log("my video set");

    //add my video to DOM
    addVideoStream(myVideo, stream, "my video initially");
  })
  .catch((err) => {
    console.log(err);
  });

peer.on("open", (id) => {
  console.log("My id:", id);
  myVideo.id = id;
  myUserId = id;
  socket.emit("join-room", ROOM_ID, id);
  console.log("Room Joined");
});

//accept call from user
peer.on("call", (call) => {
  // console.log(call.peer);
  let userId = call.peer;
  console.log("call accepted from: ", call.peer);

  // Answer the call with an A/V stream.
  let delay = isFirstCall ? 1000 : 0;
  setTimeout(() => {
    console.log("My video stream before answering the call: ", myVideoStream);
    call.answer(myVideoStream);
    const video = document.createElement("video");
    video.id = userId;

    //show the video of user who we answered
    call.on("stream", (userVideoStream) => {
      // Show stream in some video/canvas element.
      addVideoStream(video, userVideoStream, "accepted call from user");
      // console.log("Call Accepted");
    });

    isFirstCall = false;
  }, delay);
});

//new user connected -> call new user
socket.on("user-connected", (userId) => {
  console.log("User Id:", userId);
  connectToNewUser(userId, myVideoStream);
});

//A User disconnected
socket.on("user-disconnected", (userId) => {
  console.log("user left!!!!!!!!!!!!!!!!!!!!");
  removeVideo(userId);
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  // console.log(call);
  console.log("Peer called");
  const video = document.createElement("video");
  video.id = userId;

  //show the video of user we called
  call.on("stream", (userVideoStream) => {
    // Show stream in some video/canvas element.
    console.log(userVideoStream);
    console.log(`${userId} Connected!!!!!!!!!!!!`);
    addVideoStream(video, userVideoStream, "new user connected");
  });
};

//function to diplay the video in UI
const addVideoStream = (video, stream, src) => {
  console.log("Called addVideoStream: ", src);
  console.log(stream);
  //set source for the video element as the userVideo input
  video.srcObject = stream;

  //when the whole data is received then play the video
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  //add the created video element to the video grid div
  videoGrid.append(video);
};

const removeVideo = (id) => {
  let videoContainer = document.querySelector(`${id}`);
  videoContainer.remove();
};

//Control Buttons====================================================================
let audioButton = document.querySelector(".audio-btn");
let videoButton = document.querySelector(".video-btn");

audioButton.addEventListener("click", () => {
  console.log(myVideoStream);
  let enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteAudio();
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    setMuteAudio();
  }
});

videoButton.addEventListener("click", () => {
  console.log(myVideoStream.getVideoTracks());
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    setStopVideo();
  }
});

const setMuteAudio = () => {
  let muteBtn = `
    <i class="fas fa-microphone"></i>
    Mute
  `;

  audioButton.innerHTML = muteBtn;
};
const setUnmuteAudio = () => {
  let unmuteBtn = `
    <i class="fas fa-microphone-slash mute-audio"></i>
    Unmute
  `;

  audioButton.innerHTML = unmuteBtn;
};
const setPlayVideo = () => {
  let stopVideoBtn = `
    <i class="fas fa-video-slash stop-video"></i>
    Play Video
  `;

  videoButton.innerHTML = stopVideoBtn;
};
const setStopVideo = () => {
  let playVideoBtn = `
    <i class="fas fa-video"></i>
    Stop Video
  `;

  videoButton.innerHTML = playVideoBtn;
};

//Chat===========================================================
socket.on("msg-received", (msg, userId) => {
  receiveMessage(msg, userId);
});

let input = document.querySelector("input");
let messagesContainer = document.querySelector(".messages");

input.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    //send message
    let msg = input.value;
    input.value = "";
    sendMessage(msg);
  }
});

let sendMessage = (msg) => {
  socket.emit("new-message", msg, ROOM_ID, myUserId);
};

let receiveMessage = (msg, userId) => {
  console.log("message received:", msg);
  let newChatContainer = document.createElement("div");
  newChatContainer.innerHTML = `
    <div class = "username"> user </div>
    <div class = "msg"> ${msg} </div>
  `;

  messagesContainer.append(newChatContainer);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};