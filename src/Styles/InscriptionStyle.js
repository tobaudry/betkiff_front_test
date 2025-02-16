export const containerStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
  maxWidth: "xs",
};

export const imageStyle = {
  width: "250px",
  height: "auto",
};

export const titleStyle = {
  fontSize: "1.3rem",
  fontWeight: "bold",
  fontFamily: "Arial, sans-serif",
  color: "rgba(90,20,121,254)",
};

export const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgba(90,20,121,254)" },
    "&:hover fieldset": { borderColor: "rgba(90,20,121,254)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(90,20,121,254)" },
  },
  "& .MuiInputBase-input": { color: "rgba(90,20,121,254)" },
  "& .MuiInputLabel-root": { color: "rgba(90,20,121,254)" },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "rgba(90,20,121,254)",
  },
};

export const submitButtonStyle = {
  mb: 2,
  backgroundColor: "rgba(90,20,121,254)",
  color: "white",
  "&:hover": { backgroundColor: "darkviolet" },
};

export const outlinedButtonStyle = {
  borderColor: "rgba(90,20,121,254)",
  color: "rgba(90,20,121,254)",
  "&:hover": {
    borderColor: "darkviolet",
    backgroundColor: "lightrgba(90,20,121,254)",
  },
};

export const footerStyle = {
  position: "absolute",
  bottom: "10px",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
};

export const footerTextStyle = {
  color: "black",
  mr: 1,
};
