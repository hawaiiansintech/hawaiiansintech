import Link from "next/link";
import Button, { ButtonSize } from "./Button";
import { Icon, IconAsset, IconColor } from "./icon/icon";

interface StartOptionProps {
  cta?: string;
  icon?: IconAsset;
  headline: string;
  description: string;
  href: string;
}

export default function StartOption({
  cta,
  icon,
  headline,
  description,
  href,
}: StartOptionProps) {
  return (
    <Link href={href}>
      <div className="start-option">
        {icon && <Icon asset={icon} color={IconColor.Brand} />}
        {headline && <h2>{headline}</h2>}
        {description && <h3>{description}</h3>}
        {cta && (
          <div className="start-option__cta">
            <Button size={ButtonSize.Small}>{cta}</Button>
          </div>
        )}
        <style jsx>{`
          .start-option {
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: var(--border-radius-medium);
            background: var(--color-background-alt);
            border: 0.25rem solid transparent;
            cursor: pointer;
          }
          .start-option:hover {
            border-color: var(--color-border-alt);
            cursor: pointer;
          }
          .start-option:active,
          .start-option:focus {
            background-color: var(--color-border-alt);
          }
          .start-option__cta {
            margin-top: 1rem;
            pointer-events: none;
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
            color: var(--color-text-alt);
          }
        `}</style>
      </div>
    </Link>
  );
}
