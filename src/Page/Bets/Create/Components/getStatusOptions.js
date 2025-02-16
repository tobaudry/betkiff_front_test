export const getStatusOptions = (sportCategory) => {
  switch (sportCategory) {
    case "football":
      return [
        { value: "à venir", label: "Pas encore commencé" },
        { value: "1ere-mitemps", label: "1ère mi-temps" },
        { value: "2eme-mitemps", label: "2ème mi-temps" },
        { value: "terminé", label: "Terminé" },
      ];
    case "rugby":
      return [
        { value: "pas encore", label: "Pas encore commencé" },
        { value: "1ere-mitemps", label: "1ère mi-temps" },
        { value: "2eme-mitemps", label: "2ème mi-temps" },
        { value: "terminé", label: "Terminé" },
      ];
    case "handball":
      return [
        { value: "pas encore", label: "Pas encore commencé" },
        { value: "1ere-mitemps", label: "1ère mi-temps" },
        { value: "2eme-mitemps", label: "2ème mi-temps" },
        { value: "terminé", label: "Terminé" },
      ];
    case "basketball":
      return [
        { value: "pas encore", label: "Pas encore commencé" },
        { value: "1er-quart-temps", label: "1er quart-temps" },
        { value: "2eme-quart-temps", label: "2ème quart-temps" },
        { value: "3eme-quart-temps", label: "3ème quart-temps" },
        { value: "4eme-quart-temps", label: "4ème quart-temps" },
        { value: "terminé", label: "Terminé" },
      ];
    case "coinche":
      return [
        { value: "pas encore", label: "Pas encore commencé" },
        { value: "terminé", label: "Terminé" },
      ];
    case "volley":
      return [
        { value: "pas encore", label: "Pas encore commencé" },
        { value: "1er-set", label: "1er set" },
        { value: "2eme-set", label: "2ème set" },
        { value: "terminé", label: "Terminé" },
      ];
    default:
      return [
        { value: "pas encore", label: "Pas encore commencé" },
        { value: "terminé", label: "Terminé" },
      ];
  }
};
