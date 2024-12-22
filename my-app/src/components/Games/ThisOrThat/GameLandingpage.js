import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import './GameLandingpage.css';

const GamesLandingPage = () => {
  const navigate = useNavigate();  // Initialize useNavigate hook

  const handleTicTacToeClick = () => {
    navigate('/RealTimeTicTacToe');  // Navigate to Tic-Tac-Toe page when button is clicked
  };

  return (
    <div className="landing-page">
      <h1 className="title">Games Section</h1>
      <div className="cards-container">
        {/* Tic-Tac-Toe Card */}
        <div className="card">
          <p className="heading">Tic-Tac-Toe</p>
          <p>A mind-refreshing game!</p>
          <button onClick={handleTicTacToeClick} className="play-button">
            Play Now
          </button>
        </div>

        {/* Wordle Card */}
        <div className="card">
          <p className="heading">Wordle</p>
          <p>Guess the word in six tries!</p>
          <button className="play-button">Play Now</button>
        </div>
      </div>
    </div>
  );
};

export default GamesLandingPage;
