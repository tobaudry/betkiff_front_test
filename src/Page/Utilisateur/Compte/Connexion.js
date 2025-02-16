import React, { useState } from "react";
import { auth } from "../../../Services/Firebase";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import logo from "../../../Images/logo.png";
import logo330 from "../../../Images/330logo.png";
import "../../../Styles/Compte/Connexion.css";
import { useUser } from "../../../Services/ContexteUser";

const Connexion = () => {
  const { login } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const signIn = async () => {
    setError("");
    setEmailError(false);
    setPasswordError(false);

    if (!email) setEmailError(true);
    if (!password) setPasswordError(true);

    if (email && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = userCredential.user;

        const idToken = await user.getIdToken();
        login(idToken, user.uid);

        try {
          const response = await fetch(
            `https://backend-betkiff.vercel.app/users/getIdOrgaByIdUser/${user.uid}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erreur inconnue.");
          }

          const data = await response.json();
          localStorage.setItem("idOrganisation", data.idOrganisation);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de l'idOrganisation :",
            error,
          );
          setError(error.message);
        }
        navigate("/");
      } catch (error) {
        setError("Erreur lors de la connexion : " + error.message);
      }
    } else {
      setError("Veuillez remplir tous les champs.");
    }
  };

  const handleClickInsc = () => navigate("/attenteInscription");

  const handleForgotPassword = () => {
    const authInstance = getAuth();
    const emailPrompt = prompt("Veuillez entrer votre adresse email :");
    if (emailPrompt) {
      sendPasswordResetEmail(authInstance, emailPrompt)
        .then(() =>
          alert("Un email de réinitialisation de mot de passe a été envoyé !"),
        )
        .catch((error) => alert("Erreur : " + error.message));
    }
  };

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
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            Prêt à kiffer ?
          </Typography>
        </Box>
        {error && (
          <Alert
            severity="error"
            variant="outlined"
            className="connexion-alert"
          >
            {error}
          </Alert>
        )}
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            error={emailError}
            helperText={emailError ? "Email requis" : ""}
            className="connexion-textfield"
          />
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            error={passwordError}
            helperText={passwordError ? "Mot de passe requis" : ""}
            className="connexion-textfield"
          />
        </Box>
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <Button
            variant="contained"
            onClick={signIn}
            fullWidth
            sx={{
              backgroundColor: "rgba(90,20,121,254)",
              color: "white",
              mb: 2,
              "&:hover": {
                backgroundColor: "darkviolet",
              },
            }}
          >
            Se connecter
          </Button>

          <Button
            variant="outlined"
            onClick={handleClickInsc}
            fullWidth
            sx={{
              borderColor: "rgba(90,20,121,254)",
              color: "rgba(90,20,121,254)",
              mb: 2,
              "&:hover": {
                borderColor: "darkviolet",
                backgroundColor: "rgba(90,20,121,0.1)",
              },
            }}
          >
            S'inscrire
          </Button>
          <p>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="forgot-password-button"
            >
              Mot de passe oublié ?
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

export default Connexion;
