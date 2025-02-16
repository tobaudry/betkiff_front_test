import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useUser } from "../../../Services/ContexteUser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ManageMiniBet = () => {
  const { idBet } = useParams(); // Récupération de l'ID depuis l'URL
  const [miniBets, setMiniBets] = useState(null);
  console.log("id bet", idBet);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [sportCategory, setSportCategory] = useState("");
  const [odds, setOdds] = useState([{ label: "", value: "" }]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [openDialog, setOpenDialog] = useState(false);
  const [winningOdd, setWinningOdd] = useState(null); // Cote gagnante sélectionnée
  const [bettingStatus, setBettingStatus] = useState("en cours");
  // eslint-disable-next-line
  const [winners, setWinners] = useState([]);
  const [distributeWinningDone, setDistributeWinningDone] = useState();
  const { updateMonnaie } = useUser();
  const [openAccordion, setOpenAccordion] = useState(null);

  const idOrganisation = localStorage.getItem("idOrganisation");

  // Fonction pour gérer l'ouverture et la fermeture des accordéons
  const handleAccordionToggle = (panel) => {
    setOpenAccordion((prev) => (prev === panel ? null : panel)); // Si c'est déjà ouvert, ferme-le. Sinon, ouvre-le et ferme les autres.
  };

  useEffect(() => {
    const fetchBet = async () => {
      const path = `organisations/${idOrganisation}/miniBets`;
      try {
        const response = await fetch(
          `https://betkiff-back-test.vercel.app/bets/getBetByID/${idBet}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ path }),
          }
        );
        if (!response.ok) {
          throw new Error(
            `Erreur : ${response.status} - ${response.statusText}`
          );
        }
        const data = await response.json();
        setMiniBets(data);
        setTitle(data.title);
        setDate(data.date);
        setSportCategory(data.sportCategory);
        setOdds(data.odds || [{ label: "", value: "" }]);
        setDistributeWinningDone(data.distributeWinningDone);
      } catch (error) {
        console.error("Erreur lors de la récupération du pari :", error);
      }
    };

    fetchBet();
  }, [idBet, idOrganisation]);

  const handleAddOdd = () => {
    setOdds([...odds, { label: "", value: "" }]);
  };

  const handleBettingStatusChange = (event) => {
    setBettingStatus(event.target.value); // Update the betting status
  };

  const handleRemoveOdd = (index) => {
    const newOdds = odds.filter((_, i) => i !== index);
    setOdds(newOdds);
  };

  const handleOddChange = (index, key, value) => {
    const updatedOdds = odds.map((odd, i) =>
      i === index ? { ...odd, [key]: value } : odd
    );
    setOdds(updatedOdds);
  };

  const handleUpdateMiniBet = async () => {
    const updatedMiniBet = {
      date,
      odds,
      sportCategory,
      title,
      bettingStatus,
      distributeWinningDone,
      idOrganisation,
    };

    try {
      const response = await fetch(
        `https://betkiff-back-test.vercel.app/bets/updateMiniBets/${idBet}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMiniBet),
        }
      );

      if (response.ok) {
        setAlertMessage("Le mini pari a été mis à jour avec succès !");
        setAlertSeverity("success");
      } else {
        throw new Error("Erreur lors de la mise à jour du mini pari");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mini pari :", error);
      setAlertMessage("Une erreur est survenue lors de la mise à jour.");
      setAlertSeverity("error");
    }
  };

  // Fonction pour ouvrir le pop-up
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Fonction pour fermer le pop-up
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Fonction pour mettre à jour le nombre de kiffs de l'utilisateur
  const updateUserBalance = async (idUser, winning) => {
    try {
      const uid = idUser;
      // Récupérer les données utilisateur
      const response = await fetch(
        `https://betkiff-back-test.vercel.app/users/ById/${uid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idOrganisation }),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération de l'utilisateur : ${response.status}`
        );
      }
      const userData = await response.json();
      const newMoney = userData.nbMonnaie + winning;

      // Mettre à jour le solde utilisateur
      const updateResponse = await fetch(
        "https://betkiff-back-test.vercel.app/users/updateMonnaie",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: idUser,
            newMoney,
            idOrganisation,
          }),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error("Erreur API mise à jour monnaie :", errorData);
        throw new Error(
          errorData.error || "Erreur lors de la mise à jour de l'argent."
        );
      }
      updateMonnaie(newMoney);
      const updateResult = await updateResponse.json();
      console.log(
        `Monnaie mise à jour avec succès pour l'utilisateur ${userData.NomUser} :`,
        updateResult
      );
    } catch (error) {
      console.error("Erreur dans updateUserBalance :", error.message);
    }
  };
  // Fonction pour calculer et distribuer les gains
  const calculateWinnings = async (bet, bettors) => {
    if (!idBet || !winningOdd) {
      setAlertMessage("Veuillez fournir l'ID du pari et la cote gagnante.");
      setAlertSeverity("warning");
      return;
    }

    setAlertMessage("");
    setWinners([]);

    try {
      const response = await axios.post(
        "https://betkiff-back-test.vercel.app/bets/calculateWinningMiniBet",
        {
          bet: miniBets, // Les détails du pari (odds, etc.)
          bettors: miniBets.bettors, // Les parieurs et leurs informations
          idBet: idBet, // L'identifiant du pari
          winningOdd: winningOdd, // La cote gagnante
        }
      );

      const { message, winningBettors } = response.data;
      console.log("test", winningBettors);
      setAlertMessage(message);
      setAlertSeverity("success");
      setWinners(winningBettors);
      return winningBettors;
    } catch (error) {
      console.error("Erreur lors du calcul des gains :", error);
      setAlertMessage("Erreur lors du calcul des gains.");
      setAlertSeverity("error");
    }
  };

  // Fonction pour distribuer les gains au clic sur le bouton
  const distributeWinnings = async (bet) => {
    const { bettors } = bet;
    try {
      const winners = await calculateWinnings(bet, bettors);

      // Parcourir les gagnants pour effectuer d'autres actions
      winners.forEach(({ idUser, winnings }) => {
        updateUserBalance(idUser, winnings);
      });
      setDistributeWinningDone(true);
      const response = await axios.put(
        `https://betkiff-back-test.vercel.app/bets/updateMiniBets/${idBet}`,
        {
          date: date,
          odds: odds,
          sportCategory: sportCategory,
          title: title,
          bettingStatus: bettingStatus,
          distributeWinningDone: true,
          idOrganisation,
        }
      );
      console.log(
        "Mise à jour du champ distributeWinningDone réussie :",
        response.data
      );
      handleCloseDialog();
    } catch (error) {
      console.error("Erreur lors de la distribution des gains :", error);
    }
  };

  return (
    <div>
      <Container
        maxWidth="sm"
        sx={{
          padding: "16px",
          marginBottom: "16px",
          borderRadius: 2,
        }}>
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              paddingTop: "60px",
              paddingBottom: "20px",
              fontWeight: "bold",
              color: "rgba(90, 20, 121, 254)",
              paddingLeft: "2vw",
            }}>
            Modifier un Mini Pari
          </Typography>
        </Box>

        {alertMessage && (
          <Alert severity={alertSeverity} sx={{ marginBottom: 2 }}>
            {alertMessage}
          </Alert>
        )}
        <Accordion
          expanded={openAccordion === "equipe"}
          onChange={() => handleAccordionToggle("equipe")}
          sx={{ margin: "2vh 0" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Équipes
          </AccordionSummary>
          <AccordionDetails>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="bettingStatusLabel">Statut du Pari</InputLabel>
                <Select
                  labelId="bettingStatusLabel"
                  value={bettingStatus}
                  onChange={handleBettingStatusChange}
                  label="Statut du Pari">
                  <MenuItem value="en cours">En cours</MenuItem>
                  <MenuItem value="terminé">Terminé</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={openAccordion === "info"}
          onChange={() => handleAccordionToggle("info")}
          sx={{ margin: "2vh 0" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Informations
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Titre"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Date"
                  fullWidth
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Catégorie de Sport"
                  fullWidth
                  value={sportCategory}
                  onChange={(e) => setSportCategory(e.target.value)}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={openAccordion === "cote"}
          onChange={() => handleAccordionToggle("cote")}
          sx={{ margin: "2vh 0" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Côtes
          </AccordionSummary>
          <AccordionDetails>
            {odds.map((odd, index) => (
              <Grid container spacing={1} key={index} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    label="Titre côte"
                    fullWidth
                    value={odd.label}
                    onChange={(e) =>
                      handleOddChange(index, "label", e.target.value)
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Valeur"
                    type="number"
                    fullWidth
                    value={odd.value}
                    onChange={(e) =>
                      handleOddChange(index, "value", e.target.value)
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => handleRemoveOdd(index)}
                    color="error">
                    <Remove />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12} textAlign="center" sx={{ paddingTop: "10px" }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddOdd}>
                Ajouter une Cote
              </Button>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Box
          sx={{
            display: "flex",
            padding: "2vh",
            width: "100%",
            boxSizing: "border-box",

            gap: 2, // Espacement entre les boutons
          }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{
              flexGrow: 1,
              color: "rgba(90, 20, 121, 254)",
              fontWeight: "bold",
              border: "1px solid rgba(90, 20, 121, 254)",
            }}
            onClick={handleUpdateMiniBet}>
            Mettre à jour le Mini Pari
          </Button>
          {!distributeWinningDone && (
            <Button
              variant="contained"
              color="secondary"
              sx={{
                flexGrow: 1,
                backgroundColor: "rgba(90, 20, 121, 254)",
                fontWeight: "bold",
                color: "white",
              }}
              onClick={handleOpenDialog}>
              Terminé
            </Button>
          )}
        </Box>
        {/* Pop-up de sélection de la cote gagnante */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Sélectionner la Cote Gagnante</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="winningOddLabel">Cote Gagnante</InputLabel>
              <Select
                labelId="winningOddLabel"
                value={winningOdd}
                onChange={(e) => setWinningOdd(e.target.value)}
                label="Cote Gagnante">
                {odds.map((odd, index) => (
                  <MenuItem key={index} value={odd.label}>
                    {odd.label} - {odd.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Annuler
            </Button>
            <Button
              onClick={distributeWinnings}
              color="primary"
              disabled={!winningOdd}>
              Distribuer les Gains
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default ManageMiniBet;
