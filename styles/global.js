import css from "styled-jsx/css";

export default css.global`
  :root {
    --color-brand: #fc7442;
    --color-brand-alpha: #fc7442;
    --color-brand-tone: #ec4427;
    --color-brand-faded: #cf8870;
    --color-link: var(--color-brand);
    --color-link-alt: var(--color-brand-tone);
    --color-text: #353535;
    --color-text--alt: #777;
    --color-text--overlay: #fff;
    --color-border: #dacbc8;
    --color-background: #e5e5e5;
    --color-error: #e3523a;
    --color-error-alpha: rgba(227, 82, 58, 0.0625);

    --color-background-balloon: #ffffff;
    --color-background-balloon-alt: #eee;
    --color-background-balloon-selected: #eee;
    --color-background-button: linear-gradient(
      to top right,
      var(--color-brand),
      var(--color-brand-tone)
    );
    --color-background-button-disabled: #dddddd;
    --color-text-button: #fff;
    --color-text-button-disabled: #5c5a5e;
    --box-shadow-outline-button: rgba(252, 116, 66, 0.5) 0px 0px 1rem;

    --border-radius-x-small: 0.25rem;
    --border-radius-small: 0.5rem;
    --border-radius-medium: 1rem;
    --border-radius-large: 1.5rem;
  }

  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    font-family: "Helvetica Now Display", "Helvetica Neue", "Helvetica";
    background: var(--color-background);
    color: var(--color-text);
    font-weight: 500;
    margin: 0;
    padding: 0;
  }

  .container {
    width: calc(100% - 4rem);
    margin: 3rem auto;
    position: relative;
  }

  a {
    text-decoration: none;
    color: var(--color-link);
  }

  a:hover {
    color: var(--color-link-alt);
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
    border-bottom: 1px solid var(--color-border);
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
    /* background: #111111; */
    color: var(--color-link);
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

  .title {
    padding-top: 26vh;
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
    color: var(--color-text);
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
    --color: var(--color-text);
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
    --color: var(--color-link);
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
    background: var(--color-background);
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
  @media (max-width: 480px) {
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
      width: calc(100% - 2rem);
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
  margin: 0 auto;
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
