import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import football from "../Images/football1.jpeg";

const BetCard = ({
  bet,
  hasUserBet,
  openBetModal,
  getSportIcon,
  formatDate,
  renderSettingsIcon,
  getUserBetAmount,
}) => {
  return (
    <Card
      sx={{
        elevation: 4,
        borderRadius: "20px",
        marginBottom: "20px",
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
            {getSportIcon(bet.sportCategory)}
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {formatDate(bet.date, bet.time)}
          </Typography>
          {renderSettingsIcon(bet.id, "normal")}
        </Box>

        
        <img
          src={football}
          alt="BetKiff Logo"
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
          }}
        />

        <Box sx={{ margin: "20px 20px 0px 20px" }}>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              color: "rgba(90,20,121,254)",
              fontWeight: "bold",
              lineHeight: 1,
            }}
          >
            {bet.team1} - {bet.team2}
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            {bet.matchStatus === "pas encore"
              ? `Début du match à ${bet.time}`
              : `${bet.matchStatus ?? "N/A"}`}
            {bet.matchStatus !== "pas encore"
              ? ` | Score : ${bet.score.team1 ?? "N/A"} - ${
                  bet.score.team2 ?? "N/A"
                }`
              : ""}
          </Typography>

          <Grid container spacing={2} sx={{ marginTop: 0.5 }}>
            <Grid item xs={12} sm={6}>
              {bet.bettingOpen ? (
                !hasUserBet(bet.id) ? (
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      sx={{ gap: 1 }}
                    >
                      {/* Boutons pour parier */}
                      <Button
                        variant="contained"
                        onClick={() =>
                          openBetModal(bet.id, "winTeam1", bet.odds.winTeam1)
                        }
                        sx={{
                          flex: 1,

                          backgroundColor: "rgba(90, 20, 121, 254)",
                          padding: "0",
                        }}
                        aria-label={`Parier sur ${bet.team1}`}
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
                              maxWidth: "9ch",
                              fontSize: "0.7rem",
                            }}
                          >
                            {bet.team1}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            {bet.odds.winTeam1}
                          </Typography>
                        </Box>
                      </Button>

                      <Button
                        variant="contained"
                        onClick={() =>
                          openBetModal(bet.id, "draw", bet.odds.draw)
                        }
                        sx={{
                          flex: 1,

                          backgroundColor: "rgba(90, 20, 121, 254)",
                          padding: "0",
                        }}
                        aria-label={`Parier sur égalité`}
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
                              width: "max-content", // Pour limiter à une largeur dynamique
                              display: "inline-block",
                              maxWidth: "9ch", // Limite la largeur à environ 5 caractères
                              fontSize: "0.7rem",
                            }}
                          >
                            égalité
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            {bet.odds.draw}
                          </Typography>
                        </Box>
                      </Button>

                      <Button
                        variant="contained"
                        onClick={() =>
                          openBetModal(bet.id, "winTeam2", bet.odds.winTeam2)
                        }
                        sx={{
                          flex: 1,
                          // backgroundColor: "rgba(225, 191, 228, 255)",
                          backgroundColor: "rgba(90, 20, 121, 254)",
                          padding: "3px 5px",
                        }}
                        aria-label={`Parier sur ${bet.team2}`}
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
                              width: "max-content", // Pour limiter à une largeur dynamique
                              display: "inline-block",
                              maxWidth: "9ch", // Limite la largeur à environ 5 caractères
                              fontSize: "0.7rem",
                            }}
                          >
                            {bet.team2}
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            {bet.odds.winTeam2}
                          </Typography>
                        </Box>
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    Vous avez déjà parié sur ce match. Montant :{" "}
                    {getUserBetAmount(bet.id)} 🤙🏻
                  </Typography>
                )
              ) : bet.matchStatus === "terminé" ? (
                <Typography color="text.secondary">
                  Le match est fini, découvre tes gains !
                </Typography>
              ) : (
                <Typography color="text.secondary">
                  Les mises sont fermées pour ce match.
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BetCard;
