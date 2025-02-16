import React from "react";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";

const MiniBetCard = ({
  minibet,
  hasUserMiniBet,
  openMiniBetModal,
  getSportIcon,
  formatDate,
  renderSettingsIcon,
  getUserMiniBetAmount,
}) => {
  return (
    <Card
      key={minibet.id}
      sx={{
        elevation: 2,
        borderRadius: "20px",
        marginBottom: "15px",
      }}
    >
      <CardContent
        sx={{
          padding: "0",
          margin: "0",
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(90,20,121,254)",
            position: "relative",
            padding: "10px",
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
            {getSportIcon(minibet.sportCategory)}
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {formatDate(minibet.date)}
          </Typography>
          {renderSettingsIcon(minibet.id, "mini")}
        </Box>
        <Box sx={{ margin: "20px 20px 0px 20px" }}>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              color: "rgba(90,20,121,254)",
              fontWeight: "bold",
              lineHeight: 1,
            }}
          >
            {minibet.title}
          </Typography>

          {minibet.bettingOpen && minibet.bettingStatus !== "terminé" ? (
            <Box>
              {!hasUserMiniBet(minibet.id) ? (
                <Box
                  display="flex"
                  flexDirection="row"
                  flexWrap="wrap"
                  gap={1}
                  sx={{
                    marginTop: 2,
                    justifyContent: "space-between", // Ajoute un espacement équilibré entre les boutons
                  }}
                >
                  {minibet.odds.map((odd, idx) => (
                    <Button
                      key={idx}
                      variant="contained"
                      onClick={() =>
                        openMiniBetModal(minibet.id, odd.label, odd.value)
                      }
                      sx={{
                        flex: "1 1 calc(50% - 4px)", 
                        backgroundColor: "rgba(225, 191, 228, 255)",
                        padding: "5px",
                        boxSizing: "border-box", // Prend en compte le padding dans la largeur
                        maxWidth: "calc(50% - 4px)", // Empêche de dépasser deux boutons par ligne
                      }}
                    >
                      <Box
                        textAlign="center"
                        sx={{ display: "flex", flexDirection: "column" }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            display: "inline-block",
                            fontSize: "0.7rem",
                          }}
                        >
                          {odd.label}
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          {odd.value}
                        </Typography>
                      </Box>
                    </Button>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ marginTop: 2 }}>
                  Vous avez déjà parié sur ce match. Montant :{" "}
                  {getUserMiniBetAmount(minibet.id)} 🤙🏻
                </Typography>
              )}
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ marginTop: 1 }}>
              {minibet.bettingStatus === "terminé"
                ? "Le match est fini, découvre tes gains !"
                : "Les mises sont fermés pour ce pari flash."}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MiniBetCard;
