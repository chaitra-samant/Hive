import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createGame = async () => {
  return await axios.post(`${API_URL}/game`);
};

// Add more API functions as needed