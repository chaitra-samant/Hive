import React from "react";
import { AppBar, Toolbar, Button, Container, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

// Make sure the link to Google Fonts is included in public/index.html
// <link href="https://fonts.googleapis.com/css2?family=Charmonman:wght@400;700&family=Playwrite+ES+Deco+Guides&family=Playwrite+HR+Lijeva+Guides&display=swap" rel="stylesheet">

const Navbar = () => {
  const navigate = useNavigate();

  const handleDocumentEditingClick = () => {
    const uniqueId = uuidv4();
    navigate(`/document/${uniqueId}`);
  };

  const handleVideoEditingClick = () => {
    navigate("/VideoHomePage");
  };

  const handleFunGameClick = () => {
    navigate("/GameLandingpage");
  };

  const handleHomePageClick = () => {
    navigate("/"); // Navigates to the homepage
  };

  const HandleTeamChatClick = ()=>{
    window.location.href = 'http://localhost:3000';
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#1A1A1A", // Dark background
        boxShadow: "none",
      }}
    >
      <Container maxWidth={false} disableGutters>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "64px",
            px: 3, // Padding left and right
          }}
        >
          {/* Hive as a clickable button with custom font and color */}
          <Button
            variant="text"
            sx={{
              color: "#fff", // A golden yellow shade for aesthetic appeal
              fontFamily: "'Charmonman', sans-serif", // Use 'Charmonman' font family
              fontWeight: 700,
              fontSize: "32px",
              letterSpacing: "1px",
              marginRight: "24px", // Add some space between logo and buttons
              textTransform: "none", // Prevents all-caps
              transition: "color 0.3s ease", // Smooth transition on hover
              "&:hover": {
                color: "#D4AC0D", // Darker yellow on hover for aesthetic effect
              },
            }}
            onClick={handleHomePageClick}
          >
            Hive
          </Button>

          {/* Buttons container */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px", // Consistent spacing between buttons
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#D7E8F7",
                color: "#000000",
                fontWeight: "bold",
                textTransform: "none", // Prevents all-caps
                padding: "8px 16px",
                "&:hover": { backgroundColor: "#BFDDEE" },
              }}
              onClick={handleVideoEditingClick}
            >
              Meet Now
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#DFF7D7",
                color: "#000000",
                fontWeight: "bold",
                textTransform: "none",
                padding: "8px 16px",
                "&:hover": { backgroundColor: "#C7EDBF" },
              }}
              onClick={handleDocumentEditingClick}
            >
              Create Document
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFF7D7",
                color: "#000000",
                fontWeight: "bold",
                textTransform: "none",
                padding: "8px 16px",
                "&:hover": { backgroundColor: "#FFEFC7" },
              }}
              onClick={HandleTeamChatClick}
            >
              Chat
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#F7D7D7",
                color: "#000000",
                fontWeight: "bold",
                textTransform: "none",
                padding: "8px 16px",
                "&:hover": { backgroundColor: "#EDC7C7" },
              }}
              onClick={handleFunGameClick}
            >
              Play!
            </Button>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
