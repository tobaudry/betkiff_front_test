import React from "react";
// import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";

export default function Filtre({ onFilterChange }) {
  const [selected, setSelected] = React.useState("Tous");
  const radioRefs = React.useRef({});

  const handleSelection = (name) => {
    setSelected(name);
    onFilterChange(name);

    // Centrer l'élément sélectionné
    if (radioRefs.current[name]) {
      radioRefs.current[name].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto", // Permet le défilement horizontal
        whiteSpace: "nowrap",
        mt: 9,
        pl: 3,
        pr: 3,
        position: "relative",
      }}
    >
      <RadioGroup
        name="filter-bets"
        aria-labelledby="filter-bets"
        orientation="horizontal"
        sx={{
          display: "flex",

          gap: 1.5,
        }}
      >
        {["Tous", "En cours", "À venir", "Terminé"].map((name) => {
          const checked = selected === name;
          return (
            <Chip
              variant="outlined"
              color="secondary"
              sx={{
                transition: "all 0.3s ease-in-out",
                backgroundColor: checked
                  ? "rgba(90, 20, 121, 0.9)"
                  : "transparent",
                color: "white",
                borderRadius: "20px",
                cursor: "pointer",
                border: checked ? "none" : "1px solid rgba(90, 20, 121, 0.9)",
              }}
              ref={(el) => (radioRefs.current[name] = el)}
            >
              <Radio
                sx={{
                  fontSize: "1.1rem",
                  // color: checked ? "white" : "rgba(90, 20, 121, 0.9)",
                  color: "white",
                  padding: "10px 15px",

                  // fontWeight: "bold",
                }}
                disableIcon
                overlay
                label={name}
                value={name}
                checked={checked}
                onChange={(event) => {
                  if (event.target.checked) {
                    handleSelection(name);
                  }
                }}
              />
            </Chip>
          );
        })}
      </RadioGroup>
    </Box>
  );
}
