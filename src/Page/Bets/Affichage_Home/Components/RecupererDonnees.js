import { useEffect, useState } from "react";

const useGetBets = () => {
  const idOrganisation = localStorage.getItem("idOrganisation");
  const [bets, setBets] = useState([]);
  // eslint-disable-next-line
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleFetchBets = async () => {
      try {
        const response = await fetch(
          "https://backend-betkiff.vercel.app/bets/getBets",
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
        const dataBet = await response.json();

        // Transformer l'objet en tableau
        const formattedData = Object.entries(dataBet).map(([key, value]) => ({
          id: key,
          ...value,
        }));

        setBets(formattedData);
      } catch (error) {
        setMessage(`Erreur = ${error.message}`);
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    handleFetchBets();
  }, [idOrganisation]);

  return bets;
};

const useGetMiniBets = () => {
  const idOrganisation = localStorage.getItem("idOrganisation");
  const [miniBets, setMiniBets] = useState([]);
  // eslint-disable-next-line
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleFetchBets = async () => {
      try {
        const response = await fetch(
          "https://backend-betkiff.vercel.app/bets/getMiniBets",
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
        const dataBet = await response.json();

        // Transformer l'objet en tableau
        const formattedData = Object.entries(dataBet).map(([key, value]) => ({
          id: key,
          ...value,
        }));

        setMiniBets(formattedData);
      } catch (error) {
        setMessage(`Erreur = ${error.message}`);
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    handleFetchBets();
  }, [idOrganisation]);

  return miniBets;
};

const useGetFlash = () => {
  const idOrganisation = localStorage.getItem("idOrganisation");
  const [flash, setFlash] = useState([]);
  // eslint-disable-next-line
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleFetchBets = async () => {
      try {
        const response = await fetch(
          "https://backend-betkiff.vercel.app/bets/getFlash",
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
        const dataBet = await response.json();

        // Transformer l'objet en tableau
        const formattedData = Object.entries(dataBet).map(([key, value]) => ({
          id: key,
          ...value,
        }));

        setFlash(formattedData);
      } catch (error) {
        setMessage(`Erreur = ${error.message}`);
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    handleFetchBets();
  }, [idOrganisation]);

  return flash;
};

export { useGetBets, useGetMiniBets, useGetFlash };
