// VERSION STABLE

import React, { useState, useEffect } from "react";
import { Typography, Button, CircularProgress, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import background1 from "../../Images/bg_opening1.jpeg";
import background2 from "../../Images/bg_opening2.png";
import card0 from "../../Images/card/card0.jpeg";
import card1 from "../../Images/card/card1.jpeg";
import card2 from "../../Images/card/card2.jpeg";
import card3 from "../../Images/card/card3.jpeg";
import card4 from "../../Images/card/card4.jpeg";
import card5 from "../../Images/card/card5.jpeg";
import card6 from "../../Images/card/card6.jpeg";
import card7 from "../../Images/card/card7.jpeg";
// import card8 from "../../Images/card/card8.jpeg";
import card9 from "../../Images/card/card9.jpeg";
import card10 from "../../Images/card/card10.jpeg";
import card13 from "../../Images/card/card13.jpeg";
import card14 from "../../Images/card/card14.jpeg";
import card15 from "../../Images/card/card15.jpeg";
import card19 from "../../Images/card/card19.jpeg";
import card20 from "../../Images/card/card20.jpeg";
import card21 from "../../Images/card/card21.jpeg";

import cardBack from "../../Images/cardBack.jpeg";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import { useGetUserConnecteData } from "../Utilisateur/Component/RecupererDonneeUser";

const goldCard = [{ id: 1, title: "000", imageUrl: card0 }];

const prezCards = [
  { id: 1, title: "001", imageUrl: card1 },
  { id: 2, title: "002", imageUrl: card2 },
  { id: 3, title: "003", imageUrl: card3 },
  { id: 4, title: "004", imageUrl: card4 },
];

const objectCards = [
  { id: 1, title: "020", imageUrl: card20 },
  { id: 2, title: "021", imageUrl: card21 },
];

const possibleCards = [
  { id: 1, title: "005", imageUrl: card5 },
  { id: 1, title: "006", imageUrl: card6 },
  { id: 3, title: "007", imageUrl: card7 },
  // { id: 4, title: "008", imageUrl: card8 },
  { id: 4, title: "009", imageUrl: card9 },
  { id: 5, title: "010", imageUrl: card10 },
  // { id: 7, title: "011", imageUrl: card11 },
  // { id: 8, title: "012", imageUrl: card12 },
  { id: 6, title: "013", imageUrl: card13 },
  { id: 7, title: "014", imageUrl: card14 },
  { id: 8, title: "015", imageUrl: card15 },
  // { id: 12, title: "016", imageUrl: card16 },
  // { id: 13, title: "017", imageUrl: card17 },
  // { id: 14, title: "018", imageUrl: card18 },
  { id: 9, title: "019", imageUrl: card19 },
];

export default function PackOpening() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [isOpening, setIsOpening] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [showTypography, setShowTypography] = useState(true);
  const [animateCard, setAnimateCard] = useState(false);
  const [slideUp2Active, setSlideUp2Active] = useState(false);
  // eslint-disable-next-line
  const [currentBack, setCurrentBack] = useState(cardBack);
  const [currentImage, setCurrentImage] = useState(currentBack);
  const [showButton, setShowButton] = useState(false);

  const UidCurrentUser = localStorage.getItem("userUid");
  const uData = useGetUserConnecteData(UidCurrentUser);
  const userData = uData.userData;

  const idOrganisation = localStorage.getItem("idOrganisation");

  useEffect(() => {
    const isOpeningLocal = JSON.parse(localStorage.getItem("opening"));
    if (!isOpeningLocal) {
      navigate("/collection");
    }
  }, [navigate]);

  // Pré-chargement des images pour améliorer les performances
  const preloadImages = (imageUrls) => {
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };

  useEffect(() => {
    const allImages = [
      background1,
      background2,
      cardBack,
      ...goldCard.map((c) => c.imageUrl),
      ...prezCards.map((c) => c.imageUrl),
      ...objectCards.map((c) => c.imageUrl),
      ...possibleCards.map((c) => c.imageUrl),
    ];
    preloadImages(allImages);
  }, []);

  // Fonction pour appeler l'API backend pour ouvrir un pack
  const openPack = async () => {
    try {
      setIsOpening(true);
      localStorage.removeItem("opening"); // Supprime l'état "opening"

      // Appel à l'API backend
      const response = await fetch(
        "https://betkiff-back-test.vercel.app/card/openPack",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idUser: userData.idUser,
            cardsData: {
              goldCard,
              prezCards,
              objectCards,
              possibleCards,
            },
            idOrganisation,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const drawnCard = data.card;
        setCards([drawnCard]);
        setIsOpening(false);

        setTimeout(() => {
          setCurrentImage(drawnCard.imageUrl); // Change l'image après un tour
        }, 1000);

        setAnimateCard(true);
        setTimeout(() => setShowButton(true), 3000);
      } else {
        console.error("Erreur lors de l'ouverture du pack :", data.error);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  // Gestion des clics pour déclencher l'ouverture du pack
  const handleClick = () => {
    setClicks((prev) => prev + 1);

    // Active un flash temporaire
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 100);

    if (clicks >= 4) {
      setShowTypography(false);
      openPack();
    }
  };

  // Gestion de l'animation et navigation après ouverture
  const handleSlideUp2 = () => {
    setSlideUp2Active(true);
    setShowButton(false);
    setTimeout(() => navigate("/collection"), 1000);
  };
  return (
    <div style={{ position: "fixed", width: "100%", height: "100vh" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          textAlign: "center",
        }}>
        {showTypography && (
          <Typography
            variant="h4"
            onClick={handleClick}
            sx={{
              fontWeight: "bold",
              color: "rgb(68, 1, 104)",
              zIndex: 3,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: `${1 + clicks * 0.2}em`,
              transition: "transform 0.2s",
            }}>
            TAP HERE !
          </Typography>
        )}
        {showButton && cards.length > 0 && (
          <Box
            onClick={handleSlideUp2}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
              backgroundColor: "transparent", // Maintient un arrière-plan transparent
              cursor: "pointer", // Ajoute un pointeur pour indiquer que c'est cliquable
            }}>
            <Button
              variant="outlined"
              sx={{
                position: "absolute", // Permet un positionnement contrôlé
                top: "10vh", // Place le bouton à 20% de la hauteur de la page
                left: "50%", // Centre le bouton horizontalement
                transform: "translateX(-50%)", // Recentre le bouton après le décalage dû à `left: 50%`
                borderColor: "#7000b5",
                color: "#7000b5",
                animation: "pulse 1.5s infinite",
                zIndex: 11, // Assure que le bouton reste au-dessus
                pointerEvents: "none", // Empêche le bouton de capturer les clics
                "&:hover": {
                  borderColor: "rgb(68, 1, 104)",
                  color: "rgb(68, 1, 104)",
                },
                "@keyframes pulse": {
                  "0%": { boxShadow: "0 0 0 0 rgba(128, 0, 128, 0.4)" },
                  "70%": { boxShadow: "0 0 30px 30px rgba(128, 0, 128, 0)" },
                  "100%": { boxShadow: "0 0 0 0 rgba(128, 0, 128, 0)" },
                },
              }}>
              <ArrowUpwardIcon />
            </Button>
          </Box>
        )}

        <img
          src={background1}
          alt="Background 1"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        />

        {isOpening && (
          <div style={{ zIndex: 3, position: "relative" }}>
            <CircularProgress />
          </div>
        )}

        {!isOpening && cards.length > 0 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "50%",
              transform: "translate(-50%, 50%)",
              zIndex: 2,
              animation: slideUp2Active
                ? "slideUp2 1s ease-in-out forwards"
                : "slideUp 1s ease-in-out forwards",
            }}>
            <img
              src={currentImage}
              alt="Card"
              style={{
                borderRadius: "10px",
                width: "200px",
                height: "auto",
                zIndex: 200,
                animation: animateCard
                  ? "rotateCard 2s ease-out forwards"
                  : "none",
              }}
              onAnimationEnd={() => setAnimateCard(false)}
            />
          </div>
        )}

        <img
          src={background2}
          alt="Background 2"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 4,
            pointerEvents: "none",
          }}
        />

        {flashActive && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "white",
              opacity: 0.8,
              zIndex: 5,
              animation: "flash 0.1s linear",
            }}
          />
        )}

        <style>
          {`
@keyframes slideUp {
            0% {
              transform: translateX(-50%) translateY(200%);
            }
            50% {
              transform: translateX(-50%) translateY(50%);
            }
            100% {
              transform: translateX(-50%) translateY(50%);
            }
          }

  .element {
    animation: slideUp 1s ease-in-out forwards;
    will-change: transform;
  }

          @keyframes slideUp2 {
            0% {
              transform: translateX(-50%) translateY(50%);
              opacity: 1;
            }
            100% {
              transform: translateX(-50%) translateY(-200%);
             
            }
          }
          @keyframes rotateCard {
            0% {
              transform: rotateY(0deg);
              background-image: url('${currentBack}');
            }
            50% {
              transform: rotateY(2160deg);
              background-image: url('${currentBack}');
            }
            60% {
              transform: rotateY(2700deg);
              background-image: url('${cards[0]?.imageUrl || ""}');
            }
            100% {
              transform: rotateY(3240deg);
              background-image: url('${cards[0]?.imageUrl || ""}');
            }
          }   
          @keyframes flash {
            0% {
              opacity: 0.8;
            }
            100% {
              opacity: 0;
            }
          }
          }
          `}
        </style>
      </div>
    </div>
  );
}
