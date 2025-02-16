import React from "react";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsRugbyIcon from "@mui/icons-material/SportsRugby";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";
import StyleIcon from "@mui/icons-material/Style";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";

const useSportIcon = () => {
  const getSportIcon = (sportCategory) => {
    const iconProps = {
      sx: { color: "rgba(225, 191, 228, 255)", marginLeft: 1 },
    };

    switch (sportCategory) {
      case "basketball":
        return <SportsBasketballIcon {...iconProps} />;
      case "football":
        return <SportsSoccerIcon {...iconProps} />;
      case "rugby":
        return <SportsRugbyIcon {...iconProps} />;
      case "volley":
        return <SportsVolleyballIcon {...iconProps} />;
      case "spikeball":
        return <SportsBaseballIcon {...iconProps} />;
      case "handball":
        return <SportsHandballIcon {...iconProps} />;
      default:
        return <StyleIcon {...iconProps} />;
    }
  };

  return getSportIcon;
};

export default useSportIcon;
