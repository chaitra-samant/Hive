import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>This or That Game</h1>
      <Link to="/lobby">Join a Game</Link>
    </div>
  );
};

export default Home;