// This is Node server which will handle socket io connections

// So basically we can think that this is the global server to which each user's local server will connect


// We Are Running a socket.io server , which attaches itself with an instance of http
// This socket.io server will listen incoming events
// We Can Use Any Other Port Also
const io = require('socket.io')(8000);

// This Will Store Teh User Socket-id
const users = {};

// io.on is a socket.io instance , which will listen many socket connections
// Whenever Connection has come to this Socket , Run an Arrow Function
io.on('connection', socket => {

    // socket.on will handle a particular connection's events

    // This socket.on will give socket-id  to the user , whenever it gets new-user-joined event , means whenever a new user joins
    socket.on('new-user-joined', name => {
        users[socket.id] =  name ;
        
        // This will emit the event to everyone except the serder one
        socket.broadcast.emit('user-joined',name);
    });

    // Here new-user-joined , user-joined... this all are our given events name

    socket.on('send', message => {
        socket.broadcast.emit('recieve',{message:message, name: users[socket.id]});
    });

    // If Any Connection is broken that will fire disconnect event by default , and our socket,io will listen that event
    socket.on('disconnect', () => {
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
})