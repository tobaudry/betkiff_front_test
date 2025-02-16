import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlashAnimation from "./Component/FlashAnimation";
import BackgroundAnimation from "./Component/BackgroundAnimation";
import { Button, Box, Typography, Card, CardContent } from "@mui/material";
import { useGetFlash } from "../Bets/Affichage_Home/Components/RecupererDonnees";
import { useUser } from "../../Services/ContexteUser";
import useFormattedDate from "../Bets/Affichage_Home/Components/FormatageDate";

const PageFlash = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const flashData = useGetFlash();
  const [flashs, setFlashs] = useState([]);
  const idOrganisation = localStorage.getItem("idOrganisation");

  useEffect(() => {
    if (flashData) {
      const flashArray = Object.values(flashData);
      setFlashs(flashArray);
    }
  }, [flashData]);

  const handleClickPasLesGaufres = async (idBet) => {
    if (userData && userData.idUser) {
      try {
        const response = await fetch(
          "https://backend-betkiff.vercel.app/bets/markAsViewFlash",
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
          },
        );
        navigate("/");
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erreur API mise à jour de vue flash :", errorData);
          throw new Error(
            errorData.error ||
              "Erreur lors de la mise à jour de la vision des flashs.",
          );
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour des flash :", error);
      }
    }
  };

  const handleClickGaufre = async (idBet) => {
    if (userData && userData.idUser) {
      try {
        const response = await fetch(
          "https://backend-betkiff.vercel.app/bets/markAsViewFlash",
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
          },
        );

        const responseListeDefiAccepte = await fetch(
          "https://backend-betkiff.vercel.app/bets/pushUserInListAgreeFlash",
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
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erreur API mise à jour de vue flash :", errorData);
          throw new Error(
            errorData.error ||
              "Erreur lors de la mise à jour de la vision des flashs.",
          );
        }

        if (!responseListeDefiAccepte.ok) {
          const errorData = await response.json();
          console.error(
            "Erreur API mise à jourdes personnes ayant validé le flash :",
            errorData,
          );
          throw new Error(
            errorData.error ||
              "Erreur lors de la mise à jour de la liste des personnes acceptant le flash.",
          );
        }

        navigate("/");
      } catch (error) {
        console.error("Erreur lors de la mise à jour des flash :", error);
      }
    }
  };

  const formatDate = useFormattedDate();

  return (
    <Box>
      <BackgroundAnimation />

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
        }}
      >
        {flashData ? (
          flashs.map((flash, index) => (
            <Box key={index}>
              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    color: "rgba(225, 191, 228, 255)",
                    fontWeight: "bold",
                    lineHeight: 0.9,
                    marginRight: "10px", // Espacement entre le texte et l'animation
                    fontFamily: "StoreB",
                    fontSize: "37vw", // Taille de police dynamique basée sur la largeur de la fenêtre
                    whiteSpace: "nowrap", // Empêche le texte de se couper sur plusieurs lignes
                    width: "100%", // S'assure que le texte prend toute la largeur disponible
                  }}
                >
                  DEFI
                </Typography>
              </Box>
              <Card
                sx={{
                  border: "2px solid rgba(225, 191, 228, 255)",
                  backgroundColor: "rgba(51, 1, 71, 0.25)",
                  borderRadius: "20px",
                  marginBottom: "25px",
                }}
              >
                <CardContent sx={{ padding: "0", margin: "0" }}>
                  <Box
                    sx={{
                      backgroundColor: "rgba(225, 191, 228, 255)",
                      padding: "10px",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FlashAnimation />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#330147",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {formatDate(flash.endDate, flash.endTime)}
                    </Typography>
                  </Box>
                  <Box sx={{ margin: "20px 20px 0px 20px" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "rgba(225, 191, 228, 255)",
                        fontWeight: "bold",
                        lineHeight: 1,
                      }}
                    >
                      {flash.title}
                    </Typography>
                    <Typography
                      color="rgba(225, 191, 228, 255)"
                      sx={{ marginTop: "20px" }}
                    >
                      Récompense : {flash.reward} 🤙🏻
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                    <Button
                      variant="contained"
                      sx={{
                        flex: 1,

                        backgroundColor: "transparent",
                        borderColor: "white",
                        border: 1,
                      }}
                      onClick={() => handleClickPasLesGaufres(flash.id)}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(225, 191, 228, 255)",
                          fontWeight: "bold",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          display: "inline-block",
                        }}
                      >
                        J'ai pas les gaufres
                      </Typography>
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        marginTop: 2,
                        flex: 1,
                        backgroundColor: "rgba(225, 191, 228, 255)",
                        paddingLeft: 4.5,
                        paddingRight: 4.5,
                      }}
                      onClick={() => handleClickGaufre(flash.id)}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#330147",
                          fontWeight: "bold",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          display: "inline-block",
                        }}
                      >
                        Gaufrés à fond
                      </Typography>
                    </Button>
                  </Box>
                </CardContent>
              </Card>
              <Typography
                variant="h1"
                className="flash-text"
                sx={{
                  color: "rgba(225, 191, 228, 255)",
                  fontWeight: "bold",
                  lineHeight: 0.9,
                  marginRight: "10px", // Espacement entre le texte et l'animation
                  fontFamily: "StoreB",
                  fontSize: "27vw", // Taille de police dynamique basée sur la largeur de la fenêtre
                  whiteSpace: "nowrap", // Empêche le texte de se couper sur plusieurs lignes
                  width: "100%", // S'assure que le texte prend toute la largeur disponible
                }}
              >
                FLASH
              </Typography>
            </Box>
          ))
        ) : (
          <p>Chargement des défis...</p>
        )}
      </Box>
    </Box>
  );
};
export default PageFlash;
