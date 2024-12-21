import React from 'react';
import './GameLandingpage.css';

const GamesLandingPage = () => {
  return (
    <div className="landing-page">
      <h1 className="title">Games Section</h1>
      <div className="cards-container">
        <div className="game-card">
          <h2>This or That</h2>
          <p>A fun decision-making game!</p>
          <button className="play-button">Play Now</button>
        </div>
        <div className="card">
        <p className="heading">
    Wordle
  </p>
          <p>Guess the word in six tries!</p>
          <button className="play-button">Play Now</button>
        </div>
      </div>
    </div>
  );
};

export default GamesLandingPage;