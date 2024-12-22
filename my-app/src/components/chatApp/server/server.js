const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));

// Define Message Schema
const messageSchema = new mongoose.Schema({
    text: String,
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send chat history when a client connects
    Message.find()
        .sort({ timestamp: 1 })
        .then((messages) => {
            socket.emit('chat_history', messages);
        })
        .catch((err) => console.error(err));

    // Handle incoming messages
    socket.on('send_message', (data) => {
        const newMessage = new Message({ text: data });
        newMessage.save()
            .then(() => {
                io.emit('receive_message', newMessage);
            })
            .catch((err) => console.error(err));
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
