import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getMessaging,onMessage, getToken } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission)
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BGKhnyeuLH_hFO0RT7BD8IQViX_mQYu9LPE7S_wmpeQBDy7tXkdG1Ibvj5dHHAB8Xoz0A1e5J955MXTlnYrr_xU",
    });
    console.log("toke",token)
  }
}
export { auth, googleProvider, analytics, messaging,generateToken };
