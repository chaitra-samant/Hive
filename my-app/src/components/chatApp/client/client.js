import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

function App() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Load chat history
        socket.on('chat_history', (history) => {
            setMessages(history);
        });

        // Listen for new messages
        socket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('send_message', message);
            setMessage('');
        }
    };

    return (
        <div className="App">
            <div className="chat-container">
                <h1>Real-Time Chat</h1>
                <div className="chat-box">
                    {messages.map((msg, index) => (
                        <div key={index} className="chat-message">
                            <span>{new Date(msg.timestamp).toLocaleTimeString()}:</span> {msg.text}
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default App;
