import theme from "styles/theme";

interface HitLogoProps {
  inline?: boolean;
}

export default function HitLogo({ inline }: HitLogoProps) {
  return (
    <>
      <img
        className="logo"
        src={"/images/HitLogoNoBackground.png"}
        alt="Website logo"
      />
      <style jsx>{`
        .logo {
          width: ${inline ? "100%" : "5.4rem"};
          position: ${inline ? "initial" : "absolute"};
          right: ${inline ? "initial" : "1rem"};
          top: ${inline ? "initial" : "1rem"};
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .logo {
            width: ${inline ? "100%" : "6.4rem"};
          }
        }
      `}</style>
    </>
  );
}
