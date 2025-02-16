import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import "../../../Styles/Create/Create.css";

const CreateMiniBets = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [sportCategory, setSportCategory] = useState("");
  const [odds, setOdds] = useState([{ label: "", value: "" }]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  // eslint-disable-next-line
  const [bettingStatus, setBettingStatus] = useState("à venir");

  const navigate = useNavigate();

  const idOrganisation = localStorage.getItem("idOrganisation");

  // Gestion des étapes
  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);

  // Validation des champs obligatoires pour chaque étape
  const canProceedToNextStep = () => {
    if (step === 1) return title && sportCategory;
    if (step === 2) return odds.length > 0 && date;
    return false;
  };

  // Ajout et suppression de cotes
  const handleAddOdd = () => {
    setOdds([...odds, { label: "", value: "" }]);
  };

  const handleRemoveOdd = (index) => {
    setOdds(odds.filter((_, i) => i !== index));
  };

  const handleOddChange = (index, key, value) => {
    setOdds(
      odds.map((odd, i) => (i === index ? { ...odd, [key]: value } : odd)),
    );
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    const betsData = {
      path: `organisations/${idOrganisation}/miniBets`,
      data: {
        bettingOpen: true,
        bettingStatus,
        date,
        odds,
        sportCategory,
        title,
        distributeWinningDone: false,
      },
    };

    try {
      const response = await fetch(
        "https://backend-betkiff.vercel.app/bets/addBets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(betsData),
        },
      );
      const result = await response.text();
      setAlertMessage(result);
      setAlertSeverity("success");
      navigate("/");
    } catch (error) {
      setAlertMessage("Erreur lors de la création du mini pari.");
      setAlertSeverity("error");
    }
  };

  const progressValue = (step / 3) * 100;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm" className="create-container">
        {/* Cercle de progression */}
        <Box
          sx={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%", // Prendre toute la largeur de la page
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
            padding: "2vh",
            boxSizing: "border-box", // Inclure la padding dans la largeur totale
          }}
        >
          {/* Rond de progression */}
          <Box
            sx={{
              position: "relative",
              width: "70px",
              height: "70px",
              marginRight: "10px",
            }}
          >
            {/* Cercle complet en arrière-plan */}
            <CircularProgress
              variant="determinate"
              value={100}
              size={70}
              thickness={5}
              sx={{
                color: "rgba(90, 20, 121, 0.3)",
                position: "absolute",
              }}
            />

            {/* Cercle de progression au premier plan */}
            <CircularProgress
              variant="determinate"
              value={progressValue}
              size={70}
              thickness={5}
              sx={{ color: "#5A147E" }}
            />

            {/* Texte au centre */}
            <Typography
              sx={{
                position: "absolute",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#5A147E",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {step}/3
            </Typography>
          </Box>

          {/* Titre */}
          <Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "rgba(90, 20, 121, 254)",
                paddingLeft: "2vw",
              }}
            >
              {step === 1 && "Étape 1"}
              {step === 2 && "Étape 2"}
              {step === 3 && "Étape 3"}
            </Typography>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "rgba(90, 20, 121, 254)",
                paddingLeft: "2vw",
                fontSize: "1rem",
              }}
            >
              {step === 1 && "Informations Générales"}
              {step === 2 && "Ajouter des Cotes"}
              {step === 3 && "Vérification et Création"}
            </Typography>
          </Box>
        </Box>

        {alertMessage && (
          <Alert severity={alertSeverity} className="create-alert">
            {alertMessage}
          </Alert>
        )}

        {/* Étape 1 */}
        {step === 1 && (
          <form className="create-form">
            <TextField
              label="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Catégorie du Sport</InputLabel>
              <Select
                value={sportCategory}
                onChange={(e) => setSportCategory(e.target.value)}
                label="Catégorie du Sport"
              >
                <MenuItem value="football">Football</MenuItem>
                <MenuItem value="basketball">Basketball</MenuItem>
                <MenuItem value="rugby">Rugby</MenuItem>
                <MenuItem value="coinche">Coinche</MenuItem>
                <MenuItem value="spikeball">Spikeball</MenuItem>
                <MenuItem value="handball">Handball</MenuItem>
                <MenuItem value="volley">Volley</MenuItem>
              </Select>
            </FormControl>
          </form>
        )}

        {/* Étape 2 */}
        {step === 2 && (
          <form className="create-form">
            <Grid item xs={12}>
              <TextField
                label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            {odds.map((odd, index) => (
              <Grid container spacing={1} key={index} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    label="Titre Côte"
                    value={odd.label}
                    onChange={(e) =>
                      handleOddChange(index, "label", e.target.value)
                    }
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Valeur"
                    type="number"
                    value={odd.value}
                    onChange={(e) =>
                      handleOddChange(index, "value", e.target.value)
                    }
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => handleRemoveOdd(index)}
                    color="error"
                  >
                    <Remove />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddOdd}
              sx={{ marginTop: 2 }}
            >
              Ajouter une Côte
            </Button>
          </form>
        )}

        {/* Étape 3 */}
        {step === 3 && (
          <Card
            sx={{
              maxWidth: 400,
              borderRadius: 5,
              overflow: "hidden",
              boxShadow: 3,
              backgroundColor: "#F8F0FC",
            }}
          >
            {/* Bande supérieure avec le titre et la date */}
            <Box
              sx={{
                backgroundColor: "#6A1B9A",
                padding: "10px",
                textAlign: "center",
                color: "white",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {title}
              </Typography>
              <Typography variant="body2">
                {new Date(date).toLocaleDateString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>

            {/* Contenu principal */}
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: "#4A148C", marginBottom: 1 }}
              >
                {sportCategory}
              </Typography>
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {odds.map((odd, index) => (
                  <Grid item xs={4} key={index}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#E1BEE7",
                        color: "#4A148C",
                        fontWeight: "bold",
                      }}
                    >
                      {odd.label}
                      <br />
                      {odd.value}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Boutons de navigation */}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            display: "flex",
            padding: "2vh",
            width: "100%",
            boxSizing: "border-box",
            backgroundColor: "white",
            gap: 2, // Espacement entre les boutons
          }}
        >
          {step === 1 && (
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outlined"
              sx={{
                flexGrow: 1,
                color: "rgba(90, 20, 121, 254)",
                fontWeight: "bold",
                border: "1px solid rgba(90, 20, 121, 254)",
              }}
            >
              Dashboard
            </Button>
          )}
          {step > 1 && (
            <Button
              onClick={handlePrevStep}
              variant="outlined"
              sx={{
                flexGrow: 1,
                color: "rgba(90, 20, 121, 254)",
                fontWeight: "bold",
                border: "1px solid rgba(90, 20, 121, 254)",
              }}
            >
              Retour
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={handleNextStep}
              variant="contained"
              sx={{
                flexGrow: 1,
                backgroundColor: "rgba(90, 20, 121, 254)",
                fontWeight: "bold",
                color: "white",
              }}
              disabled={!canProceedToNextStep()}
            >
              Suivant
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                flexGrow: 1,
                backgroundColor: "rgba(90, 20, 121, 254)",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Créer le Mini Pari
            </Button>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default CreateMiniBets;
