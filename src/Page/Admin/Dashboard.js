import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import { useUser } from "../../Services/ContexteUser";

const Dashboard = () => {
  const navigate = useNavigate();

  const { userData } = useUser();

  // Liste des cases avec les textes, routes et icônes
  const cases = [
    {
      text: "Créer pari",
      route: "/createBet",
      icon: <WhatshotIcon sx={{ fontSize: 40, color: "#ff5722" }} />,
    },
    {
      text: "Créer mini pari",
      route: "/createMiniBet",
      icon: <LocalFireDepartmentIcon sx={{ fontSize: 40, color: "#ff9800" }} />,
    },
    {
      text: "Créer défi flash",
      route: "/createFlash",
      icon: <FlashOnIcon sx={{ fontSize: 40, color: "#ffeb3b" }} />,
    },
    {
      text: "Ajouter cartes",
      route: "/addCards",
      icon: <AddToPhotosIcon sx={{ fontSize: 40, color: "#4caf50" }} />,
    },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        height: "100vh",
        width: "100vw",
        padding: "9vh 3vw 7vh 3vw",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Texte H1 */}
      <Typography
        variant="h1"
        sx={{ fontSize: "2.5rem", fontWeight: "bold", mb: 1 }}
      >
        Dashboard
      </Typography>

      {/* Texte en caption */}
      {userData && userData.nomUser && (
        <Typography
          variant="caption"
          sx={{ fontSize: "1rem", color: "rgba(90, 20, 121, 254)", mb: 2 }}
        >
          Bienvenue {userData.nomUser}
        </Typography>
      )}

      {/* Grille des cases */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1.5} sx={{ height: "100%" }}>
          {cases.map((item, index) => (
            <Grid item xs={6} key={index}>
              <Paper
                elevation={3}
                sx={{
                  border: "2px solid rgba(90, 20, 121)",
                  backgroundColor: "rgba(90, 20, 121, 0.9)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(90, 20, 121, 254)",
                  },
                }}
                onClick={() => navigate(item.route)} // Navigation lors du clic
              >
                {/* Icone */}
                {item.icon}
                {/* Texte */}
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    mt: 1,
                    color: "white",
                  }}
                >
                  {item.text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
