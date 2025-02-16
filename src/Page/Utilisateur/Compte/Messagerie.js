import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import emailjs from "emailjs-com";
import { useGetUserConnecteData } from "../Component/RecupererDonneeUser";

const Messagerie = () => {
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState("");
  const [odds, setOdds] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const uid = localStorage.getItem("userUid");

  const userData = useGetUserConnecteData(uid);

  const userName = userData?.userData?.nomUser || "Utilisateur inconnu"; // Valeur par défaut si NomUser est null

  if (!userData) {
    return (
      <Box sx={{ textAlign: "center", padding: 5 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Chargement des données utilisateur...
        </Typography>
      </Box>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description || !options || !odds) {
      setError(true);
      return;
    }

    
    const templateParams = {
      description,
      options,
      odds,
      userName,
    };

    emailjs
      .send(
        "service_etwf2gv", // Remplacez par votre ID de service EmailJS
        "template_0wygf89", // Remplacez par votre ID de template EmailJS
        templateParams,
        "9a20v3uM8wuq8taDO", // Remplacez par votre clé publique EmailJS
      )
      .then(
        (response) => {
          setSuccess(true);
          setError(false);
          setDescription("");
          setOptions("");
          setOdds("");
        },
        (error) => {
          console.error("Erreur lors de l'envoi de l'email : ", error);
          setError(true);
          setSuccess(false);
        },
      );
  };

  return (
    <Box
      sx={{
        padding: 3,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: "20px",
      }}
    >
      <Box sx={{ padding: 5, maxWidth: 500, margin: "auto" }}>
        <Typography
          variant="h5"
          sx={{
            marginBottom: 2,
            fontWeight: "bold",
            color: "rgba(90,20,121,254)",
          }}
        >
          Proposer un pari
        </Typography>
        {success && (
          <Alert severity="success">Email envoyé avec succès !</Alert>
        )}
        {error && (
          <Alert severity="error">
            Erreur : Veuillez remplir tous les champs.
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Description du pari"
                variant="outlined"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Possibilités de pari / Options"
                variant="outlined"
                fullWidth
                value={options}
                onChange={(e) => setOptions(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Cotes des options"
                variant="outlined"
                fullWidth
                value={odds}
                onChange={(e) => setOdds(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button type="submit" variant="contained" color="primary">
                Valider
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default Messagerie;
