import React, { useEffect, useState, useRef } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom"; // Pour la navigation
import card0 from "../../Images/card/card0.jpeg";
import card1 from "../../Images/card/card1.jpeg";
import card2 from "../../Images/card/card2.jpeg";
import card3 from "../../Images/card/card3.jpeg";
import card4 from "../../Images/card/card4.jpeg";
import card5 from "../../Images/card/card5.jpeg";
import card6 from "../../Images/card/card6.jpeg";
import card7 from "../../Images/card/card7.jpeg";
import card8 from "../../Images/card/card8.jpeg";
import card9 from "../../Images/card/card9.jpeg";
import card10 from "../../Images/card/card10.jpeg";
import card13 from "../../Images/card/card13.jpeg";
import card14 from "../../Images/card/card14.jpeg";
import card15 from "../../Images/card/card15.jpeg";
import card19 from "../../Images/card/card19.jpeg";
import card20 from "../../Images/card/card20.jpeg";
import card21 from "../../Images/card/card21.jpeg";
import card22 from "../../Images/card/special0.jpeg";

import Box from "@mui/joy/Box";
import { Badge } from "@mui/material";
import useCollectionData from "./Component/useCollectionData";
import { useGetUserConnecteData } from "../Utilisateur/Component/RecupererDonneeUser";
import { useUser } from "../../Services/ContexteUser";

const items = [
  { id: 0, title: "000", imageUrl: card0 }, //
  { id: 1, title: "001", imageUrl: card1 }, //
  { id: 2, title: "002", imageUrl: card2 }, //
  { id: 3, title: "003", imageUrl: card3 }, //
  { id: 4, title: "004", imageUrl: card4 }, //
  { id: 5, title: "005", imageUrl: card5 }, //
  { id: 6, title: "006", imageUrl: card6 }, //
  { id: 7, title: "007", imageUrl: card7 }, //
  { id: 8, title: "008", imageUrl: card8 },
  { id: 9, title: "009", imageUrl: card9 }, //
  { id: 10, title: "010", imageUrl: card10 }, //
  { id: 11, title: "011", imageUrl: card8 },
  { id: 12, title: "012", imageUrl: card8 },
  { id: 13, title: "013", imageUrl: card13 }, //
  { id: 14, title: "014", imageUrl: card14 },
  { id: 15, title: "015", imageUrl: card15 }, //
  { id: 16, title: "016", imageUrl: card8 },
  { id: 17, title: "017", imageUrl: card8 },
  { id: 18, title: "018", imageUrl: card8 },
  { id: 19, title: "019", imageUrl: card19 },
  { id: 20, title: "020", imageUrl: card20 },
  { id: 21, title: "021", imageUrl: card21 },
  { id: 22, title: "022", imageUrl: card22 },
];

export default function Collection() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("userUid");
  const idOrganisation = localStorage.getItem("idOrganisation");

  const { userData } = useGetUserConnecteData(currentUser);

  const { updateMonnaie } = useUser(); // Récupère updateMonnaie du contexte

  const [countdown, setCountdown] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const updatedItems = [...items];
  console.log(updatedItems);

  const [isLoading, setIsLoading] = useState(true);

  ////// Affichage des cartes : replacement lors du grossissement
  // Si l'index sélectionné est impair, réorganisez les cartes
  if (selectedImageIndex % 2 !== 0) {
    const selectedIndex = updatedItems.findIndex(
      (item) => item.id === selectedImageIndex
    );
    if (selectedIndex > 0) {
      const previousItem = updatedItems[selectedIndex - 1];
      updatedItems.splice(selectedIndex - 1, 1); // Supprime l'élément précédent
      updatedItems.splice(selectedIndex, 0, previousItem); // Ajoute après l'élément sélectionné
    }
  }

  ////// Affichage des cartes : grossissement
  const handleImageClick = (index) => {
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null); // Désélectionner si l'image est déjà agrandie
    } else {
      setSelectedImageIndex(index); // Sélectionner l'image pour l'agrandir
    }
  };

  ////// Modification de la monnaie lors de l'ouverture d'un pack et démarrage de la procédure avce la redirection
  const handleOpenPack = async () => {
    if (isMonnaieSufficient) {
      const newKiff = userData.nbMonnaie - 35;

      if (newKiff !== null) {
        try {
          // Mettre à jour la monnaie via l'API
          const updateResponse = await fetch(
            "https://betkiff-back-test.vercel.app/users/updateMonnaie",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: userData.idUser,
                newMoney: newKiff,
                idOrganisation,
              }),
            }
          );

          if (updateResponse.ok) {
            // Mettre à jour la monnaie dans le contexte
            updateMonnaie(newKiff); // Appelle la fonction updateMonnaie du context pour mettre à jour l'état

            // Enregistrer l'ouverture dans le localStorage
            localStorage.setItem("opening", JSON.stringify(true));

            // Navigation après la mise à jour
            navigate("/packopening");
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour des kiffs :", error);
        }
      }
    }
  };

  ////// Vérifie s'il a la carte
  const hasCard = (cardTitle) => {
    return userData?.collection?.hasOwnProperty(cardTitle);
  };

  const collection = useCollectionData(userData);

  const isMonnaieSufficient = userData?.nbMonnaie >= 35;

  ////// Vérifie si le temps du dernier pack gratuit est de plus ou moins 12h
  const isLessThan12h = (lastOpening) => {
    if (!lastOpening) return false;

    const lastOpeningDate = new Date(lastOpening);
    const now = new Date();

    const differenceInMilliseconds = now - lastOpeningDate;
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

    return differenceInHours < 12;
  };

  ////// Compte à rebours pour le pack gratuit
  const calculateCountdown = (lastOpening) => {
    if (!lastOpening) return null;

    const lastOpeningDate = new Date(lastOpening);
    const nextFreePackTime = new Date(
      lastOpeningDate.getTime() + 24 * 60 * 60 * 1000
    );
    const now = new Date();

    const timeLeft = nextFreePackTime - now;

    if (timeLeft <= 0) return null; // Si le temps est écoulé, pas de compte à rebours

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 12);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return { hours, minutes, seconds };
  };

  let lessThan12h = true;

  if (userData?.last_opening) {
    lessThan12h = isLessThan12h(userData.last_opening);
  }

  ////// Modif de last_opening dans la bdd + déclanchement du pack opening gratiut avec la redirection
  const handleFreeOpenPack = async () => {
    try {
      // Obtenir la date et l'heure actuelles
      const now = new Date().toISOString();

      // Appeler l'API backend pour mettre à jour last_opening
      const response = await fetch(
        "https://betkiff-back-test.vercel.app/users/updateUserLastOpening",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData.idUser,
            newLastOpening: now,
            idOrganisation,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API mise à jour last_opening :", errorData);
        throw new Error(errorData.error || "Erreur lors de la mise à jour.");
      }

      // Mise à jour réussie, stocker et naviguer
      localStorage.setItem("opening", JSON.stringify(true));
      navigate("/packopening");
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la base de données :",
        error
      );
    }
  };

  ////// gestioin du délai pour le pack gratuit avec calculateCountdown
  useEffect(() => {
    if (lessThan12h) {
      const interval = setInterval(() => {
        const newCountdown = calculateCountdown(userData?.last_opening);
        setCountdown(newCountdown);

        if (!newCountdown) {
          clearInterval(interval); // Arrête le compte à rebours quand il arrive à zéro
        }
      }, 1000);

      return () => clearInterval(interval); // Nettoyage du timer à la fin
    } else {
      setCountdown(null); // Réinitialiser si le délai est passé
    }
  }, [lessThan12h, userData?.last_opening]);

  const refs = useRef({}); // Stocke les références des éléments

  // Effet pour centrer l'élément sélectionné
  useEffect(() => {
    if (selectedImageIndex && refs.current[selectedImageIndex]) {
      refs.current[selectedImageIndex].scrollIntoView({
        behavior: "smooth", // Animation douce
        block: "center", // Centrer verticalement
        inline: "center", // Centrer horizontalement (si nécessaire)
      });
    }
  }, [selectedImageIndex]);

  useEffect(() => {
    setIsLoading(!userData); // isLoading est vrai tant que userData est null
  }, [userData]);

  return (
    <div style={{ padding: "20px", marginTop: "15%", paddingBottom: "20%" }}>
      {isLoading ? (
        <Box
          sx={{
            padding: 3,
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "20px",
            zIndex: 100,
            width: "80%",
            maxWidth: "1200px",
          }}>
          <Grid
            container
            sx={{ textAlign: "center", width: "100%", alignItems: "center" }}>
            <Typography
              variant="h7"
              sx={{
                color: "black", // Couleur conditionnelle
                fontWeight: "bold",
              }}>
              Chargement...
            </Typography>
          </Grid>
        </Box>
      ) : (
        <>
          <Paper
            elevation={3}
            sx={{
              borderRadius: "20px",
              marginBottom: "10px",
              backgroundColor: "transparent",
            }}>
            <Grid
              container
              sx={{ textAlign: "center", width: "100%", alignItems: "center" }}>
              <Grid item xs={6}>
                <Typography
                  variant="h7"
                  sx={{
                    color: isMonnaieSufficient ? "black" : "red", // Couleur conditionnelle
                    fontWeight: "bold",
                  }}>
                  🤙🏻35
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenPack}
                  sx={{
                    width: "100%",
                    borderRadius: "20px",
                    backgroundColor: isMonnaieSufficient
                      ? "#ee95f6"
                      : "transparent", // Fond conditionnel
                    border: isMonnaieSufficient ? "none" : "1px solid red", // Contour rouge si monnaie insuffisante
                    "&:hover": {
                      backgroundColor: isMonnaieSufficient
                        ? "#ee95f6"
                        : "transparent",
                    },
                  }}
                  disabled={!isMonnaieSufficient}>
                  Ouvrir un pack
                </Button>
              </Grid>
            </Grid>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              borderRadius: "20px",
              marginBottom: "20px",
              backgroundColor: "transparent",
            }}>
            <Grid
              container
              sx={{ textAlign: "center", width: "100%", alignItems: "center" }}>
              <Grid item xs={6}>
                <Typography
                  variant="h7"
                  sx={{
                    color:
                      lessThan12h && userData?.last_opening ? "red" : "black", // Couleur conditionnelle
                    fontWeight: "bold",
                  }}>
                  Pack gratuit
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFreeOpenPack}
                  sx={{
                    width: "100%",
                    borderRadius: "20px",
                    backgroundColor:
                      isLoading || (lessThan12h && userData?.last_opening)
                        ? "transparent"
                        : "#ee95f6",
                    border:
                      isLoading || (lessThan12h && userData?.last_opening)
                        ? "1px solid red"
                        : "none",
                    "&:hover": {
                      backgroundColor:
                        isLoading || lessThan12h ? "transparent" : "#ee95f6",
                    },
                  }}
                  disabled={
                    isLoading || (lessThan12h && userData?.last_opening)
                  }>
                  {isLoading
                    ? "Chargement..."
                    : lessThan12h && countdown && userData?.last_opening
                      ? `${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`
                      : "Ouvrir un pack"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
          <Grid container spacing={2}>
            {updatedItems.map((item, index) => {
              // Récupérer le nombre de doublons pour cette carte dans la collection
              const doublons =
                collection.find((card) => card.title === item.title)
                  ?.doublons || 0;

              return (
                <Grid
                  item
                  xs={selectedImageIndex === item.id ? 12 : 6}
                  sm={selectedImageIndex === item.id ? 12 : 6}
                  md={selectedImageIndex === item.id ? 12 : 6}
                  key={item.id}
                  sx={{
                    minHeight:
                      selectedImageIndex === item.id ? "440px" : "220px",
                  }}
                  ref={(el) => (refs.current[item.id] = el)}>
                  <Paper
                    elevation={3}
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      position: "relative", // Nécessaire pour positionner la pastille
                      backgroundColor: "transparent",
                    }}>
                    {hasCard(item.title) && (
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                        }}>
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            cursor: "pointer",
                            objectFit: "cover",
                          }}
                          onClick={() => handleImageClick(item.id)}
                        />
                        {/* Affichage de la pastille si le nombre de doublons est supérieur à 1 */}
                        {doublons > 1 && (
                          <Badge
                            badgeContent={doublons}
                            color="secondary"
                            sx={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              "& .MuiBadge-badge": {
                                fontSize: 15,
                                height: 25,
                                minWidth: 25,
                              },
                            }}
                          />
                        )}
                      </Box>
                    )}
                    {!hasCard(item.title) && (
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "#e1bfe4",
                          textShadow: "1px 1px 4px rgba(0, 0, 0, 0.7)",
                        }}>
                        {item.title}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </div>
  );
}
