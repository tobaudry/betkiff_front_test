import { useMemo } from "react";

const useCollectionData = (userData) => {
  return useMemo(() => {
    if (!userData || !userData.collection) {
      return [];
    }

    // Transforme la collection en une liste structurée
    const collection = userData.collection;
    return Object.keys(collection).map((cardTitle) => {
      const doublons = collection[cardTitle]?.doublon || 0;

      // Si l'utilisateur possède la carte, "doublons" doit être au moins 1
      return {
        title: cardTitle,
        doublons: doublons > 0 ? doublons : 1, // Si carte présente, au moins 1
      };
    });
  }, [userData]);
};

export default useCollectionData;
