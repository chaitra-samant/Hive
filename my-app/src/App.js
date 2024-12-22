import React from "react";
import KanbanBoard from "./KanbanBoard"; // Adjust the path as necessary

const App = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#222" }}>
      <KanbanBoard />
    </div>
  );
};

export default App;
