import './App.css';

import Navbar from './components/NavBar.js';
import TextEditor from './components/TEXTEDITOR/TextEditor.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import HomePage from './pages/Home';
import RoomPage from './pages/Room';
function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Route for the document with a dynamic ID */}
          <Route path="/home" element={<Navbar />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/room/:roomId' element={<RoomPage/>}/>
          <Route path="/document/:id" element={<TextEditor />} />
        </Routes>
      </div>
    </Router>
 
    
  
  );
}

export default App;