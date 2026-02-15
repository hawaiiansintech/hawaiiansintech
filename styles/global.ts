import css from "styled-jsx/css";
import theme from "./theme";

const styles = css.global`
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
    --border-radius-rounded: ${theme.borderRadius.rounded};

    --width-page-interior: ${theme.layout.width.interior};
    --width-resp-small: ${theme.layout.breakPoints.small};
  }

  @import url("https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap");
`;

export default styles;
