import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: "5%" },
  show: {
    opacity: 1,
    y: "0%",
    transition: {
      easing: "easeInOut" as const,
    },
  },
};

interface TitleProps {
  noAnimation?: boolean;
  text: string;
  className?: string;
}

export function Title({ noAnimation, text, className }: TitleProps) {
  return (
    <motion.h1
      className={cn(
        "m-0 p-0 text-4xl font-medium tracking-tighter md:text-6xl xl:text-8xl",
        className,
      )}
      variants={container}
      initial={noAnimation ? "show" : "hidden"}
      animate="show"
    >
      {text.split("").map((l, i) => {
        if (l == "*") return <br key={`${l}-${i}`} />;
        return (
          <motion.span
            className="inline-block"
            variants={item}
            key={`${l}-${i}`}
          >
            {l}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}

export function Subtitle({ noAnimation, text }: TitleProps) {
  return (
    <motion.h2
      className="m-0 p-0"
      variants={container}
      initial={noAnimation ? "show" : "hidden"}
      animate="show"
    >
      {text.split("").map((l, i) => {
        if (l == "*") return <br key={`${l}-${i}`} />;
        return (
          <motion.span
            className="inline-block"
            variants={item}
            key={`${l}-${i}`}
          >
            {l}
          </motion.span>
        );
      })}
    </motion.h2>
  );
}
