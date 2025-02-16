import { getToken } from "firebase/messaging";
import { messaging } from "../Services/Firebase";

const saveUserFcmToken = async (userId, idOrganisation) => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BGKhnyeuLH_hFO0RT7BD8IQViX_mQYu9LPE7S_wmpeQBDy7tXkdG1Ibvj5dHHAB8Xoz0A1e5J955MXTlnYrr_xU", // Remplace par ta clé VAPID
    });
    console.log("Token FCM :", token);

    if (!token) {
      console.error("Impossible d'obtenir un token FCM.");
      return;
    }

    const response = await fetch(
      "https://betkiff-back-test.vercel.app/users/saveToken",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          token,
          userId,
          idOrganisation,
        }),
      }
    );

    const result = await response.text();
    console.log("Réponse serveur :", result);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du token FCM :", error);
  }
};

export default saveUserFcmToken;
