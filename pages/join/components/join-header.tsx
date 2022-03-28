import HitLogo from "@/components/HitLogo";
import { Icon, IconAsset } from "@/components/icon/icon";
import Link from "next/link";
import { cssHelperButtonReset } from "styles/global";
import theme from "styles/theme";

interface JoinHeaderProps {
  children?: React.ReactNode;
  prevHref?: string;
}

export default function JoinHeader({ children, prevHref }: JoinHeaderProps) {
  return (
    <header className="join-header">
      <div>
        <Link href={prevHref || "/"} shallow={true}>
          <button>
            <span>
              <Icon asset={IconAsset.Close} />
            </span>
          </button>
        </Link>
      </div>
      <div>{children}</div>
      <HitLogo inline />
      <style jsx>{`
        .join-header {
          display: grid;
          align-items: center;
          width: 100%;
          grid-template-columns: 3rem 1fr 3rem;
          padding: 1rem;
          column-gap: 0.5rem;
        }
        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .join-header {
            grid-template-columns: 5rem 1fr 5rem;
          }
        }
        button {
          ${cssHelperButtonReset}
          background: ${theme.color.background.base};
          border: 0.2rem solid transparent;
          border-radius: ${theme.borderRadius.lg};
        }
        button:hover,
        button:focus {
          /* background: ${theme.color.background.alt}; */
          border-color: ${theme.color.border.base};
        }
        button:active {
          background: ${theme.color.background.alt};
          border-color: ${theme.color.border.alt};
        }
        span {
          flex-shrink: 0;
        }
      `}</style>
    </header>
  );
}
