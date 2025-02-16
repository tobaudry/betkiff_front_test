import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import logo from "../../../Images/logo.png";
import logo330 from "../../../Images/330logo.png";
import "../../../Styles/Compte/Connexion.css";

const AttenteInscription = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="xs"
      className="connexion-container"
      sx={{ padding: "0px" }}
    >
      <Box className="logo-container">
        <img src={logo} alt="App Logo" className="logo" />
      </Box>

      <Container maxWidth="xs" className="connexion-box">
        <Box textAlign="left">
          <Typography
            variant="h5"
            component="h1"
            className="connexion-title"
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            Rejoins l'aventure !
          </Typography>
        </Box>
        <Box mt={5} mb={5}>
          <Typography
            variant="h5"
            component="h1"
            className="connexion-title"
            sx={{
              fontSize: "1.1rem",
              fontWeight: "bold",
              textAlign: "center",
            //   color: "rgba(215,147,220,255)",
            }}
          >
            Pour avoir le lien d'inscription à Betkiff, prends contact avec
            l'admin du bureaux des élèves de ton école
          </Typography>
        </Box>
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <p>
            <button
              type="button"
              onClick={() => navigate("/connexion")}
              className="forgot-password-button"
            >
              J'ai déjà un compte !
            </button>
          </p>
          <Box className="powered-by">
            {/* <Typography variant="body2">Powered by</Typography> */}
            <img src={logo330} alt="ENFC Logo" className="enfc-logo" />
          </Box>
        </Box>
      </Container>
    </Container>
  );
};

export default AttenteInscription;
