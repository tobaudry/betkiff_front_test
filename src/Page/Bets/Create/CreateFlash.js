import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../../Styles/Create/Create.css";

const CreateFlash = () => {
  // États
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [flashOpen] = useState(true);
  const [reward, setReward] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const navigate = useNavigate();

  const idOrganisation = localStorage.getItem("idOrganisation");

  // Gestion des étapes
  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);

  // Validation des champs obligatoires
  const canProceedToNextStep = () => {
    if (step === 1) return title && reward;
    if (step === 2) return endDate && endTime;
    return false;
  };

  // Calcul de la progression
  const progressValue = (step / 3) * 100;

  // Soumission finale
  const handleSubmit = async (e) => {
    e.preventDefault();

    const flashData = {
      path: `organisations/${idOrganisation}/flash`,
      data: { title, flashOpen, reward, endDate, endTime },
    };

    try {
      const response = await fetch(
        "https://betkiff-back-test.vercel.app/bets/addBets",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(flashData),
        }
      );

      const result = await response.text();
      setAlertMessage(result);
      setAlertSeverity("success");
      navigate("/");
    } catch (error) {
      setAlertMessage("Erreur lors de la création du défi.");
      setAlertSeverity("error");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Container maxWidth="sm" className="create-container">
        {/* Barre de progression */}
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
          }}>
          {/* Rond de progression */}
          <Box
            sx={{
              position: "relative",
              width: "70px",
              height: "70px",
              marginRight: "10px",
            }}>
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
              }}>
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
              }}>
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
              }}>
              {step === 1 && "Informations Générales"}
              {step === 2 && "Date et Heure de Fin"}
              {step === 3 && "Vérification Finale"}
            </Typography>
          </Box>
        </Box>

        {/* Alerte */}
        {alertMessage && (
          <Alert severity={alertSeverity} className="create-alert">
            {alertMessage}
          </Alert>
        )}

        {/* Étape 1 */}
        {step === 1 && (
          <form className="create-form">
            <TextField
              label="Titre du Défi"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Récompense"
              fullWidth
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
          </form>
        )}

        {/* Étape 2 */}
        {step === 2 && (
          <form className="create-form">
            <TextField
              label="Jour de Fin"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Heure de Fin"
              type="time"
              fullWidth
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
          </form>
        )}

        {/* Étape 3 - Vérification Finale */}
        {step === 3 && (
          <Card
            sx={{
              maxWidth: 400,
              borderRadius: 5,
              overflow: "hidden",
              boxShadow: 3,
              backgroundColor: "#F8F0FC",
            }}>
            {/* Bande supérieure avec la date de fin */}
            <Box
              sx={{
                backgroundColor: "#6A1B9A",
                padding: "10px",
                textAlign: "center",
                color: "white",
              }}>
              <Typography variant="body2">
                {" "}
                {new Date(`${endDate}T${endTime}`).toLocaleString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>

            {/* Contenu principal */}
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#4A148C",
                  marginBottom: 1,
                }}>
                {title}
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: "#757575", marginBottom: 1 }}>
                <strong>Récompense :</strong> {reward}
              </Typography>
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
          }}>
          {step === 1 && (
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outlined"
              sx={{
                flexGrow: 1,
                color: "rgba(90, 20, 121, 254)",
                fontWeight: "bold",
                border: "1px solid rgba(90, 20, 121, 254)",
              }}>
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
              }}>
              Retour
            </Button>
          )}
          {step < 3 && (
            <Button
              onClick={handleNextStep}
              variant="contained"
              sx={{
                flexGrow: 1,
                backgroundColor: "rgba(90, 20, 121, 254)",
                fontWeight: "bold",
                color: "white",
              }}
              disabled={!canProceedToNextStep()}>
              Suivant
            </Button>
          )}
          {step === 3 && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                flexGrow: 1,
                backgroundColor: "rgba(90, 20, 121, 254)",
                fontWeight: "bold",
                color: "white",
              }}>
              Créer le Défi Flash
            </Button>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default CreateFlash;
