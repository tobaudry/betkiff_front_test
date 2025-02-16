import React, { useState } from "react";
import axios from "axios";

import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth"; // Utilisation de Firebase Auth
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../../Services/Firebase";
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

const Inscription = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomUser, setNomUser] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nomUserError, setNomUserError] = useState(false);
  // eslint-disable-next-line
  const [idOrganisation, setIdOrganisation] = useState();
  const navigate = useNavigate();
  const authorizedDomain = "@ensc.fr";
  const parametreURL = useParams();
  const token = parametreURL.token;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError(false);
    setPasswordError(false);
    setNomUserError(false);

    if (!email) setEmailError(true);
    if (!password) setPasswordError(true);
    if (!nomUser) setNomUserError(true);

    if (!email.endsWith(authorizedDomain)) {
      setEmailError(true);
      setError(
        `L'inscription est réservée aux adresses e-mail se terminant par ${authorizedDomain}`,
      );
      return;
    }

    let idOrg; // Variable temporaire pour stocker l'id de l'organisation

    if (token) {
      try {
        const response = await fetch(
          `https://backend-betkiff.vercel.app/organisations/getOrganisationIdFromToken/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        idOrg = data.idOrganisation; // Stocker l'id de l'organisation
        setIdOrganisation(idOrg); // Mettre à jour l'état pour une utilisation future
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'organisation :",
          error,
        );
      }
    }

    console.log("ID de l'organisation :", idOrg);

    if (email && password && nomUser && idOrg) {
      try {
        const response_domain = await fetch(
          `https://backend-betkiff.vercel.app/organisations/getOrganisationDomain`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idOrganisation: idOrg }), // Utiliser la variable temporaire
          },
        );

        if (!response_domain.ok) {
          throw new Error(
            `Erreur ${response_domain.status}: ${response_domain.statusText}`,
          );
        }

        const data_domain = await response_domain.json();
        const domain = data_domain.domain; // La constante récupérée depuis le backend
        console.log("Nom du domaine :", domain);

        // Étape 3 : Vérifier si l'email correspond au domaine
        if (!email.endsWith(domain)) {
          setEmailError(true);
          setError(
            `L'inscription est réservée aux adresses e-mail se terminant par ${domain}`,
          );
          return;
        }

        const response_register = await axios.post(
          "https://backend-betkiff.vercel.app/auth/register",
          {
            email,
            password,
            nomUser,
            idOrganisation: idOrg, // Utiliser la variable temporaire
          },
        );

        if (response_register.data.success) {
          alert("Utilisateur créé avec succès !");

          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
          ); // Authentification utilisateur
          const user = userCredential.user;

          await sendEmailVerification(user); // Envoi de l'email de vérification
          alert("Un email de vérification a été envoyé.");

          navigate("/connexion");
        } else {
          setError(
            response_register.data.message || "Une erreur est survenue.",
          );
        }
      } catch (error) {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } else {
      setError("Veuillez remplir tous les champs.");
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
            Rejoins l'aventure !
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
            label="Nom d'utilisateur"
            value={nomUser}
            onChange={(e) => setNomUser(e.target.value)}
            margin="normal"
            required
            error={nomUserError}
            helperText={nomUserError ? "Nom d'utilisateur requis" : ""}
            className="connexion-textfield"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            error={emailError}
            helperText={
              emailError
                ? `Email requis (doit se terminer par ${authorizedDomain})`
                : ""
            }
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
            onClick={handleSignUp}
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
            S'inscrire
          </Button>

          {/* <Button
            variant="outlined"
            onClick={() => navigate("/connexion")}
            fullWidth
            sx={{
              borderColor: "rgba(90,20,121,254)",
              color: "rgba(90,20,121,254)",
              mb: 2,
              "&:hover": {
                borderColor: "darkviolet",
                backgroundColor: "rgba(90,20,121,0.1)",
              },
            }}>
            Se connecter
          </Button> */}
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

export default Inscription;
