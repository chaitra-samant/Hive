import "./App.css";
import Navbar from "./components/NavBar.js";
import TextEditor from "./components/TEXTEDITOR/TextEditor.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Corrected import
import HomePage from "./pages/Home-index.jsx";
import RoomPage from "./pages/Room-index.jsx";
import GamesLandingpage from "./components/Games/ThisOrThat/GameLandingpage.js";
import React from "react";
import KanbanBoard from "./KanbanBoard.js"; // Adjust the path as necessary
import Client from "./components/chatApp/client/Client.js"

const App = () => {
  return (
    <div>
      <Navbar />
      <div style={{ height: "100vh" }}>
        <Routes>
          <Route path="/VideoHomePage" element={<HomePage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/document/:id" element={<TextEditor />} />
          <Route path="/GameLandingpage" element={<GamesLandingpage />} />
          <Route path = "/TeamChatPage" element = {<Client/>}/>
          <Route path="/" element={<KanbanBoard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;