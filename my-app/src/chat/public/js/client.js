const socket = io(); // Automatically connects to the same host and port

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Sound notification for new messages
const audio = new Audio('notification.mp3'); // Include an audio file in your project

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll
    if (position === 'left') {
        audio.play(); // Play sound for incoming messages
    }
};

// Prevent empty messages
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

// Request user name and ensure it's not empty
let name;
do {
    name = prompt("Enter your name to join").trim();
} while (!name);

socket.emit('new-user-joined', name);

// Event listeners for socket events
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'left');
});
