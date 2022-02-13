import Link from "next/link";
import React from "react";
import theme from "styles/theme";
import { cssHelperButtonReset } from "../styles/global";
import { Icon, IconAsset } from "./icon/icon";

export interface BalloonLinkProps {
  label: string;
  href: string;
}

export interface BalloonProps {
  message: string;
  link?: BalloonLinkProps;
  onClose?: () => any;
}

export default function Balloon({ message, link, onClose }: BalloonProps) {
  return (
    <div className="balloon">
      <div className="balloon__body">
        <p>{message}</p>
        {link && (
          <span className="balloon__link">
            <Link href={link.href}>{link.label}</Link>
          </span>
        )}
      </div>
      {onClose && (
        <button className="balloon__close" onClick={onClose}>
          <Icon asset={IconAsset.Close} />
        </button>
      )}
      <style jsx>{`
        .balloon {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          border-radius: ${theme.borderRadius.sm};
          background: ${theme.color.background.float};
          padding: ${onClose ? "0.5rem 0.5rem 0.5rem 1.5rem" : "1rem"};
          margin: 0 auto 2rem;
          text-align: center;
          box-shadow: ${theme.elevation.two.desat};
        }
        .balloon__body {
          flex-grow: 1;
        }
        .balloon__body p {
          display: inline;
          margin: 0;
          font-size: 1.125rem;
        }
        .balloon__link {
          display: inline-block;
          margin-left: 0.5rem;
        }
        .balloon__close {
          ${cssHelperButtonReset}
          display: inline-flex;
          margin-left: 0.5rem;
        }
      `}</style>
    </div>
  );
}
