import React, { useEffect, useState } from "react";
import { getStatusOptions } from "./Components/getStatusOptions";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../../Styles/Create/Create.css";

const CreateBets = () => {
  // États
  const [step, setStep] = useState(1);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [odds, setOdds] = useState({ winTeam1: "", draw: "", winTeam2: "" });
  const [matchStatus, setMatchStatus] = useState("à venir");
  const [score] = useState({ team1: 0, team2: 0 });
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [sportCategory, setSportCategory] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);
  // eslint-disable-next-line
  const [bettingOpen, setBettingOpen] = useState(false);

  const idOrganisation = localStorage.getItem("idOrganisation");

  const navigate = useNavigate();

  // Gestion des étapes
  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);

  // Validation des champs obligatoires
  const canProceedToNextStep = () => {
    if (step === 1) return sportCategory && team1 && team2;
    if (step === 2)
      return odds.winTeam1 && odds.draw && odds.winTeam2 && matchStatus;
    if (step === 3) return date && time;
    if (step === 4)
      return (
        sportCategory &&
        team1 &&
        team2 &&
        odds.winTeam1 &&
        odds.draw &&
        odds.winTeam2 &&
        matchStatus &&
        date &&
        time
      );
    return false;
  };

  // Soumission finale
  const handleSubmit = async (e) => {
    e.preventDefault();

    const betsData = {
      path: `organisations/${idOrganisation}/bets`,
      data: {
        team1,
        team2,
        odds,
        matchStatus,
        score,
        date,
        time,
        sportCategory,
        bettingOpen,
        distributeWinningDone: false,
      },
    };

    try {
      const response = await fetch(
        "https://backend-betkiff.vercel.app/bets/addBets",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(betsData),
        }
      );

      const result = await response.text();
      setAlertMessage(result);
      setAlertSeverity("success");
      navigate("/");
    } catch (error) {
      setAlertMessage("Erreur lors de la création du pari.");
      setAlertSeverity("error");
    }
  };

  useEffect(() => {
    setStatusOptions(getStatusOptions(sportCategory));
  }, [sportCategory]);

  // Calcul de la progression
  const progressValue = (step / 4) * 100;

  // Formulaire centré
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Container maxWidth="sm" className="create-container">
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
              {step}/4
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
              {step === 4 && "Étape 4"}
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
              {step === 1 && "Informations sur les Équipes"}
              {step === 2 && "Côtes et Statut"}
              {step === 3 && "Date et Heure"}
              {step === 4 && "Vérification et Création"}
            </Typography>
          </Box>
        </Box>

        {alertMessage && (
          <Alert severity={alertSeverity} className="create-alert">
            {alertMessage}
          </Alert>
        )}

        {/* Formulaire étape 1 */}
        {step === 1 && (
          <form className="create-form">
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Catégorie du Sport</InputLabel>
                <Select
                  value={sportCategory}
                  onChange={(e) => setSportCategory(e.target.value)}
                  label="Catégorie du Sport">
                  <MenuItem value="football">Football</MenuItem>
                  <MenuItem value="basketball">Basketball</MenuItem>
                  <MenuItem value="rugby">Rugby</MenuItem>
                  <MenuItem value="coinche">Coinche</MenuItem>
                  <MenuItem value="spikeball">Spikeball</MenuItem>
                  <MenuItem value="handball">Handball</MenuItem>
                  <MenuItem value="volley">Volley</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <TextField
              label="Équipe 1"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Équipe 2"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 2 }}
            />
          </form>
        )}

        {/* Formulaire étape 2 */}
        {step === 2 && (
          <form className="create-form">
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <TextField
                  label={`Cote ${team1}`}
                  value={odds.winTeam1}
                  onChange={(e) =>
                    setOdds({ ...odds, winTeam1: e.target.value })
                  }
                  variant="outlined"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Cote Nul"
                  value={odds.draw}
                  onChange={(e) => setOdds({ ...odds, draw: e.target.value })}
                  variant="outlined"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label={`Cote ${team2}`}
                  value={odds.winTeam2}
                  onChange={(e) =>
                    setOdds({ ...odds, winTeam2: e.target.value })
                  }
                  variant="outlined"
                  type="number"
                  fullWidth
                />
              </Grid>
            </Grid>

            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>Statut du Match</InputLabel>
              <Select
                value={matchStatus}
                onChange={(e) => setMatchStatus(e.target.value)}
                label="Statut du Match">
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        )}

        {/* Étape 3 */}
        {step === 3 && (
          <form className="create-form">
            <TextField
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              variant="outlined"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Heure"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              variant="outlined"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: 2 }}
            />
          </form>
        )}

        {step === 4 && (
          <Card
            sx={{
              maxWidth: 400,
              borderRadius: 5,
              overflow: "hidden",
              boxShadow: 3,
              backgroundColor: "#F8F0FC",
            }}>
            {/* Bande supérieure avec la date */}
            <Box
              sx={{
                backgroundColor: "#6A1B9A",
                padding: "10px",
                textAlign: "center",
                color: "white",
              }}>
              <Typography variant="body2">
                {new Date(`${date}T${time}`).toLocaleString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
            {/* Image du match */}
            {/* Contenu principal */}
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#4A148C",
                  marginBottom: 1,
                }}>
                {team1} - {team2}
              </Typography>
              <Typography variant="body2" sx={{ color: "#757575" }}>
                {matchStatus} | Score : 0 - 0
              </Typography>

              {/* Boutons de cotes */}
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#E1BEE7",
                      color: "#4A148C",
                      fontWeight: "bold",
                    }}>
                    {team1}
                    <br />
                    {odds.winTeam1}
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#E1BEE7",
                      color: "#4A148C",
                      fontWeight: "bold",
                    }}>
                    ÉGALITÉ
                    <br />
                    {odds.draw}
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#E1BEE7",
                      color: "#4A148C",
                      fontWeight: "bold",
                    }}>
                    {team2}
                    <br />
                    {odds.winTeam2}
                  </Button>
                </Grid>
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
          {step < 4 && (
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
          {step === 4 && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                flexGrow: 1,
                backgroundColor: "rgba(90, 20, 121, 254)",
                fontWeight: "bold",
                color: "white",
              }}
              disabled={!canProceedToNextStep()}>
              Créer le Pari
            </Button>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default CreateBets;
