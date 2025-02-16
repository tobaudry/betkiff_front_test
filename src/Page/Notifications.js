import React, { useState, useEffect } from "react";
import saveUserFcmToken from "./notificationService";

const NotificationPermissionPage = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const uid = localStorage.getItem("userUid");
  const idOrganisation = localStorage.getItem("idOrganisation");

  useEffect(() => {
    // Vérifie si l'utilisateur a déjà accordé la permission
    if (Notification.permission === "granted") {
      setPermissionGranted(true);
    }
  }, []);

  const handleRequestPermission = async () => {
    setLoading(true);
    setError(null);
    setMessage("");

    try {
      // Demander la permission pour envoyer des notifications
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPermissionGranted(true);

        // Récupérer le token FCM et l'envoyer au backend
        await saveUserFcmToken(uid, idOrganisation);
        setMessage("Notifications activées et token enregistré avec succès !");
      } else {
        setMessage("Permission de notifications refusée.");
      }
    } catch (error) {
      setError(
        "Une erreur est survenue lors de l'activation des notifications."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Activez les notifications</h1>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!permissionGranted ? (
        <>
          <p>
            Pour recevoir des notifications, veuillez activer les notifications.
          </p>
          <button onClick={handleRequestPermission} disabled={loading}>
            {loading ? "Chargement..." : "Activer les Notifications"}
          </button>
        </>
      ) : (
        <p>Les notifications sont activées ! 🎉</p>
      )}
    </div>
  );
};

export default NotificationPermissionPage;
