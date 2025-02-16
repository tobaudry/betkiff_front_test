import React, { useState, useEffect } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import LogoutIcon from "@mui/icons-material/Logout";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import Paper from "@mui/material/Paper";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Services/Firebase"; // Assurez-vous que ce chemin est correct
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useUser } from "../Services/ContexteUser";

export default function BottomNavBar() {
  const [value, setValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Utilisez useLocation pour obtenir l'URL actuelle
  const { logout } = useUser(); // Utilisez logout à la place de setUser

  useEffect(() => {
    if (location.pathname === "/") {
      setValue(0); // Page d'accueil
    } else if (location.pathname === "/userlist") {
      setValue(1); // Page Classement
    } else if (location.pathname === "/collection") {
      setValue(2); // Page Collection
    }
  }, [location]); // Le useEffect se déclenche à chaque changement de l'URL

  const handleNavigation = (route) => {
    navigate(route); // Redirige l'utilisateur vers la route spécifiée
  };

  const handleSignOut = async () => {
    try {
      // Supprimer le token du localStorage pour s'assurer que l'utilisateur est bien déconnecté
      localStorage.removeItem("authToken");

      // Déconnexion de Firebase
      await signOut(auth);
      logout();
      // Rediriger vers la page de connexion
      navigate("/connexion");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    }
  };

  // Fonction pour ouvrir le dialogue de confirmation
  const openConfirmationDialog = () => {
    setOpenDialog(true);
  };

  // Fonction pour fermer le dialogue sans effectuer la déconnexion
  const closeConfirmationDialog = () => {
    setOpenDialog(false);
  };

  // Fonction pour confirmer la déconnexion
  const confirmSignOut = () => {
    setOpenDialog(false); // Fermer le dialogue
    handleSignOut(); // Appeler la fonction de déconnexion
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
      }}
      elevation={3}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        showLabels>
        <BottomNavigationAction
          label="Parier"
          icon={<WhatshotIcon />}
          onClick={() => handleNavigation("/")}
          sx={{
            color: "gray",
            "&.Mui-selected": { color: "rgba(90, 20, 121, 254)" },
            transition: "color 0.3s",
          }}
        />
        <BottomNavigationAction
          label="Classement"
          icon={<EmojiEventsIcon />}
          onClick={() => handleNavigation("/userlist")}
          sx={{
            color: "gray",
            "&.Mui-selected": { color: "rgba(90, 20, 121, 254)" },
            transition: "color 0.3s",
          }}
        />
        <BottomNavigationAction
          label="Collection"
          icon={<ViewCarouselIcon />}
          onClick={() => handleNavigation("/collection")}
          sx={{
            color: "gray",
            "&.Mui-selected": { color: "rgba(90, 20, 121, 254)" },
            transition: "color 0.3s",
          }}
        />
        <BottomNavigationAction
          label="Quitter"
          icon={<LogoutIcon />}
          onClick={openConfirmationDialog}
          sx={{
            color: "red",
            transition: "color 0.3s",
          }}
        />
      </BottomNavigation>

      {/* Dialogue de confirmation */}
      <Dialog open={openDialog} onClose={closeConfirmationDialog}>
        <DialogTitle>
          {"Êtes-vous sûr de vouloir vous déconnecter ?"}
        </DialogTitle>
        <DialogContent>
          <p>
            Vous allez être déconnecté et redirigé vers la page de connexion.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmSignOut} color="secondary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
