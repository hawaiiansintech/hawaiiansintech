import Link from "next/link";
import { Icon, IconAsset, IconColor } from "./icons/icon";

interface StartOptionProps {
  icon?: IconAsset;
  headline: string;
  description: string;
  href: string;
}

export default function StartOption({
  icon,
  headline,
  href,
  description,
}: StartOptionProps) {
  return (
    <Link href={href}>
      <div className="start-option">
        <div className="start-option__body">
          {icon && <Icon asset={icon} color={IconColor.Brand} />}
          {headline && <h2>{headline}</h2>}
          {description && <h3>{description}</h3>}
        </div>
        <Icon asset={IconAsset.ArrowRight} alpha />
        <style jsx>{`
          .start-option {
            display: flex;
            align-items: center;
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: var(--border-radius-medium);
            background: var(--color-background-alt);
            border: 0.25rem solid transparent;
            cursor: pointer;
          }
          .start-option:hover {
            border-color: var(--color-border-alt);
          }
          .start-option:active,
          .start-option:focus {
            background-color: var(--color-border-alt);
          }
          .start-option__body {
            flex-grow: 1;
          }
          h2,
          h3 {
            margin: 0;
          }
          h2 {
            margin-bottom: 0.25rem;
            font-size: 1.2rem;
          }
          h3 {
            font-size: 0.875rem;
            font-weight: 400;
          }
        `}</style>
      </div>
    </Link>
  );
}
