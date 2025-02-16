// src/Pages/Home.js
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Backdrop,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import Filtre from "../../../Components/Filtre";

import DialogTitle from "@mui/material/DialogTitle";

import {
  useGetBets,
  useGetFlash,
  useGetMiniBets,
} from "./Components/RecupererDonnees";
import useSportIcon from "./Components/SportIcons";
import useFormattedDate from "./Components/FormatageDate";
import { useGetUserConnecteData } from "../../Utilisateur/Component/RecupererDonneeUser";
import BetCard from "../../../Components/betCard";
import MiniBetCard from "../../../Components/miniBetCard";
import FlashAnimation from "../../Flash/Component/FlashAnimation";

const Home = () => {
  const [betAmount, setBetAmount] = useState(0);
  const [selectedBet, setSelectedBet] = useState(null);
  const [openMiniModal, setOpenMiniModal] = useState(false);
  const [selectedMiniBet, setSelectedMiniBet] = useState(null);
  const [currentMiniBetId, setCurrentMiniBetId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentBetId, setCurrentBetId] = useState(null);
  const [filter, setFilter] = useState("Tous"); // Filtre par défaut
  const [filteredBets, setFilteredBets] = useState([]);
  // eslint-disable-next-line
  const [filteredMiniBets, setFilteredMiniBets] = useState([]);
  const [combinedBets, setCombinedBets] = useState([]);
  const [selectedOdd, setSelectedOdd] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFlashId, setSelectedFlashId] = useState(null);

  const uid = localStorage.getItem("userUid");
  const idOrganisation = localStorage.getItem("idOrganisation");

  const {
    userData,
    loading: loadingUser,
    error: errorUser,
  } = useGetUserConnecteData(uid);
  const dataBets = useGetBets();
  const dataMiniBets = useGetMiniBets();
  const dataFlash = useGetFlash();

  const userMoney = userData ? userData.nbMonnaie : 0;
  const statusUser = userData ? userData.statusUser : "utilisateur";

  useEffect(() => {
    const checkUserViewedFlash = async (idBet) => {
      try {
        const response = await fetch(
          "https://betkiff-back-test.vercel.app/bets/viewFlashOrNot",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idBet: idBet,
              idUser: userData.idUser,
              idOrganisation,
            }),
          }
        );
        const data = await response.json();

        if (response.ok && data.success) {
          console.log(`L'utilisateur a déjà vu le flash ${idBet}`);
        } else if (response.ok && data.error) {
          console.log(`L'utilisateur n'a pas encore vu le flash ${idBet}`);
          navigate("/flash");
        } else {
          console.log(
            `Erreur lors de la vérification du flash ${idBet}: ${data.error}`
          );
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du flash:", error);
      }
    };
    if (dataFlash.length > 0 && userData && userData.idUser) {
      dataFlash.forEach((flash) => {
        if (flash.idBet) {
          checkUserViewedFlash(flash.idBet);
        }
      });
    }
  });

  const hasUserBet = (betId) => {
    return dataBets.some(
      (bet) => bet.id === betId && bet.bettors && bet.bettors[uid]
    );
  };

  const getUserBetAmount = (betId) => {
    const bet = dataBets.find((b) => b.id === betId);
    if (bet && bet.bettors && bet.bettors[uid]) {
      return bet.bettors[uid].betAmount;
    }
    return null;
  };

  const hasUserMiniBet = (miniBetId) => {
    return dataMiniBets.some(
      (miniBet) =>
        miniBet.id === miniBetId && miniBet.bettors && miniBet.bettors[uid]
    );
  };

  const getUserMiniBetAmount = (miniBetId) => {
    const miniBet = dataMiniBets.find((mb) => mb.id === miniBetId);
    if (miniBet && miniBet.bettors && miniBet.bettors[uid]) {
      return miniBet.bettors[uid].betAmount;
    }
    return null;
  };

  useEffect(() => {
    const allBets = [
      ...dataBets.map((bet) => ({ ...bet, type: "bet" })),
      ...dataMiniBets.map((miniBet) => ({ ...miniBet, type: "miniBet" })),
    ];

    const sortedBets = allBets.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });

    setCombinedBets(sortedBets);
  }, [dataBets, dataMiniBets]);

  const getSportIcon = useSportIcon();
  const navigate = useNavigate();
  const formatDate = useFormattedDate();

  const handleBetAmountChange = (e) => {
    const value = e.target.value;

    // Autoriser une chaîne vide, sinon convertir en nombre
    setBetAmount(value === "" ? "" : Number(value));
  };

  const placeBet = async (type) => {
    if (betAmount <= 0 || betAmount > userMoney || !selectedOdd) {
      alert("Montant invalide ou aucune cote sélectionnée !");
      return;
    }
    const roundedBetAmount = Math.round(betAmount * 10) / 10;
    let payload;
    const path = `organisations/${idOrganisation}/${type}`;
    if (type === "bets") {
      payload = {
        betId: currentBetId,
        userId: uid,
        betAmount: roundedBetAmount,
        outcome: selectedBet,
        selectedOdd: selectedOdd,
      };
    }
    if (type === "miniBets") {
      payload = {
        betId: currentMiniBetId,
        userId: uid,
        betAmount: roundedBetAmount,
        outcome: selectedMiniBet,
        selectedOdd: selectedOdd,
      };
    }

    console.log("Payload pour l'API :", payload);

    try {
      // Enregistrer le pari
      const response = await fetch(
        "https://betkiff-back-test.vercel.app/bets/placerBets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path, ...payload }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API :", errorData);
        throw new Error(
          errorData.error || "Erreur lors de l'enregistrement du pari."
        );
      }

      const result = await response.json();
      console.log("Pari enregistré avec succès :", result);

      // Mettre à jour `nbMonnaie` de l'utilisateur
      const updateResponse = await fetch(
        "https://betkiff-back-test.vercel.app/users/updateMonnaie",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: uid,
            newMoney: userMoney - roundedBetAmount,
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

      const updateResult = await updateResponse.json();
      console.log("Monnaie mise à jour avec succès :", updateResult);

      // Mettre à jour l'interface utilisateur
      alert("Pari placé et monnaie mise à jour avec succès !");
      setBetAmount(0);
      setSelectedBet(null);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'appel API :", error);
      alert(error.message || "Une erreur s'est produite.");
    }
  };

  const openBetModal = (betId, option, odds) => {
    setSelectedBet(option);
    setCurrentBetId(betId);
    setOpenModal(true);
    setSelectedOdd(odds);
  };

  const closeBetModal = () => {
    setOpenModal(false);
    setSelectedBet(null);
    setBetAmount(0);
    setSelectedOdd(null);
    setCurrentBetId(null);
  };

  const openMiniBetModal = (miniBetId, option, odds) => {
    setSelectedMiniBet(option);
    setCurrentMiniBetId(miniBetId);
    setOpenMiniModal(true);
    setSelectedOdd(odds);
  };

  const closeMiniBetModal = () => {
    setOpenMiniModal(false);
    setSelectedMiniBet(null);
    setCurrentMiniBetId(null);
    setBetAmount(0);
    setSelectedOdd(null);
  };

  const handleSettingsClick = (betId, format) => {
    const route =
      format === "mini" ? `/manageMiniBets/${betId}` : `/manageBets/${betId}`;
    navigate(route);
  };

  const renderSettingsIcon = (betId, format) => {
    if (statusUser === "admin") {
      // console.log("id du bet", betId);
      return (
        <SettingsIcon
          sx={{
            color: "white",
            cursor: "pointer",
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: "1000",
          }}
          onClick={() => handleSettingsClick(betId, format)}
        />
      );
    }
    return null;
  };

  const deleteFlash = async () => {
    if (!selectedFlashId) return;

    try {
      const response = await fetch(
        `https://betkiff-back-test.vercel.app/bets/deleteFlash`, // Pas besoin de l'ID dans l'URL
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idBet: selectedFlashId, // Envoi de l'ID dans le corps de la requête
            idOrganisation,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de la suppression :", errorData);
        throw new Error(
          errorData.error || "Erreur lors de la suppression du flash."
        );
      }

      const result = await response.json();
      console.log("Flash supprimé avec succès :", result);

      alert("Flash supprimé avec succès !");
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression du flash :", error);
      alert(error.message || "Une erreur s'est produite.");
    }
  };

  const openConfirmationDialog = (idBet) => {
    setSelectedFlashId(idBet);
    setOpenDialog(true);
  };

  const closeConfirmationDialog = () => {
    setOpenDialog(false);
    setSelectedFlashId(null);
  };

  // pour les filtres
  useEffect(() => {
    const filterBets = (items, filter) => {
      if (filter === "Tous") return items;

      return items.filter(
        (item) =>
          item.bettingStatus === filter.toLowerCase() ||
          item.matchStatus === filter.toLowerCase()
      );
    };

    setFilteredBets(filterBets(combinedBets, filter));
  }, [filter, combinedBets]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loadingUser) return <p>Chargement des données utilisateur...</p>;
  if (errorUser)
    return (
      <p>Erreur lors du chargement des données utilisateur : {errorUser}</p>
    );

  return (
    <Box>
      <Filtre onFilterChange={handleFilterChange} />
      <Box
        sx={{
          padding: "3vh 3vh 7vh 3vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          borderRadius: "20px",
          zIndex: 0,
        }}>
        {loadingUser ? (
          <CircularProgress />
        ) : errorUser ? (
          <Alert severity="error">{errorUser}</Alert>
        ) : filteredBets.length === 0 && filteredMiniBets.length === 0 ? (
          <Typography>Aucun pari disponible pour le moment.</Typography>
        ) : (
          <>
            {dataFlash &&
              filter !== "Terminé" &&
              dataFlash.map((flash, index) => (
                <Box key={index}>
                  <Card
                    sx={{
                      border: "2px solid rgba(225, 191, 228, 255)",
                      backgroundColor: "transparent",
                      borderRadius: "20px",
                      marginBottom: "25px",
                    }}>
                    <CardContent sx={{ padding: "0", margin: "0" }}>
                      <Box
                        sx={{
                          backgroundColor: "rgba(225, 191, 228, 255)",
                          padding: "10px",
                          position: "relative",
                        }}>
                        <Box
                          sx={{
                            position: "absolute",
                            left: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            display: "flex",
                            alignItems: "center",
                          }}>
                          <FlashAnimation />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(51, 1, 71)",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}>
                          {formatDate(flash.endDate, flash.endTime)}
                        </Typography>

                        {/* Vérification pour afficher le bouton de suppression uniquement pour les admins */}
                        {statusUser === "admin" && (
                          <Button
                            sx={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              backgroundColor: "red",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "darkred",
                              },
                            }}
                            onClick={() => openConfirmationDialog(flash.id)}>
                            X
                          </Button>
                        )}
                      </Box>

                      <Box sx={{ margin: "20px 20px 0px 20px" }}>
                        <Typography
                          variant="h5"
                          sx={{
                            color: "rgba(51, 1, 71)",
                            fontWeight: "bold",
                            lineHeight: 1,
                          }}>
                          {flash.title}
                        </Typography>
                        <Typography
                          color="rgba(51, 1, 71)"
                          sx={{ marginTop: "20px" }}>
                          Récompense : {flash.reward} 🤙🏻
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            {filteredBets.map((bet) => (
              <div key={bet.id}>
                {bet.type === "bet" ? (
                  <BetCard
                    bet={bet}
                    hasUserBet={hasUserBet}
                    openBetModal={openBetModal}
                    getSportIcon={getSportIcon}
                    formatDate={formatDate}
                    renderSettingsIcon={renderSettingsIcon}
                    getUserBetAmount={getUserBetAmount}
                  />
                ) : (
                  <MiniBetCard
                    minibet={bet}
                    hasUserMiniBet={hasUserMiniBet}
                    openMiniBetModal={openMiniBetModal}
                    getSportIcon={getSportIcon}
                    formatDate={formatDate}
                    renderSettingsIcon={renderSettingsIcon}
                    getUserMiniBetAmount={getUserMiniBetAmount}
                  />
                )}
              </div>
            ))}

            {/* Dialogue pour la suppression du flash */}
            <Dialog open={openDialog} onClose={closeConfirmationDialog}>
              <DialogTitle>
                {"Êtes-vous sûr de vouloir supprimer ce défi flash ?"}
              </DialogTitle>
              <DialogContent>
                <p>
                  Vous allez supprimer le défi flash, êtes vous sûr de vous ?
                </p>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeConfirmationDialog} color="primary">
                  Annuler
                </Button>
                <Button onClick={deleteFlash} color="secondary">
                  Confirmer
                </Button>
              </DialogActions>
            </Dialog>

            {/* open le modal de pari */}
            <Backdrop open={openModal} sx={{ zIndex: 1, color: "#fff" }}>
              <Dialog open={openModal} onClose={closeBetModal}>
                <DialogContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "rgba(90,20,121,254)",
                        fontWeight: "bold",
                      }}>
                      {selectedBet === "winTeam1"
                        ? "Victoire de " +
                          dataBets.find((b) => b.id === currentBetId)?.team1
                        : selectedBet === "draw"
                          ? "Parier sur le nul"
                          : "Victoire de " +
                            dataBets.find((b) => b.id === currentBetId)?.team2}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        marginTop: 2,
                        color: userMoney - betAmount < 0 ? "red" : "black", // Change la couleur en fonction du montant du pari
                      }}>
                      Solde : {userMoney - betAmount} 🤙🏻
                    </Typography>
                    {betAmount >= 0 && selectedBet && (
                      <Typography
                        variant="caption"
                        sx={{
                          marginBottom: 2,
                          color:
                            selectedBet === "winTeam1"
                              ? betAmount *
                                  dataBets.find((b) => b.id === currentBetId)
                                    ?.odds.winTeam1 >
                                1
                                ? "green"
                                : "black"
                              : selectedBet === "draw"
                                ? betAmount *
                                    dataBets.find((b) => b.id === currentBetId)
                                      ?.odds.draw >
                                  1
                                  ? "green"
                                  : "black"
                                : betAmount *
                                      dataBets.find(
                                        (b) => b.id === currentBetId
                                      )?.odds.winTeam2 >
                                    1
                                  ? "green"
                                  : "black",
                        }}>
                        Gain :
                        {selectedBet === "winTeam1"
                          ? " " +
                            betAmount *
                              dataBets.find((b) => b.id === currentBetId)?.odds
                                .winTeam1 +
                            "🤙🏻"
                          : selectedBet === "draw"
                            ? " " +
                              betAmount *
                                dataBets.find((b) => b.id === currentBetId)
                                  ?.odds.draw +
                              "🤙🏻"
                            : " " +
                              betAmount *
                                dataBets.find((b) => b.id === currentBetId)
                                  ?.odds.winTeam2 +
                              "🤙🏻"}
                      </Typography>
                    )}

                    <TextField
                      label="Montant"
                      type="number"
                      value={betAmount}
                      onChange={handleBetAmountChange}
                      fullWidth
                      sx={{
                        marginTop: 2,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(90,20,121,254)", // couleur du contour par défaut
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(90,20,121,254)", // couleur du contour au survol
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "rgba(90,20,121,254)", // couleur du contour quand le champ est focus
                          },
                        },
                        // Couleur de l'écriture
                        "& .MuiInputBase-input": {
                          color: "rgba(90,20,121,254)", // couleur du texte de l'input
                        },
                        // Couleur du label
                        "& .MuiInputLabel-root": {
                          color: "rgba(90,20,121,254)", // couleur du label
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "rgba(90,20,121,254)", // couleur du label quand focus
                        },
                      }}
                      InputProps={{ inputProps: { min: 0, max: userMoney } }}
                    />
                  </Box>
                </DialogContent>

                <DialogActions>
                  <Button
                    onClick={closeBetModal}
                    sx={{
                      flex: 1,
                      backgroundColor: "rgba(90,20,121,254)",
                      color: "white",
                    }}>
                    Annuler
                  </Button>
                  <Button
                    onClick={() => placeBet("bets")}
                    sx={{
                      color: "rgba(90,20,121,254)",
                    }}
                    disabled={betAmount <= 0 || betAmount > userMoney}>
                    Placer le pari
                  </Button>
                </DialogActions>
              </Dialog>
            </Backdrop>
            <Backdrop open={openMiniModal} sx={{ zIndex: 1, color: "#fff" }}>
              <Dialog open={openMiniModal} onClose={closeMiniBetModal}>
                <DialogContent>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "rgba(90,20,121,254)",
                        fontWeight: "bold",
                      }}>
                      Parier sur :{" "}
                      {selectedMiniBet || "Aucune option sélectionnée"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        marginTop: 2,
                        color: userMoney - betAmount < 0 ? "red" : "black",
                      }}>
                      Solde : {userMoney - betAmount} 🤙🏻
                    </Typography>
                    {betAmount >= 0 && selectedOdd && (
                      <Typography
                        variant="caption"
                        sx={{
                          marginBottom: 2,
                          color:
                            betAmount * (selectedOdd || 0) > 1
                              ? "green"
                              : "black",
                        }}>
                        Gain potentiel :{" "}
                        {Math.round(betAmount * (selectedOdd || 0) * 10) / 10}{" "}
                        🤙🏻
                      </Typography>
                    )}

                    <TextField
                      label="Montant"
                      type="number"
                      value={betAmount === "" ? "" : betAmount} // Affiche une chaîne vide si nécessaire
                      onChange={handleBetAmountChange}
                      fullWidth
                      sx={{
                        marginTop: 2,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(90,20,121,254)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(90,20,121,254)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "rgba(90,20,121,254)",
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: "rgba(90,20,121,254)",
                        },
                        "& .MuiInputLabel-root": {
                          color: "rgba(90,20,121,254)",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "rgba(90,20,121,254)",
                        },
                      }}
                      InputProps={{ inputProps: { min: 0, max: userMoney } }}
                    />
                  </Box>
                </DialogContent>

                <DialogActions>
                  <Button
                    onClick={closeMiniBetModal}
                    sx={{
                      flex: 1,
                      backgroundColor: "rgba(90,20,121,254)",
                      color: "white",
                    }}>
                    Annuler
                  </Button>
                  <Button
                    onClick={() => placeBet("miniBets")}
                    sx={{
                      color: "rgba(90,20,121,254)",
                    }}
                    disabled={betAmount <= 0 || betAmount > userMoney}>
                    Placer le pari
                  </Button>
                </DialogActions>
              </Dialog>
            </Backdrop>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Home;
