import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

const generateToken = async () => {
  const uid = localStorage.getItem("userUid");
  const idOrganisation = localStorage.getItem("idOrganisation");

  if (!uid || !idOrganisation) {
    console.warn("Utilisateur non authentifié ou organisation non définie.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BGKhnyeuLH_hFO0RT7BD8IQViX_mQYu9LPE7S_wmpeQBDy7tXkdG1Ibvj5dHHAB8Xoz0A1e5J955MXTlnYrr_xU",
      });

      if (token) {
        console.log("Token FCM récupéré :", token);
        await saveUserFcmToken(token, uid, idOrganisation);
      } else {
        console.warn("Aucun token FCM généré.");
      }
    } else {
      console.warn("Permission de notification refusée.");
    }
  } catch (error) {
    console.error("Erreur lors de la génération du token FCM :", error);
  }
};

const saveUserFcmToken = async (token, userId, idOrganisation) => {
  try {
    const response = await fetch(
      "https://betkiff-back-test.vercel.app/users/saveToken",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, userId, idOrganisation }),
      }
    );

    const result = await response.text();
    console.log("Réponse serveur :", result);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du token FCM :", error);
  }
};

// Exposition des fonctions et instances Firebase
export { auth, googleProvider, analytics, messaging, generateToken };
