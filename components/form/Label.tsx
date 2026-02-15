import { motion } from "framer-motion";
import React from "react";
import Tag from "../Tag";

interface LabelProps {
  htmlFor?: string;
  label: string;
  labelTranslation?: string;
  tagged?: string;
}

const asideTransition = {
  hidden: { opacity: 0, transform: "translateY(25%)" },
  show: { opacity: 1, transform: "translateY(0%)" },
};

export default function Label({
  htmlFor,
  label,
  labelTranslation,
  tagged,
}: LabelProps) {
  return (
    <label className="relative block space-y-1" htmlFor={htmlFor}>
      {tagged ? (
        <motion.aside
          variants={asideTransition}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.125 }}
        >
          <Tag label={tagged} />
        </motion.aside>
      ) : null}
      <main>
        <h3 className="my-0 text-xl font-semibold text-stone-700">{label}</h3>
        {labelTranslation && (
          <h4 className="my-0 text-sm font-semibold italic text-brown-600">
            {labelTranslation}
          </h4>
        )}
      </main>
    </label>
  );
}
