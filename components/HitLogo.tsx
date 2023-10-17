import theme from "styles/theme";

interface HitLogoProps {
  fullWidth?: boolean;
  inline?: boolean;
}

export default function HitLogo({ fullWidth, inline }: HitLogoProps) {
  return (
    <>
      <img
        className="logo"
        src={"/images/logo - hawaiians in tech.svg"}
        alt="Website logo"
      />
      <style jsx>{`
        .logo {
          width: ${fullWidth ? "100%" : "5.4rem"};
          height: ${fullWidth ? "auto" : "5.2rem"};
          position: ${inline ? "initial" : "absolute"};
          right: ${inline ? "initial" : "1rem"};
          top: ${inline ? "initial" : "1rem"};
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .logo {
            width: ${fullWidth ? "100%" : "6.4rem"};
            height: ${fullWidth ? "auto" : "6.2rem"};
          }
        }
      `}</style>
    </>
  );
}
