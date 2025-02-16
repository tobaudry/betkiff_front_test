import React from "react";
import "../../../Styles/FlashAnimation.css";
import { ReactComponent as FlashSVG } from "../SVG/outlined_flash.svg"; // SVG contour d'éclair

const FlashAnimation = () => {
  return (
    <div className="flash-container active">
      <FlashSVG className="flash-svg infinite" />
    </div>
  );
};

export default FlashAnimation;
