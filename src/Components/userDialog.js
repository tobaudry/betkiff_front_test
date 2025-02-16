import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useUser } from "../Services/ContexteUser";

export default function UserDialog({ open, onClose, user, setUsers }) {
  const { updateMonnaie } = useUser();
  const idOrganisation = localStorage.getItem("idOrganisation");
  const uid = localStorage.getItem("userUid");

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cet utilisateur ?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `https://betkiff-back-test.vercel.app/users/deleteUsers/${user.idUser}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idOrganisation }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erreur lors de la suppression.");
        }

        alert("Utilisateur supprimé avec succès.");
        setUsers((prevUsers) =>
          prevUsers.filter((u) => u.idUser !== user.idUser)
        );
        onClose();
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert(error.message || "Une erreur est survenue.");
      }
    }
  };

  const handleUpdateKiff = async () => {
    let newKiff = prompt("Entrez le nouveau nombre de kiff :", user.nbMonnaie);
    while (isNaN(newKiff) || newKiff === "" || newKiff === null) {
      newKiff = prompt(
        "Veuillez entrer un nombre valide pour le nouveau nombre de kiff :"
      );
    }

    // Convertir en nombre si nécessaire
    newKiff = Number(newKiff);
    if (newKiff !== null) {
      try {
        const updateResponse = await fetch(
          "https://betkiff-back-test.vercel.app/users/updateMonnaie",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.idUser,
              newMoney: newKiff,
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
        if (uid === user.idUser) {
          updateMonnaie(newKiff);
        }

        const updateResult = await updateResponse.json();
        console.log("Monnaie mise à jour avec succès :", updateResult);
      } catch (error) {
        console.error("Erreur lors de la mise à jour des kiffs :", error);
      }
    }
  };

  const handleUpdateStatus = async () => {
    const newStatus = prompt(
      "Entrez le nouveau status (admin/utilisateur) :",
      user.StatusUser
    );
    if (
      newStatus !== null &&
      (newStatus === "admin" || newStatus === "utilisateur")
    ) {
      try {
        const response = await fetch(
          "https://betkiff-back-test.vercel.app/users/updateStatus",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idUser: user.idUser,
              newStatus: newStatus,
              idOrganisation,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.idUser === user.idUser ? { ...u, StatusUser: newStatus } : u
            )
          );
          alert(data.message); // Affiche un message de succès
        } else {
          alert(data.message); // Affiche un message d'erreur
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut :", error);
        alert("Une erreur est survenue");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {/* Remplacement du titre par une croix pour fermer */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", padding: 1 }}>
        <IconButton
          onClick={onClose}
          aria-label="fermer"
          sx={{ position: "absolute", top: 0, right: 0 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginBottom: 2,
          }}>
          {/* Avatar centré et plus grand avec initiale agrandie */}
          <Avatar
            sx={{
              backgroundColor: "rgba(90,20,121,254)",
              width: 120,
              height: 120,
              fontSize: 50,
              marginBottom: 2,
              boxShadow: 3,
            }}>
            {user.nomUser.charAt(0).toUpperCase()}
          </Avatar>
          {/* Pseudo à gauche et Kiffs à droite */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: 1,
            }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", flexGrow: 1 }}>
              {user.nomUser}
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#606060", marginLeft: "auto" }}>
              Kiff: {user.nbMonnaie}
            </Typography>
          </Box>
          {/* Statut juste en dessous du pseudo */}
          <Typography
            variant="body2"
            sx={{ color: "#707070", alignSelf: "flex-start", marginBottom: 2 }}>
            {user.StatusUser}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 1,
          padding: 2,
        }}>
        {/* Boutons verticaux */}
        <Button
          variant="outlined"
          startIcon={
            <MonetizationOnIcon sx={{ color: "rgba(90,20,121,254)" }} />
          }
          onClick={handleUpdateKiff}
          sx={{
            justifyContent: "flex-start",
            color: "rgba(90,20,121,254)",
            borderColor: "rgba(90,20,121,254)",
            width: "100%",
          }}>
          Modifier Kiff
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon sx={{ color: "rgba(90,20,121,254)" }} />}
          onClick={handleUpdateStatus}
          sx={{
            justifyContent: "flex-start",
            color: "rgba(90,20,121,254)",
            borderColor: "rgba(90,20,121,254)",
            width: "100%",
          }}>
          Modifier Status
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          sx={{
            width: "100%",
            justifyContent: "flex-start",
          }}>
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
