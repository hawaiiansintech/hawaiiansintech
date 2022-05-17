import React, { useState } from "react";
import theme from "styles/theme";

export interface AccordionProps {
  label: string;
  body?: React.ReactNode;
  onToggle?: (any?) => void;
  open?: boolean;
}

export default function Accordion({
  label,
  body,
  onToggle,
  open,
}: AccordionProps) {
  const [active, setActive] = useState<boolean>(false);
  const handleToggle = () => {
    onToggle();
    setActive(!active);
  };
  return (
    <div
      onClick={handleToggle}
      className={`accordion ${active ? "accordion--active" : ""}`}
    >
      <h4 className="accordion__label">{label}</h4>
      {open && <section className="accordion__body">{body}</section>}
      <style jsx>{`
        .accordion {
          /* this should be a button */
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-top: 0.125rem solid ${theme.color.border.base};

          transition: background 150ms ease-out;
        }
        .accordion:hover {
          background: ${open ? "initial" : theme.color.background.alt};
        }
        .accordion__label {
          position: relative;
          padding: 0.25rem 0;
          margin: 0;
          color: ${theme.color.text.alt};
          font-size: 1.125rem;
          font-weight: 600;
        }
        .accordion__label:after {
          content: "";
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          transform-origin: right top;
          display: block;
          width: 0.5rem;
          height: 0.5rem;
        }
        .accordion:not(.accordion--active) .accordion__label:after {
          border-bottom: 0.125rem solid ${theme.color.brand.faded};
          border-right: 0.125rem solid ${theme.color.brand.faded};
        }
        .accordion__body {
          margin: 0.25rem 0 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: ${theme.color.text.alt};
        }
      `}</style>
    </div>
  );
}

export function AccordionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target="_blank">
      {children}
      <style jsx>{`
        a {
          display: block;
          padding: 0.5rem;
          /* background: ${theme.color.background.alt}; */
          border: 0.125rem solid ${theme.color.border.base};
          border-radius: ${theme.borderRadius.sm};
          margin-bottom: 0.5rem;
        }
      `}</style>
    </a>
  );
}
