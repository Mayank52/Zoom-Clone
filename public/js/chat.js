let input = document.querySelector("input");
let messagesContainer = document.querySelector(".messages");

socket.on("msg-received", (msg, userId) => {
  //receive message
  console.log("message received:", msg);
  let newChatContainer = document.createElement("div");
  newChatContainer.innerHTML = `
        <div class = "username"> user </div>
        <div class = "msg"> ${msg} </div>
      `;

  messagesContainer.append(newChatContainer);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

input.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    //send message
    let msg = input.value;
    input.value = "";
    socket.emit("new-message", msg, ROOM_ID, myUserId);
  }
});
