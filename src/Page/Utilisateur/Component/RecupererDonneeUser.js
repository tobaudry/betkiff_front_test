import { useState, useEffect } from "react";

// Hook pour récupérer les données d'un utilisateur connecté
const useGetUserConnecteData = (uid) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération de l'idOrganisation depuis localStorage
  const idOrganisation = localStorage.getItem("idOrganisation");

  useEffect(() => {
    if (!uid || !idOrganisation) return; // Si l'UID ou idOrganisation est manquant, on ne fait rien.
    const handleFetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://backend-betkiff.vercel.app/users/ById/${uid}`,
          {
            method: "POST", // Changer en POST si idOrganisation est requis dans le backend
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idOrganisation }), // Passer idOrganisation dans le corps
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserData(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    handleFetchUser();
  }, [uid, idOrganisation]);

  return { userData, loading, error };
};

// Hook pour récupérer les données de tous les utilisateurs
const useGetUsers = () => {
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération de l'idOrganisation depuis localStorage
  const idOrganisation = localStorage.getItem("idOrganisation");

  useEffect(() => {
    if (!idOrganisation) return; // Si idOrganisation est manquant, on ne fait rien.

    const handleFetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://backend-betkiff.vercel.app/users`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idOrganisation }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsersData(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setUsersData(null);
      } finally {
        setLoading(false);
      }
    };

    handleFetchUsers();
  }, [idOrganisation]);

  return { usersData, loading, error };
};

export { useGetUserConnecteData, useGetUsers };
