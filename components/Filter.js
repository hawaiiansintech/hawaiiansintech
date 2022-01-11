import { motion } from "framer-motion";
import CheckSVG from "./icon/CheckSVG.js";
import CloseSVG from "./icon/CloseSVG.js";

const sidebarAnimation = {
  hidden: { x: "120%" },
  show: {
    x: "0%",
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

export default function Filter({
  items,
  handleFilterClick,
  handleCloseFilter,
  categoryName,
}) {
  let countItems = {};
  items.forEach((item) => {
    countItems[item.label] = countItems[item.label] + 1 || 1;
  });

  return (
    <motion.div
      variants={sidebarAnimation}
      initial="hidden"
      animate="show"
      exit="hidden"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100%",
        width: "100%",
        maxWidth: "420px",
        overflowY: "scroll",
      }}
    >
      <div className="sidebar">
        <a
          aria-label="Close"
          href="#"
          className="close"
          onClick={handleCloseFilter}
        >
          <CloseSVG />
        </a>
        <h3>FILTER</h3>

        {items
          .sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
          })
          .filter(
            (curr, index, self) =>
              index === self.findIndex((t) => t.label === curr.label)
          )
          .map((item, i) => {
            return (
              <FilterItem
                key={`${item.label}-${i}`}
                label={item.label}
                active={item.active}
                count={countItems[item.label]}
                onClick={() => {
                  handleFilterClick(item);
                }}
              />
            );
          })}
      </div>
      <style jsx>{`
        .sidebar {
          width: 100%;
          max-width: 420px;
          background: var(--color-background);
          color: var(--color-text);
          padding: 2.5rem;
          min-height: 100vh;
          border-left: 5px solid var(--color-text);
        }

        .close {
          display: block;
          width: 1.5rem;
          height: 1.5rem;
        }

        h3 {
          margin-top: 4rem;
          font-size: 0.9rem;
          letter-spacing: 0.075rem;
          font-weight: 600;
          text-transform: uppercase;
        }
      `}</style>
    </motion.div>
  );
}

function FilterItem({ label, active, onClick, count }) {
  return (
    <div className="filterItem" onClick={onClick}>
      <div>
        {label}
        <span className="filterItem__count">({count})</span>
      </div>
      <div className={`check ${active ? "active" : ""}`}>
        <CheckSVG />
      </div>
      <style jsx>{`
        .filterItem {
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0.1rem 0;
        }

        .filterItem:hover {
          color: var(--color-link);
        }
        .filterItem__count {
          font-size: 0.75em;
          margin-left: 0.5rem;
          color: var(--color-link);
        }

        .check {
          width: 1.7rem;
          height: 1.7rem;
          border-radius: 6px; */
        }
      `}</style>
    </div>
  );
}
