const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const gameRoutes = require('./routes/game');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.json());
app.use('/api/game', gameRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinGame', (gameId) => {
    socket.join(gameId);
    socket.to(gameId).emit('playerJoined', socket.id);
  });

  socket.on('sendChoice', (data) => {
    socket.to(data.gameId).emit('receiveChoice', {
      playerId: socket.id,
      choice: data.choice,
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
    console.log('New client connected');
  
    socket.on('createRoom', ({ username }) => {
      const roomId = shortid.generate(); // Generate a unique room ID
      socket.join(roomId);
      socket.emit('roomCreated', { roomId, username });
      console.log(`Room created: ${roomId} by ${username}`);
    });
  
    socket.on('joinRoom', ({ username, roomId }) => {
      const room = io.sockets.adapter.rooms[roomId];
      if (room && room.length < 2) {
        socket.join(roomId);
        socket.emit('roomJoined', { roomId, username });
        socket.to(roomId).emit('playerJoined', username);
        console.log(`${username} joined room: ${roomId}`);
      } else {
        socket.emit('roomFull', { roomId });
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });