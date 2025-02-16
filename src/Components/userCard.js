import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function UserCard({ user, onClick, index }) {
  // Définir les couleurs de fond, texte et avatar selon le classement
  // const getStyles = (rank) => {
  //   const commonColor = "black";
  //   const topColors = {
  //     0: {
  //       background: "linear-gradient(45deg, #d4af37, #ffcc00)",
  //       text: commonColor,
  //       backgroundAvatar: "white",
  //     }, // 1er
  //     1: {
  //       background: "linear-gradient(45deg, #c0c0c0, #b0b0b0)",
  //       text: commonColor,
  //       backgroundAvatar: "white",
  //     }, // 2e
  //     2: {
  //       background: "linear-gradient(45deg, #cd7f32, #b08d57)",
  //       text: commonColor,
  //       backgroundAvatar: "white",
  //     }, // 3e
  //   };

  //   return (
  //     topColors[rank] || {
  //       background: "#de91e5",
  //       text: "black",
  //       backgroundAvatar: "transparent",
  //     }
  //   ); // Par défaut
  // };

  // const { background, text, backgroundAvatar } = getStyles(index);

  return (
    <Box
      onClick={onClick}
      sx={{
        background: "transparent", // Fond dynamique basé sur le classement
        marginBottom: 2,
        padding: 2,
        borderRadius: "10px",
        border: `2px solid ${user.statusUser === "admin" ? "gold" : "rgba(90, 20, 121, 254)"}`,
        cursor: "pointer",
        "&:hover": { backgroundColor: "#ececec" },
        display: "flex",
        alignItems: "center",
        position: "relative", // Position relative pour le conteneur
        overflow: "hidden", // Empêcher le débordement
      }}>
      {/* Numéro */}
      <Typography
        variant="h3"
        sx={{
          color: "rgba(90, 20, 121)",
          fontWeight: "bold",
          position: "absolute", // Position absolue pour le décalage
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "6.2rem", // Taille du texte pour le numéro
          opacity: 0.8,
          zIndex: 0, // Envoyer à l'arrière-plan
          letterSpacing: "-0.3rem",
        }}>
        {index + 1}
      </Typography>

      {/* Contenu principal */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          zIndex: 1, // Le contenu principal passe au-dessus
        }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            marginLeft: 15,
            whiteSpace: "nowrap", // Empêche le retour à la ligne
            overflow: "hidden", // Cache les débordements
            textOverflow: "ellipsis", // Ajoute des points de suspension si nécessaire
          }}>
          {user.nomUser.length > 12
            ? `${user.nomUser.slice(0, 12)}...` // Tronque à 20 caractères et ajoute "..."
            : user.nomUser}
        </Typography>
      </Box>

      {/* Nombre de points */}
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          color: index <= 2 ? "white" : "black", // Couleur blanche pour les premiers, gris pour les autres
          marginLeft: "auto",
          zIndex: 1, // Le contenu principal passe au-dessus
        }}>
        🤙🏻{user.nbMonnaie}
      </Typography>
    </Box>
  );
}
