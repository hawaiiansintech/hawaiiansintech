const theme = {
  color: {
    brand: {
      base: "#fc7442",
      alpha: "#fc744233",
      alt: "#ec4427",
      alt2: "#db4126",
      faded: "#cf8870",
      gradient: `linear-gradient(to top right, #fc7442, #ec4427)`,
    },
    link: { base: "#fc7442", alt: "#ec4427" },
    text: {
      base: "#373332",
      alt: "#585150",
      alt2: "#847876",
      alt3: "#9f8986",
      error: "#e3523a",
      overlay: { base: "#fff", alt: "#ffffffdd", alt2: "#ffffffaa" },
    },
    border: {
      base: "#dacbc8",
      alt: "#bda9a5",
      alt2: "#ac9a97",
      alt3: "#978a88",
    },
    background: {
      base: "#e5e5e5",
      alt: "#dacbc8",
      alt2: "#c9b5b1",
      disabled: "#ddd",
      error: "rgba(227, 82, 58, 0.0625)",
      float: "#fff",
    },
  },
  elevation: {
    one: {
      brand: "rgba(252, 116, 66, 0.5) 0px 0px 0.5rem",
      desat: "rgba(0, 0, 0, 0.5) 0px 0px 0.5rem",
    },
    two: {
      brand: "rgba(252, 116, 66, 0.5) 0px 0px 1rem",
      desat: "rgba(0, 0, 0, 0.5) 0px 0px 1rem",
    },
  },
  borderRadius: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.25rem",
  },
  layout: {
    width: {
      interior: "42rem",
    },
    breakPoints: {
      small: "48rem",
    },
  },
};
export default theme;
