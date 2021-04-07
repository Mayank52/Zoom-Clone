const videoGrid = document.querySelector("#video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
let isFirstCall = true;

//to get video and audio input from browser => returns a Promise
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;

    //add my video to DOM
    addUserImg(myUserId);
    addVideoStream(myVideo, stream, myUserId, "initially video added");
  });
// .catch((err) => {
//   console.log(err);
// });

peer.on("open", (id) => {
  console.log("My id:", id);
  // myVideo.setAttribute("userid", id);
  myUserId = id;
  socket.emit("join-room", ROOM_ID, id);
  console.log("Room Joined");
});

//accept call from user
peer.on("call", (call) => {
  let userId = call.peer;
  console.log("call accepted from: ", call.peer);

  // Answer the call with an A/V stream.
  let delay = isFirstCall ? 1000 : 0;
  setTimeout(() => {
    console.log("My video stream before answering the call: ", myVideoStream);
    call.answer(myVideoStream);

    //add user image
    addUserImg(userId);

    const video = document.createElement("video");

    //show the video of user who we answered
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream, userId, "peer.on call ");
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
  console.log("Peer called");

  //add user image
  addUserImg(userId);

  const video = document.createElement("video");

  //show the video of user we called
  call.on("stream", (userVideoStream) => {
    console.log("!!!!!!!!!!!!!!!!", userVideoStream);
    addVideoStream(video, userVideoStream, userId, "connect to new user");
  });
};

//function to diplay the video in UI
const addVideoStream = (video, stream, userId, src) => {
  //set source for the video element as the userVideo input
  console.log("video added", src);
  video.srcObject = stream;

  //when the whole data is received then play the video
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  video.setAttribute("userid", userId);

  //add the created video element to the video grid div
  let userDiv = document.querySelector(
    `.user-video-container[userid = a${userId}]`
  );
  userDiv.append(video);
  // videoGrid.append(video);
};

const addUserImg = (userId) => {
  let userDiv = document.createElement("div");
  userDiv.classList.add("user-video-container");
  userDiv.setAttribute("userid", "a" + userId);

  let img = document.createElement("img");
  img.src = "./images/user.png";
  img.setAttribute("userid", userId);
  img.style.display = "none";

  userDiv.append(img);
  videoGrid.append(userDiv);
};

const removeVideo = (userId) => {
  let userDiv = document.querySelector(
    `.user-video-container[userid = a${userId}]`
  );
  userDiv.remove();
};

socket.on("play-video", (userId) => {
  playVideo(userId);
});

socket.on("stop-video", (userId) => {
  stopVideo(userId);
});

const playVideo = (userId) => {
  let videoTag = document.querySelector(
    `.user-video-container[userid = a${userId}] video`
  );
  let imgTag = document.querySelector(
    `.user-video-container[userid = a${userId}] img`
  );

  videoTag.style.display = "block";
  imgTag.style.display = "none";
};

const stopVideo = (userId) => {
  let videoTag = document.querySelector(
    `.user-video-container[userid = a${userId}] video`
  );
  let imgTag = document.querySelector(
    `.user-video-container[userid = a${userId}] img`
  );

  videoTag.style.display = "none";
  imgTag.style.display = "block";
};

socket.on("update-room-users", (roomUsers) => {
  console.log(roomUsers);
  //update in video containers and participants list

  //for all users whose video is disabled show there profile picture
  roomUsers.forEach((user) => {
    if (user.video == false) {
      let userImgTag = document.querySelector(
        `.user-video-container[userid = a${user.userId}] img`
      );

      userImgTag.style.display = "block";
    }
  });
});
