import React from "react";
import { AppBar, Toolbar, Button, Container } from "@mui/material";
import { v4 as uuidv4 } from "uuid"; // Corrected import for uuid
import { useNavigate } from "react-router-dom";

// Navbar Component
const Navbar = () => {
  const navigate = useNavigate();

  // const handle

  const handleDocumentEditingClick = () => {
    const uniqueId = uuidv4();
    navigate(`/document/${uniqueId}`);
  };

  const handleVideoEditingClick = ()=>{
    navigate('/VideoHomePage')
  }

  const handleFunGameClick = ()=>{
    navigate('/GameLandingpage')
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#4B0082", boxShadow: "none" }}>
      <Container>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#D1C4E9", // Light purple
              color: "#000000", // Black text
              fontWeight: "bold",
              margin: "0 10px",
              "&:hover": { backgroundColor: "#B39DDB" }, // Slightly darker on hover
            }}
            onClick={handleVideoEditingClick}
          >
            Video Conferencing
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#8BC34A", // Light green
              color: "#000000",
              fontWeight: "bold",
              margin: "0 10px",
              "&:hover": { backgroundColor: "#7CB342" }, // Slightly darker on hover
            }}
            onClick={handleDocumentEditingClick}
          >
            Document Editing
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FFD700", // Yellow
              color: "#000000",
              fontWeight: "bold",
              margin: "0 10px",
              "&:hover": { backgroundColor: "#FFC107" }, // Slightly darker on hover
            }}
          >
            Team Chat
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FF5722", // Light orange
              color: "#000000",
              fontWeight: "bold",
              margin: "0 10px",
              "&:hover": { backgroundColor: "#E64A19" }, // Slightly darker on hover
            }}
            onClick={handleFunGameClick}
          >
            Fun Games
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
