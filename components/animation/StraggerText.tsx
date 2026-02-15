import { motion } from "framer-motion";

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const container = {
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

interface StaggerTextProps {
  classNames?: string;
  words?: string[];
}

export function StaggerText({ words, classNames }: StaggerTextProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="hidden"
      className={`
        space-1
        ${classNames}
      `}
    >
      {words.map((word, idx) => (
        <motion.span key={`${word}-${idx}`} variants={item}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
