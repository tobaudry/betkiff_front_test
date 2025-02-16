import React, { useState, useEffect, useRef } from "react";
import { keyframes } from "@mui/system";
import { Box, Typography, List } from "@mui/material";
import UserCard from "../../../Components/userCard";
import { useGetUsers } from "../../Utilisateur/Component/RecupererDonneeUser";
import UserDialog from "../../../Components/userDialog";
import { useUser } from "../../../Services/ContexteUser";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import KeyboardDoubleArrowUpOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowUpOutlined";

export default function UsersList() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const userRefs = useRef({}); // Références pour le scroll

  const dataUser = useUser();
  const usersD = useGetUsers();
  const usersData = usersD.usersData;

  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (dataUser?.userData?.statusUser) {
      setIsAdmin(dataUser.userData.statusUser === "admin");
    }
  }, [dataUser]);

  useEffect(() => {
    if (usersData) {
      const usersArray = Object.values(usersData).sort(
        (a, b) => (b.nbMonnaie || 0) - (a.nbMonnaie || 0)
      );

      setUsers(usersArray);
    }
  }, [usersData]);

  const currentUser = dataUser?.userData;
  const userRanking =
    users.findIndex((user) => user.idUser === currentUser?.idUser) + 1;
  const isInTop3 = userRanking > 0 && userRanking <= 3;

  // Fonction pour scroller à la position de l'utilisateur
  const scrollToMyRanking = () => {
    if (userRanking && userRefs.current[userRanking - 1]) {
      userRefs.current[userRanking - 1].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const flicker = keyframes`
  0% { opacity: 0.1; transform: scale(0.90); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.1; transform: scale(0.90); }
`;

  const flicker2 = keyframes`
0% { opacity: 1; transform: scale(0.90); }
50% { opacity: 0.1; transform: scale(1); }
100% { opacity: 1; transform: scale(0.90); }
`;

  return (
    <Box sx={{ paddingTop: 30, position: "relative" }}>
      <Box sx={{ padding: 4 }}>
        {/* Podium */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 0,
            marginBottom: 4,
          }}>
          {/* Couronne au-dessus du premier du classement */}
          {users[0] && (
            <EmojiEventsOutlinedIcon
              sx={{
                position: "absolute",
                top: 155, // Positionnement au-dessus
                left: "50%",
                transform: "translateX(-50%)", // Centrage horizontal
                fontSize: "4rem", // Taille de l'icône
                color: "gold", // Couleur dorée
                zIndex: "1000",
              }}
            />
          )}
          {users[0] && (
            <EmojiEventsIcon
              sx={{
                position: "absolute",
                top: 155, // Positionnement au-dessus
                left: "50%",
                transform: "translateX(-50%)", // Centrage horizontal
                fontSize: "4rem", // Taille de l'icône
                color: "rgba(90, 20, 121, 0.4)", // Couleur dorée
              }}
            />
          )}
          {/* Effet scintillant */}
          {users[0] && (
            <AutoAwesomeOutlinedIcon
              sx={{
                position: "absolute",
                top: 135, // Positionnement au-dessus
                left: "52%",
                transform: "translateX(-50%) scaleX(-1)",
                fontSize: "2rem",
                color: "gold",
                animation: `${flicker} 1.5s infinite alternate`,
              }}
            />
          )}
          {users[0] && (
            <Box
              sx={{
                position: "absolute",
                top: 190, // Positionnement au-dessus
                left: "43%",
                transform: "translateX(-50%) rotateY(180deg)",
              }}>
              <AutoAwesomeOutlinedIcon
                sx={{
                  fontSize: "1.4rem",
                  color: "gold",
                  animation: `${flicker2} 2s infinite alternate`,
                }}
              />
            </Box>
          )}
          {[1, 0, 2].map((index) =>
            users[index] ? (
              <Box
                key={users[index].id}
                sx={{
                  position: "relative", // Permet de positionner l’ombre en absolute par rapport à cette Box
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height:
                    index === 0 ? "240px" : index === 1 ? "200px" : "160px",
                  width: "200px",
                }}
                onClick={() => isAdmin && handleOpenDialog(users[index])}>
                {/* Ombre en arrière-plan */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "100%", // Placé au-dessus
                    width: "115%", // Largeur légèrement plus grande
                    height: "40px", // Hauteur du trapèze
                    background:
                      index === 0
                        ? "rgba(90, 20, 121, 0.4)"
                        : index === 1
                          ? "rgba(90, 20, 121, 0.3)"
                          : "rgba(90, 20, 121, 0.2)",
                    zIndex: 0, // En arrière-plan

                    // Clip-path dynamique selon l'index
                    clipPath:
                      index === 0
                        ? "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)" // Deux bords du haut rapprochés
                        : index === 1
                          ? "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" // Seulement le bord gauche rapproché
                          : "polygon(0% 0%, 80% 0%, 100% 100%, 0% 100%)", // Seulement le bord droit rapproché
                  }}
                />

                {/* Box Principale */}
                <Box
                  sx={{
                    position: "relative", // Pour être au-dessus de l’ombre
                    zIndex: 1000, // S'assurer qu'elle est au-dessus de l'ombre
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                    width: "100%",
                    background:
                      index === 0
                        ? "rgba(90, 20, 121)"
                        : index === 1
                          ? "rgba(90, 20, 121, 0.9)"
                          : "rgba(90, 20, 121, 0.7)",
                    borderRadius:
                      index === 0
                        ? "0px 0px 0px 0px"
                        : index === 1
                          ? "0px 0px 0px 8px"
                          : "0px 0px 8px 0px",
                    padding: 1,
                  }}>
                  {/* Texte et informations */}
                  <Typography
                    variant="h3"
                    sx={{
                      color: "#de91e5",
                      fontWeight: "bold",
                      fontSize: "4rem",
                      paddingBottom: index === 0 ? 12 : index === 1 ? 7 : 3,
                    }}>
                    {index + 1}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      color: "#de91e5",
                      fontWeight: "bold",
                    }}>
                    🤙🏻 {users[index].nbMonnaie}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "center",
                      color: "#de91e5",
                      fontWeight: "bold",
                    }}>
                    {users[index].nomUser}
                  </Typography>
                </Box>
              </Box>
            ) : null
          )}
        </Box>
        {/* Section de l'utilisateur connecté (hors top 3) */}
        {!isInTop3 && currentUser && (
          <Box
            onClick={scrollToMyRanking}
            sx={{
              background: "rgba(90, 20, 121, 0.5)",
              marginBottom: 2,
              padding: 2,
              borderRadius: "10px",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#ececec" },
              display: "flex",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}>
            {/* Contenu principal */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between", // Espacement uniforme
                alignItems: "center", // Alignement vertical centré
                flexGrow: 1,
                zIndex: 1,
                width: "100%", // Assurer que la Box prend toute la largeur dispo
              }}>
              {/* Classement */}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: "#de91e5",
                  whiteSpace: "nowrap",
                }}>
                Place : {userRanking}
              </Typography>

              {/* Nom d'utilisateur */}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "#de91e5",
                  textAlign: "center", // Centrage du texte
                  flexGrow: 1, // Permet au texte de s'étendre sans casser la mise en page
                  margin: "0 20px", // Ajoute un espacement des deux côtés
                }}>
                {currentUser.nomUser.length > 12
                  ? `${currentUser.nomUser.slice(0, 12)}...`
                  : currentUser.nomUser}
              </Typography>

              {/* Nombre de monnaies */}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: "#de91e5",
                  whiteSpace: "nowrap",
                }}>
                🤙🏻 {currentUser.nbMonnaie}
              </Typography>
            </Box>
          </Box>
        )}
        {/* Liste des utilisateurs (hors top 3) */}
        <List sx={{ paddingBottom: 5 }}>
          {users.slice(3).map((user, index) => (
            <Box key={user.id} ref={(el) => (userRefs.current[index + 3] = el)}>
              <UserCard
                user={user}
                onClick={() => isAdmin && handleOpenDialog(user)}
                index={index + 3}
              />
            </Box>
          ))}
        </List>
      </Box>

      {showScrollButton && (
        <Box
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            zIndex: "3000",
            bottom: 80,
            right: 20,
            backgroundColor: "whitesmoke",
            color: "rgba(90, 20, 121)",
            width: 50,
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            // border: "1px solid rgba(90, 20, 121)",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            cursor: "pointer",
          }}>
          <KeyboardDoubleArrowUpOutlinedIcon />
        </Box>
      )}

      {/* Dialog utilisateur */}
      {selectedUser && (
        <UserDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          user={selectedUser}
          setUsers={setUsers}
        />
      )}
    </Box>
  );
}
