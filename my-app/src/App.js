import './App.css';

import Navbar from './components/NavBar.js';
import TextEditor from './components/TEXTEDITOR/TextEditor.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home-index.jsx';
import RoomPage from './pages/Room-index.jsx';

function App(){
  return (
    <div>
      <Navbar /> 
      <div>
        <Routes>
          <Route path='/VideoHomePage' element={<HomePage />} />
          <Route path='/room/:roomId' element={<RoomPage />} />
          <Route path="/document/:id" element={<TextEditor />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
