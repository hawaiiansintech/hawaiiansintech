import css from "styled-jsx/css";
import theme from "./theme";

export default css.global`
  :root {
    --color-brand: ${theme.color.brand.base};
    --color-brand-alpha: ${theme.color.brand.alpha};
    --color-brand-alt: ${theme.color.brand.alt};
    --color-brand-faded: ${theme.color.brand.faded};
    --color-link: ${theme.color.link.base};
    --color-link-alt: ${theme.color.link.alt};
    --color-text: ${theme.color.text.base};
    --color-text-alt: ${theme.color.text.alt};
    --color-text-alt-2: ${theme.color.text.alt2};
    --color-text-alt-3: ${theme.color.text.alt3};
    --color-text-error: ${theme.color.text.error};
    --color-text-overlay: ${theme.color.text.overlay.base};
    --color-text-overlay-alt: ${theme.color.text.overlay.alt};
    --color-text-overlay-alt-2: ${theme.color.text.overlay.alt2};
    --color-border: ${theme.color.border.base};
    --color-border-alt: ${theme.color.border.alt};
    --color-border-alt-2: ${theme.color.border.alt2};
    --color-border-alt-3: ${theme.color.border.alt3};
    --color-background: ${theme.color.background.base};
    --color-background-alt: ${theme.color.background.alt};
    --color-background-alt-2: ${theme.color.background.alt2};
    --color-background-error: ${theme.color.background.error};
    --color-background-float: ${theme.color.background.float};

    --border-radius-x-small: ${theme.borderRadius.xs};
    --border-radius-small: ${theme.borderRadius.sm};
    --border-radius-medium: ${theme.borderRadius.md};
    --border-radius-large: ${theme.borderRadius.lg};

    --width-page-interior: ${theme.layout.width.interior};
    --width-resp-small: ${theme.layout.breakPoints.small};
  }

  @import url("https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap");

  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    font-family: ${theme.fontFamily.base};
    background: ${theme.color.background.base};
    color: ${theme.color.text.base};
    font-weight: 500;
    margin: 0;
    padding: 0;
  }

  .container {
    position: relative;
    margin: 3rem auto;
    padding: 0 2rem;
  }

  a {
    text-decoration: none;
    color: ${theme.color.link.base};
  }

  a:hover {
    color: ${theme.color.link.alt};
  }

  /* Animations
  ----------------------------- */

  @keyframes spin {
    to {
      -webkit-transform: rotate(360deg);
    }
  }

  /* Type 
 ----------------------------- */

  h1,
  .f1 {
    font-size: 5.625rem;
    letter-spacing: -0.03em;
    line-height: 100%;
    font-weight: 500;
    font-feature-settings: "ss08" on, "ss01" on, "salt" on, "cpsp" on;
  }
  h2 {
    font-size: 3.2rem;
    letter-spacing: -0.03em;
    line-height: 100%;
    font-weight: 500;
    font-feature-settings: "ss08" on, "ss01" on, "salt" on, "cpsp" on;
  }

  /* Utils 
 ----------------------------- */
  .m0 {
    margin: 0;
  }
  .p0 {
    padding: 0;
  }

  /* Table 
 ----------------------------- */
  table {
    width: 100%;
  }

  table tbody td,
  table thead td {
    border: none;
    border-bottom: 1px solid ${theme.color.border.base};
  }

  table.large thead {
    font-size: 1rem;
  }

  table.large tbody {
    font-size: 1.7rem;
  }

  table tbody tr {
    cursor: pointer;
    transition: background 150ms ease-in-out;
  }

  table tbody tr:hover {
    color: ${theme.color.link.base};
  }

  /* Rethink is the best aproch */
  table thead td {
    padding-bottom: 0.8em;
  }

  table tbody td {
    padding-bottom: 0.6em;
    padding-top: 0.6em;
  }

  table tbody tr:last-child td {
    border-bottom: none;
  }

  /* General 
 ----------------------------- */

  .letter {
    display: inline-block;
  }

  .auxNav {
    position: absolute;
    top: 0;
  }

  .extend span {
    display: inline-block;
  }

  .tileArtist {
    margin: 0;
    padding: 0;
    padding-top: 26vh;
  }

  .arrowback {
    color: ${theme.color.text.base};
    font-size: 3rem;
    text-decoration: none;
    cursor: pointer;
    overflow: hidden;
    transition: transform 200ms ease;
  }

  .arrowback:hover {
    transform: rotate(35deg);
  }

  a.link {
    --color: ${theme.color.text.base};
    position: relative;
    color: var(--color);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    transition: color 150ms ease;
  }

  p a.link {
    display: inline-block;
    vertical-align: text-bottom;
  }

  a.link:before {
    width: 100%;
    height: 90%;
    content: "";
    position: absolute;
    background-size: 1px 1em;
    background-size: 1px 1em;
    box-shadow: inset 0 -0.05em var(--color), inset 0 -0.1em #000;
    transition: box-shadow 150ms ease;
    transform-origin: 0% 0%;
  }

  a.link:hover {
    color: ${theme.color.link.base};
  }

  a.link:after {
    content: " ↗";
    transition: transform 150ms ease;
  }

  .sticky {
    display: table;
  }
  .sticky tr {
    position: fixed;
    width: 95vw;
    background: ${theme.color.background.base};
    padding: 1.5rem 0 1rem 0;
    display: table;
    top: -4rem;
    transform: translateY(4rem);
    transition: transform 400ms ease-out;
  }
  .sticky td {
    border-bottom: none;
  }

  .check svg {
    opacity: 0;
  }

  .check.active svg {
    opacity: 1;
  }

  .filterIsOpen {
    opacity: 0.2;
    transition: opacity 300ms ease-in-out;
    cursor: pointer;
  }

  .filterIsOpen table {
    pointer-events: none;
  }

  /* Responsive
 ----------------------------- */
  @media (max-width: ${theme.layout.breakPoints.small}) {
    :root {
      font-size: 12px;
    }

    h1,
    .f1 {
      font-size: 4rem;
      letter-spacing: -0.02em;
    }

    .dn {
      display: none;
    }

    .container {
      padding-left: 2rem;
      padding-right: 2rem;
    }

    .tileArtist {
      padding: 2rem 0;
    }

    .arrowback {
      transition: none;
    }

    .arrowback:hover {
      transform: rotate(0deg);
    }

    .extend span {
      display: inline;
    }
  }

  @media (min-width: 1600px) {
    :root {
      font-size: 18px;
    }
  }
`;

export const cssHelperButtonReset = `
  display: block;
  border: none;
  overflow: visible;
  outline: none;
  font: inherit;
  cursor: pointer;
  background: transparent;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  text-align: center;`;
