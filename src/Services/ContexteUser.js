import React, { createContext, useState, useContext, useEffect } from "react";
import { useGetUserConnecteData } from "../Page/Utilisateur/Component/RecupererDonneeUser";

// Créer le contexte utilisateur
const UserContext = createContext();

// Provider pour encapsuler ton application et fournir le contexte utilisateur
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // Ajout de l'état pour les données utilisateur

  const uid = localStorage.getItem("userUid");
  console.log("uid", uid);
  const uData = useGetUserConnecteData(uid); // Récupération des données utilisateur depuis Firebase
  const userDataFromApi = uData.userData;

  useEffect(() => {
    if (userDataFromApi) {
      setUserData(userDataFromApi);
    }
  }, [userDataFromApi]);

  const updateMonnaie = (newMonnaie) => {
    setUserData((prevData) => ({ ...prevData, nbMonnaie: newMonnaie }));
  };

  const login = (token, uid) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userUid", uid);
    setUser({ token, uid });
  };

  const logout = () => {
    // Supprimer les données de connexion du localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userUid"); // Supprimer explicitement le uid
    setUser(null); // Réinitialiser l'utilisateur
    setUserData(null); // Réinitialiser les données utilisateur
  };

  return (
    <UserContext.Provider
      value={{ user, userData, login, logout, updateMonnaie }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook pour accéder au contexte utilisateur
export const useUser = () => useContext(UserContext);
