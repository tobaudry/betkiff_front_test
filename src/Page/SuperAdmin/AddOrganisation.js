import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import emailjs from "emailjs-com";

const AddOrganisation = () => {
  const [domain, setDomain] = useState("");
  const [organisationName, setOrganisationName] = useState(""); // Champ pour le nom de l'organisation
  const [admins, setAdmins] = useState([{ email: "", role: "" }]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [organisationToken, setOrganisationToken] = useState(""); // Etat pour stocker le token
  const [organisationId, setOrganisationId] = useState(""); // Etat pour stocker l'ID de l'organisation

  // Fonction pour ajouter un admin
  const handleAddAdmin = () => {
    setAdmins([...admins, { email: "", role: "" }]);
  };

  // Fonction pour supprimer un admin
  const handleRemoveAdmin = (index) => {
    const newAdmins = admins.filter((_, i) => i !== index);
    setAdmins(newAdmins);
  };

  // Fonction pour gérer le changement des champs admin
  const handleAdminChange = (index, field, value) => {
    const newAdmins = [...admins];
    newAdmins[index][field] = value;
    setAdmins(newAdmins);
  };

  // Fonction d'envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const organisationData = {
      organisationName, // Inclure le nom de l'organisation
      domain,
      admins,
    };

    try {
      const response = await fetch(
        "https://backend-betkiff.vercel.app/organisations/addOrganisation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(organisationData),
        },
      );

      const result = await response.json(); // Attendre un objet JSON

      setAlertMessage(result.message);
      setAlertSeverity("success");

      // Stocker le token et l'ID dans l'état
      setOrganisationToken(result.token);
      setOrganisationId(result.idOrganisation); // Stocker l'ID de l'organisation

      const donnee_mail = {
        lien: result.lien,
        domain,
        mail: admins[0].email,
        organisationName,
      };
      console.log(donnee_mail);
      emailjs
        .send(
          "service_etwf2gv",
          "template_1q4wwnk",
          donnee_mail,
          "9a20v3uM8wuq8taDO",
        )
        .then(
          (response) => {
            setSuccess(true);
            setError(false);
          },
          (error) => {
            console.error("Erreur lors de l'envoi de l'email : ", error);
            setError(true);
            setSuccess(false);
          },
        );

      // Rediriger ou afficher un message avec l'ID et le token
      // navigate("/");
    } catch (error) {
      setAlertMessage("Erreur lors de la création de l'organisation.");
      setAlertSeverity("error");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ padding: 3, marginTop: 5 }}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h5" component="h1" gutterBottom>
          Ajouter une Organisation
        </Typography>
      </Box>

      {alertMessage && (
        <Alert severity={alertSeverity} sx={{ marginBottom: 2 }}>
          {alertMessage}
        </Alert>
      )}

      {organisationToken && (
        <Alert severity="info" sx={{ marginBottom: 2 }}>
          Token de l'organisation : {organisationToken}
        </Alert>
      )}

      {organisationId && (
        <Alert severity="info" sx={{ marginBottom: 2 }}>
          ID de l'organisation : {organisationId}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom de l'Organisation"
          fullWidth
          value={organisationName}
          onChange={(e) => setOrganisationName(e.target.value)}
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Domaine"
          fullWidth
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />

        <Typography variant="h6" component="h2" sx={{ marginBottom: 2 }}>
          Administrateurs
        </Typography>

        {admins.map((admin, index) => (
          <Grid container spacing={2} key={index} sx={{ marginBottom: 2 }}>
            <Grid item xs={5}>
              <TextField
                label="Adresse Mail"
                fullWidth
                value={admin.email}
                onChange={(e) =>
                  handleAdminChange(index, "email", e.target.value)
                }
                variant="outlined"
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Rôle"
                fullWidth
                value={admin.role}
                onChange={(e) =>
                  handleAdminChange(index, "role", e.target.value)
                }
                variant="outlined"
              />
            </Grid>
            <Grid item xs={2}>
              {admins.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => handleRemoveAdmin(index)}
                  sx={{ marginTop: 1 }}
                >
                  <RemoveCircleIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}

        <Box textAlign="center" mb={3}>
          <Button
            startIcon={<AddCircleIcon />}
            variant="outlined"
            color="primary"
            onClick={handleAddAdmin}
          >
            Ajouter un Admin
          </Button>
        </Box>

        <Box textAlign="center">
          <Button variant="contained" color="primary" type="submit">
            Créer l'Organisation
          </Button>
        </Box>
        {success && (
          <Alert severity="success">Email envoyé avec succès !</Alert>
        )}
        {error && (
          <Alert severity="error">
            Erreur : Veuillez remplir tous les champs.
          </Alert>
        )}
      </form>
    </Container>
  );
};

export default AddOrganisation;
