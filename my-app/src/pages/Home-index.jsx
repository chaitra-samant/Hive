import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import './meetbutton.css';
import backgroundImage from "./wp3.jpg";

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
        <div style={
            {
              backgroundImage: `url(${backgroundImage})`,
                display: 'flex',  
                justifyContent: "center",
                alignItems: "center",
                // alignContent:"center"
                height: "100vh",
                backgroundColor: '#212121'

            }
        }>
            <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '400px', // Fixed width
        height: '400px', // Fixed height
        textAlign: 'center', // Center text within the container
        backgroundColor: 'white', // White background like the original div
        borderRadius: '1.5rem', // Optional, rounding the corners
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow effect
        padding: '10px', // Padding to add space inside the container
        backgroundColor: '#F9E6CF'
      }}
    >
      <div
        style={{
          marginBottom: '8px', // Reduced margin for smaller layout
          fontSize: '14px', // Adjusted font size to fit smaller container
          fontWeight: '500',
          color: '#4B5563', // Darker gray text color
        }}
      >
        <h2>Join</h2> {/* Title shortened to fit */}
        <p style={{ marginTop: '4px', fontSize: '18px', color: '#6B7280' }}>
          Enter Room Code
        </p>
      </div>

      <input
        className="meet-ip"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        placeholder="Room Code"
        style={{
          padding: '5px',
          margin: '5px 0', // Reduced margin for smaller container
          width: '90%', // Adjusted to be a bit smaller
          height:'50px',
          borderRadius: '8px', // Rounded edges for input
          border: '2px solid #D1D5DB', // Light border for input
          outline: 'none',
          fontSize: '12px', // Adjusted font size for smaller input
        }}
      />
      <br></br>
      <button
        onClick={handleJoinRoom}
        className="meet-button"
        style={{
          padding: '6px 12px',
          backgroundColor: '#000', // Black background for the button
          color: '#fff', // White text
          border: '2px solid #000', // Border color matches the background
          borderRadius: '9999px', // Fully rounded button
          fontSize: '12px', // Smaller font size
          cursor: 'pointer',
          transition: 'all 0.3s ease', // Smooth transition on hover
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = '#000';
          e.target.style.borderColor = '#000';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#000';
          e.target.style.color = '#fff';
          e.target.style.borderColor = '#000';
        }}
      >
        Join Meet
      </button>
    </div>
        </div>
    );
};

export default HomePage;
