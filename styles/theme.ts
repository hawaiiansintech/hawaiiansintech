const theme = {
  color: {
    brand: {
      base: "#CB6A13",
      alpha: "#CB6A1333",
      alt: "#AD5A10",
      faded: "#cf8870",
    },
    link: { base: "#CB6A13", alt: "#AD5A10" },
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
      alt3: "#bda9a5",
      disabled: "#ddd",
      error: "rgba(227, 82, 58, 0.0625)",
      float: "#fff",
    },
  },
  elevation: {
    one: {
      brand: "rgba(252, 116, 66, 0.25) 0px 0px 0.5rem",
      desat: "rgba(0, 0, 0, 0.02) 0px 0rem 0.5rem",
    },
    two: {
      brand: "rgba(252, 116, 66, 0.25) 0px 0px 1rem",
      desat: "rgba(0, 0, 0, 0.04) 0px 0rem 1rem",
    },
  },
  borderRadius: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.25rem",
  },
  fontFamily: {
    base: `"Helvetica Now Display", "Helvetica Neue", "Helvetica"`,
    hackathon: "Permanent Marker",
  },
  layout: {
    width: {
      interior: "46rem",
    },
    breakPoints: {
      small: "40rem",
      medium: "60rem",
    },
    zIndex: {
      below: "100",
      center: "110",
      above: "120",
    },
  },
};
export default theme;
