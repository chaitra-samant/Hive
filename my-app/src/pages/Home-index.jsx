import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [value, setValue] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = useCallback(() => {
        if (value) {
            navigate(`/room/${value}`);
        } else {
            alert('Please enter a room ID');
        }
    }, [navigate, value]);

    return (
        <div style={{ padding: '20px' }}>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="text"
                placeholder="Enter Room Code.."
                style={{ padding: '8px', margin: '10px 0', width: '200px' }}
            />
            
            <button onClick={handleJoinRoom} style={{ padding: '8px', cursor: 'pointer' }}>Join Meet</button>
        </div>
    );
};

export default HomePage;
