let audioButton = document.querySelector(".audio-btn");
let videoButton = document.querySelector(".video-btn");
let leaveMeetingButton = document.querySelector(".leave-meeting");

leaveMeetingButton.addEventListener('click', ()=>{
    
})
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