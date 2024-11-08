const socket = io();

// Elements
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const sendButton = document.getElementById("send-button");
const audioButton = document.getElementById("audio-button");
const videoButton = document.getElementById("video-button");

let username = prompt("Enter your name:");

// Emit typing events and send messages
sendButton.addEventListener("click", () => {
    const message = input.value;
    if (message.trim()) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        socket.emit("send message", { user: username, message, time: timestamp });
        input.value = "";
    }
});

// Placeholder for recording audio
audioButton.addEventListener("click", () => {
    alert("Audio recording feature not implemented yet.");
});

// Placeholder for video call functionality
videoButton.addEventListener("click", () => {
    alert("Video call feature not implemented yet.");
});

// Display incoming messages with sender name and time
socket.on("receive message", (data) => {
    const messageElement = document.createElement("li");
    messageElement.classList.add("message-container");

    const senderName = document.createElement("div");
    senderName.classList.add("message-sender");
    senderName.innerText = data.user;

    const messageBubble = document.createElement("div");
    messageBubble.classList.add("message-bubble", data.user === username ? "sent" : "received");
    messageBubble.innerText = `${data.message}`;

    const messageTime = document.createElement("div");
    messageTime.classList.add("message-time");
    messageTime.innerText = data.time;

    messageElement.appendChild(senderName);
    messageBubble.appendChild(messageTime);
    messageElement.appendChild(messageBubble);
    messages.appendChild(messageElement);

    messages.scrollTop = messages.scrollHeight; // Scroll to bottom
});

// Online/offline status
socket.on("user connected", (user) => {
    const statusElement = document.createElement("div");
    statusElement.innerText = `${user} is online`;
    statusElement.style.color = "#888";
    messages.appendChild(statusElement);
});

socket.on("user disconnected", (user) => {
    const statusElement = document.createElement("div");
    statusElement.innerText = `${user} has left the chat`;
    statusElement.style.color = "#888";
    messages.appendChild(statusElement);
});
