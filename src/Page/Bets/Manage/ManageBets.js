import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Typography,
  Box,
  Grid,
  ListSubheader,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useUser } from "../../../Services/ContexteUser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../../../Styles/Create/Create.css";

const ManageBets = () => {
  const [bets, setBets] = useState(null);
  const [updatedBets, setUpdatedBets] = useState({});
  const { idBet } = useParams();
  const { updateMonnaie } = useUser();
  const [openAccordion, setOpenAccordion] = useState(null);

  const idOrganisation = localStorage.getItem("idOrganisation");

  useEffect(() => {
    const fetchBet = async () => {
      const path = `organisations/${idOrganisation}/bets`;
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
        const data = await response.json(); // Utilisez .json() avec fetch
        setBets([{ idBet, ...data }]); // Charger uniquement le pari correspondant
        setUpdatedBets({ [idBet]: { idBet, ...data } });
      } catch (error) {
        console.error("Erreur lors de la récupération du pari :", error);
      }
    };

    fetchBet();
  }, [idBet, idOrganisation]);

  // Gérer les changements locaux
  const handleChange = (idBet, field, value) => {
    setUpdatedBets((prevUpdatedBets) => {
      const updatedBet = { ...prevUpdatedBets[idBet], [field]: value };
      return { ...prevUpdatedBets, [idBet]: updatedBet };
    });
  };

  const toggleBettingStatus = async (idBet) => {
    try {
      console.log("test des id ", idBet, idOrganisation);
      // eslint-disable-next-line
      const response = await fetch(
        `https://betkiff-back-test.vercel.app/bets/toggleBettingStatus/${idBet}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idOrganisation }),
        }
      );
      console.log("Status mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des kiffs :", error);
    }
  };

  // Envoyer les modifications au back-end
  const handleSubmitChanges = async () => {
    try {
      await axios.put(
        `https://betkiff-back-test.vercel.app/bets/updateBets/${idBet}`,
        {
          updatedData: updatedBets[idBet],
          idOrganisation,
        }
      );
      alert("Pari mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du pari :", error);
    }
  };

  const calculateWinning = async (bet, bettors) => {
    try {
      const response = await fetch(
        "https://betkiff-back-test.vercel.app/bets/calculateWinningBet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bet,
            bettors: bet.bettors,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur : ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data.winningBettors;
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API calculateWinning :", error);
    }
  };

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

  const distributeWinnings = async (bet) => {
    const { bettors } = bet;

    try {
      // Appeler la fonction calculateWinning et attendre les résultats
      const winners = await calculateWinning(bet, bettors);

      // Parcourir les gagnants pour effectuer d'autres actions
      winners.forEach(({ idUser, winnings }) => {
        updateUserBalance(idUser, winnings);
      });
      handleChange(bet.idBet, "distributeWinningDone", true);
      const response = await axios.put(
        `https://betkiff-back-test.vercel.app/bets/updateBets/${idBet}`,
        {
          updatedData: updatedBets[idBet],
          idOrganisation,
        }
      );
      console.log(
        "Mise à jour du champ distributeWinningDone réussie :",
        response.data
      );
    } catch (error) {
      console.error("Erreur lors de la distribution des gains :", error);
    }
  };

  // Fonction pour gérer l'ouverture et la fermeture des accordéons
  const handleAccordionToggle = (panel) => {
    setOpenAccordion((prev) => (prev === panel ? null : panel)); // Si c'est déjà ouvert, ferme-le. Sinon, ouvre-le et ferme les autres.
  };

  if (!bets) {
    return <Typography>Chargement...</Typography>;
  }

  return (
    <div>
      <Container>
        {bets.map((bet) => (
          <Box
            key={bet.idBet}
            sx={{
              padding: "16px",
              marginBottom: "16px",
              borderRadius: 2,
            }}>
            <Box textAlign="center">
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
                {bet.team1} vs {bet.team2}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color={bet.bettingOpen ? "warning" : "primary"}
              fullWidth
              sx={{
                marginBottom: 2,
                flexGrow: 1,
                backgroundColor: "rgba(90, 20, 121, 254)",
                fontWeight: "bold",
                color: "white",
              }} // Ajouter un espacement inférieur
              onClick={() => toggleBettingStatus(bet.idBet)}>
              {bet.bettingOpen ? "Fermer le pari" : "Ouvrir le pari"}
            </Button>
            <Accordion
              expanded={openAccordion === "equipe"}
              onChange={() => handleAccordionToggle("equipe")}
              sx={{ margin: "2vh 0" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Équipes
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label={`Equipe 1`}
                      fullWidth
                      // placeholder={bet.team1}
                      value={updatedBets[bet.idBet]?.team1 || bet.team1}
                      onChange={(e) =>
                        handleChange(bet.idBet, "team1", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label={`Equipe 2`}
                      fullWidth
                      value={updatedBets[bet.idBet]?.team2 || bet.team2}
                      onChange={(e) =>
                        handleChange(bet.idBet, "team2", e.target.value)
                      }
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
                Côtes du match
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label={`Cote Victoire ${bet.team1}`}
                      type="number"
                      fullWidth
                      value={
                        updatedBets[bet.idBet]?.odds?.winTeam1 ||
                        bet.odds.winTeam1
                      }
                      onChange={(e) =>
                        handleChange(bet.idBet, "odds", {
                          ...updatedBets[bet.idBet]?.odds,
                          winTeam1: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Cote Match Nul"
                      type="number"
                      fullWidth
                      value={
                        updatedBets[bet.idBet]?.odds?.draw || bet.odds.draw
                      }
                      onChange={(e) =>
                        handleChange(bet.idBet, "odds", {
                          ...updatedBets[bet.idBet]?.odds,
                          draw: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label={`Cote Victoire ${bet.team2}`}
                      type="number"
                      fullWidth
                      value={
                        updatedBets[bet.idBet]?.odds?.winTeam2 ||
                        bet.odds.winTeam2
                      }
                      onChange={(e) =>
                        handleChange(bet.idBet, "odds", {
                          ...updatedBets[bet.idBet]?.odds,
                          winTeam2: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={openAccordion === "statut"}
              onChange={() => handleAccordionToggle("statut")}
              sx={{ margin: "2vh 0" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Statut
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Select
                        value={
                          updatedBets[bet.idBet]?.matchStatus || bet.matchStatus
                        }
                        onChange={(e) =>
                          handleChange(bet.idBet, "matchStatus", e.target.value)
                        }>
                        <ListSubheader>Début</ListSubheader>
                        <MenuItem value="à venir">Pas encore commencé</MenuItem>
                        {/* Première Partie */}
                        <ListSubheader>Foot / hand / rugy</ListSubheader>
                        <MenuItem value="1ere-mitemps">1ère mi-temps</MenuItem>
                        <MenuItem value="2eme-mitemps">2ème mi-temps</MenuItem>

                        <Divider />

                        {/* Quarts de Temps */}
                        <ListSubheader>Basket</ListSubheader>
                        <MenuItem value="1er-quart-temps">
                          1er quart-temps
                        </MenuItem>
                        <MenuItem value="2eme-quart-temps">
                          2ème quart-temps
                        </MenuItem>
                        <MenuItem value="3eme-quart-temps">
                          3ème quart-temps
                        </MenuItem>
                        <MenuItem value="4eme-quart-temps">
                          4ème quart-temps
                        </MenuItem>

                        <Divider />

                        {/* Sets */}
                        <ListSubheader>Volley</ListSubheader>
                        <MenuItem value="1er-set">1er set</MenuItem>
                        <MenuItem value="2eme-set">2ème set</MenuItem>

                        <Divider />

                        {/* Fin du Match */}
                        <ListSubheader>Fin du match</ListSubheader>
                        <MenuItem value="terminé">Terminé</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={openAccordion === "score"}
              onChange={() => handleAccordionToggle("score")}
              sx={{ margin: "2vh 0" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Score
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label={`Score ${bet.team1}`}
                      type="number"
                      fullWidth
                      value={
                        updatedBets[bet.idBet]?.score?.team1 || bet.score.team1
                      }
                      onChange={(e) =>
                        handleChange(bet.idBet, "score", {
                          ...updatedBets[bet.idBet]?.score,
                          team1: e.target.value,
                        })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label={`Score ${bet.team2}`}
                      type="number"
                      fullWidth
                      value={
                        updatedBets[bet.idBet]?.score?.team2 || bet.score.team2
                      }
                      onChange={(e) =>
                        handleChange(bet.idBet, "score", {
                          ...updatedBets[bet.idBet]?.score,
                          team2: e.target.value,
                        })
                      }
                    />
                  </Grid>
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
              {bet.matchStatus === "terminé" && !bet.distributeWinningDone && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="success"
                    fullWidth
                    sx={{
                      flexGrow: 1,
                      color: "rgba(90, 20, 121, 254)",
                      fontWeight: "bold",
                      border: "1px solid rgba(90, 20, 121, 254)",
                    }}
                    onClick={() => distributeWinnings(bet)}>
                    Distribuer les gains
                  </Button>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    marginBottom: 10,
                    flexGrow: 1,
                    backgroundColor: "rgba(90, 20, 121, 254)",
                    fontWeight: "bold",
                    color: "white",
                  }}
                  onClick={() => handleSubmitChanges(bet.idBet)}>
                  Valider les Modifications
                </Button>
              </Grid>
            </Box>
          </Box>
        ))}
      </Container>
    </div>
  );
};

export default ManageBets;
