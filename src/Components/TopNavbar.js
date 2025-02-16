import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import minilogo from "../Images/minilogo-2.png";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { useNavigate } from "react-router-dom";
// Dans le composant de la navbar (ButtonAppBar)
import { useUser } from "../Services/ContexteUser"; // Importation du hook du context

export default function ButtonAppBar() {
  const navigate = useNavigate();

  const { userData } = useUser();

  const isAdmin = userData?.statusUser === "admin";
  const isUser = userData?.statusUser === "utilisateur";

  const handleRedirect = (page) => {
    navigate(page);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          color: "rgba(90,20,121,254)",
          boxShadow: "none",
        }}>
        <Toolbar>
          {isAdmin && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "rgba(90,20,121,254)",
                color: "white",
                marginRight: 2,
              }}
              onClick={() => handleRedirect("/dashboard")}>
              <SupervisorAccountIcon />
            </Button>
          )}
          {isUser && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "rgba(90,20,121,254)",
                marginRight: 2,
                border: "none",
              }}>
              <ChatBubbleIcon onClick={() => handleRedirect("/messagerie")} />
            </Button>
          )}
          <Box component="div" sx={{ flexGrow: 1 }}>
            <img
              onClick={() => handleRedirect("/")}
              src={minilogo}
              alt="BetKiff Logo"
              style={{ width: "65px", height: "auto" }}
            />
          </Box>
          {/* Affichage conditionnel des données utilisateur */}
          {userData ? (
            <>
              <Typography
                variant="body1"
                sx={{
                  mr: 2,
                  color: "rgba(90,20,121,254)",
                  fontWeight: "bold",
                }}>
                {userData.nomUser}
              </Typography>
              <Box
                sx={{
                  borderRadius: "5px",
                  backgroundColor: "rgba(90,20,121,254)",
                }}>
                <Typography
                  variant="body1"
                  sx={{
                    margin: "0px 10px 0px 10px",
                    color: "white",
                  }}>
                  🤙🏻{userData.nbMonnaie}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography
              variant="body1"
              sx={{ mr: 2, color: "rgba(90,20,121,254)", fontWeight: "bold" }}>
              Chargement...
            </Typography>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
