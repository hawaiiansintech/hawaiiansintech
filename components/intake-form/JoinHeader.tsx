import HitLogo from "@/components/HitLogo";
import { Icon, IconAsset, IconColor } from "@/components/icon/icon";
import Link from "next/link";
import { cssHelperButtonReset } from "styles/global";
import theme from "styles/theme";

interface JoinHeaderProps {
  backUrl?: string;
  children?: React.ReactNode;
  toggle?: {
    byline?: string;
    headline?: string;
    onClick?: (any) => void;
    show?: boolean;
  };
}

export default function JoinHeader({
  backUrl = "/",
  children,
  toggle,
}: JoinHeaderProps) {
  return (
    <header className="join-header">
      <nav className="join-header__nav">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link href={backUrl} shallow={true}>
            <a className="back-link">
              <Icon asset={IconAsset.CaretLeft} color={IconColor.Inherit} />
            </a>
          </Link>
          {toggle?.show && (
            <JoinHeaderToggle
              byline={toggle?.byline || "On the List?"}
              headline={toggle?.headline || "Request Changes"}
              toggleEdit={toggle?.onClick}
            />
          )}
        </div>
      </nav>
      {children ? <div className="join-header__main">{children}</div> : null}
      <div className="join-header__logo">
        <HitLogo />
      </div>
      <style jsx>{`
        .join-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 1rem;
          column-gap: 0.5rem;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .join-header {
            /* grid-template-columns: 5rem 1fr 5rem; */
          }
        }
        .back-link {
          display: block;
          border-radius: ${theme.borderRadius.sm};
          color: ${theme.color.text.alt};
          padding: 0.25rem 0.5rem;
          margin-right: 2rem;
          transition: all 70ms ease-out;
        }
        .back-link:hover,
        .back-link:focus {
          color: ${theme.color.brand.base};
          transform: scale(1.25);
        }
        .back-link:active {
          transform: scale(1);
          color: ${theme.color.brand.alt};
        }
        .join-header__nav,
        .join-header__logo {
          flex-basis: 0;
          flex-grow: 1;
        }
        .join-header__main {
          flex-basis: 24rem;
        }
        .join-header__nav {
          padding-top: 1rem;
        }
        .join-header__logo {
          display: flex;
          justify-content: flex-end;
        }
        button {
          ${cssHelperButtonReset}
          background: ${theme.color.background.base};
          border-radius: ${theme.borderRadius.lg};
        }
        span {
          flex-shrink: 0;
        }
      `}</style>
    </header>
  );
}

interface JoinHeaderToggleProps {
  headline: string;
  byline: string;
  toggleEdit?: (any) => void;
}

export function JoinHeaderToggle({
  byline,
  headline,
  toggleEdit,
}: JoinHeaderToggleProps) {
  return (
    <button onClick={toggleEdit}>
      <h4>{byline}</h4>
      <h3>{headline}</h3>
      <style jsx>{`
        button {
          ${cssHelperButtonReset}
          display: block;
          text-align: initial;
          background: ${theme.color.background.alt};
          padding: 0.5rem 1rem;
          border-radius: ${theme.borderRadius.sm};
          border: transparent 0.25rem solid;
          transition: all 70ms ease-out;
        }
        button:hover,
        button:active {
          transform: scale(1.05);
          color: ${theme.color.text.overlay};
          background: ${theme.color.brand.base};
          border-color: ${theme.color.brand.alt};
        }
        button:active {
          transform: scale(1);
        }
        h3,
        h4 {
          margin: 0;
          white-space: nowrap;
          transition: color 70ms ease-out;
        }
        h3 {
          font-size: 1rem;
          color: ${theme.color.text.alt};
        }
        h4 {
          font-weight: 500;
          font-size: 0.875rem;
          color: ${theme.color.text.alt3};
        }

        button:hover h3,
        button:active h3 {
          color: ${theme.color.text.overlay.base};
        }
        button:hover h4,
        button:active h4 {
          color: ${theme.color.text.overlay.alt};
        }
      `}</style>
    </button>
  );
}
