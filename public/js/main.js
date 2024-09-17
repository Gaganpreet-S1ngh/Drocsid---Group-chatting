const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

const socket = io();






//get the username and the room name
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

//get room and users

socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})


//joining the chat room


socket.emit("JoinRoom", { username, room });
//message from server
socket.on("New Message", message => {
    console.log(message);
    receiveMessage(message);


    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})


// Message sent

chatForm.addEventListener("submit", e => {
    e.preventDefault(); //preventing the event listener to write to file automatically

    //getting msg text

    const msg = e.target.elements.msg.value


    //emit message to server// sending to server

    socket.emit("chatMessage", msg);

    //get the message from the server again
    //done above in socket.on

    //clear the input box
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();


})



function receiveMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message'); //from the chat.html

    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
                    <p class="text">
                        ${message.message}
                    </p>`


    document.querySelector('.chat-messages').appendChild(div); //div chat-messages we add this div


}

// add room name
function outputRoomName(room) {
    roomName.innerHTML = `${room}`
}

// add the users

function outputUsers(users) {
    usersList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join(' ')}

    `
}
