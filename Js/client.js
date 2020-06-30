// We'll connect this website with the node server

const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

const audio = new Audio('pop.mp3');

// This append function we're using below 
const append = (message, position , class1 ) => {

    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageElement.classList.add(class1) ;
    messageContainer.appendChild(messageElement);

    if (position === 'left' || position === 'middle') {
        audio.play();
    }
}

const name = prompt('Enter your name to join : ');

// We are emitting 'new-user-joined' event whenever a new user joins so that the socket.io server can listen this event.
socket.emit('new-user-joined', name);

// Then socket.io server will emit 'user-joined' event and we will listen that and do our action.
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'middle' , 'join');
})


// We're doing the same with the events below

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You : ${message}`, 'right' , 'msg');

    socket.emit('send', message);
    messageInput.value = '';
})


socket.on('recieve', data => {
    append(` ${data.name} : ${data.message} `, 'left' , 'msg');
})

socket.on('left', name => append(`${name} has left the chat`, 'middle' , 'leave'));
