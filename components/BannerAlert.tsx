import { cssHelperButtonReset } from "styles/global";
import theme from "styles/theme";
import { Icon, IconAsset, IconColor, IconSize } from "./icon/icon";
import Tag from "./Tag";

interface BannerAlertProps {
  link?: { label: string; href: string } | { label: string; href: string }[];
  tag?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export default function BannerAlert({
  children,
  link,
  onClose,
  tag,
}: BannerAlertProps) {
  return (
    <div className="banner-alert">
      {tag && (
        <aside className="banner-alert__tag">
          <Tag>{tag}</Tag>
        </aside>
      )}
      <main className="banner-alert__body">{children}</main>
      {onClose ? (
        <button className="banner-alert__close" onClick={onClose}>
          <Icon
            asset={IconAsset.Close}
            color={IconColor.Brand}
            size={IconSize.Small}
          />
        </button>
      ) : null}
      <style jsx>{`
        .banner-alert {
          position: relative;
          display: flex;
          gap: 0 1rem;
          background: ${theme.color.brand.alpha};
          border-radius: ${theme.borderRadius.sm};
          padding: 1rem ${onClose ? "3rem" : "1rem"} 1rem 1rem;
          color: ${theme.color.brand.base};
          font-weight: 500;
        }
        .banner-alert__links {
          display: flex;
        }
        .banner-alert__link {
          font-weight: 600;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          color: ${theme.color.brand.alt};
          cursor: pointer;
        }
        .banner-alert__close {
          ${cssHelperButtonReset}
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          padding: 0;
          display: inline-flex;
          border-radius: ${theme.borderRadius.sm};
        }
        .banner-alert__close:hover {
          background: ${theme.color.brand.alpha};
        }

        @media screen and (min-width: ${theme.layout.breakPoints.small}) {
          .banner-alert {
            padding: 1rem ${onClose ? "3rem" : "1.5rem"} 1rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
