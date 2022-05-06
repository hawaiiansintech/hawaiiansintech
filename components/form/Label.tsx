import { motion } from "framer-motion";
import React from "react";
import theme from "styles/theme";
import Tag from "../Tag";

interface LabelProps {
  htmlFor?: string;
  label: string;
  labelTranslation?: string;
  tagged?: string;
}

const asideTransition = {
  hidden: { opacity: 0, transform: "translateY(25%)" },
  show: {
    opacity: 1,
    transform: "translateY(0%)",
    transition: { duration: 0.5, ease: "anticipate", delay: 0.125 },
  },
};

export default function Label({
  htmlFor,
  label,
  labelTranslation,
  tagged,
}: LabelProps) {
  return (
    <label htmlFor={htmlFor}>
      <div>
        {tagged ? (
          <motion.aside
            variants={asideTransition}
            initial="hidden"
            animate="show"
            style={{
              margin: "0 0 0.5rem",
            }}
          >
            <aside>
              <Tag>{tagged}</Tag>
            </aside>
          </motion.aside>
        ) : null}
        <main>
          <h3>{label}</h3>
          {labelTranslation && <h4>{labelTranslation}</h4>}
        </main>
      </div>
      <style jsx>{`
        label {
          position: relative;
          display: block;
        }
        main {
          flex-grow: 1;
        }
        h3,
        h4 {
          margin: 0;
          line-height: 120%;
        }
        h3 {
          display: flex;
          align-items: flex-start;
          flex-wrap: nowrap;
          font-size: 1.4rem;
          font-weight: 600;
        }
        h4 {
          font-size: 0.9rem;
          line-height: 150%;
          font-weight: 400;
          color: ${theme.color.brand.faded};
          font-style: italic;
        }
      `}</style>
    </label>
  );
}
