import { useCallback } from "react";

const useFormattedDate = () => {
  const formatDate = useCallback((dateString, time) => {
    const matchDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (matchDate.toDateString() === today.toDateString()) {
      return time ? `Aujourd'hui à ${time}` : "Aujourd'hui";
    } else if (matchDate.toDateString() === tomorrow.toDateString()) {
      return time ? `Demain à ${time}` : "Demain";
    } else {
      const options = { year: "numeric", month: "short", day: "numeric" };
      const formattedDate = matchDate.toLocaleDateString("fr-FR", options);
      return time ? `${formattedDate} à ${time}` : formattedDate;
    }
  }, []);

  return formatDate;
};

export default useFormattedDate;
