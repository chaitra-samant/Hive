import React from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import { Button } from "@mui/material";  // Import MUI Button component
import { v4 as uuidV4 } from "uuid";

const MainPage = () => {
  const navigate = useNavigate();  // Initialize useNavigate

  const handleDocumentEditingClick = () => {
    const uniqueId = uuidV4();  // Generate a unique ID
    navigate(`/document/${uniqueId}`);  // Correctly navigate to the document route
  };

  return (
    <div className="container-fluid bee-hive-background">
      <div className="row">
        <div className="col-12 text-center">
          <div className="button-container">
            {/* MUI Buttons */}
            <Button variant="contained" color="primary" className="button corner-top-left">
              Video Conferencing
            </Button>
            <Button
              variant="contained"
              color="primary"
              className="button corner-top-right"
              onClick={handleDocumentEditingClick}
            >
              Document Editing
            </Button>
            <Button variant="contained" color="primary" className="button corner-bottom-left">
              Project Dashboard
            </Button>
            <Button variant="contained" color="primary" className="button corner-bottom-right">
              Team Chat
            </Button>
            <Button variant="contained" color="warning" className="button center">
              Fun Mini Games
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
