import { motion } from "framer-motion";
import { useState } from "react";
import ReactMapGL from "react-map-gl";
import CheckSVG from "./Icons/CheckSVG.js";
import CloseSVG from "./Icons/CloseSVG.js";

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

export default function FilterMap({
  regionGeos,
  items,
  handleFilterClick,
  handleCloseFilter,
}) {

  const [viewport, setViewport] = useState({
    width: "100%",
    height: 400,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 2
  });

  let countItems = {};
  items.forEach(item => {
    countItems[item.label] = countItems[item.label] + 1 || 1
  })

  console.log(regionGeos);

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
        maxWidth: "720px",
        overflowY: "scroll",
      }}
    >
      <div className="map-sidebar">
        <a
          aria-label="Close"
          href="#"
          className="close"
          onClick={handleCloseFilter}
        >
          <CloseSVG />
        </a>
        <ReactMapGL
          {...viewport}
          onViewportChange={nextViewport => setViewport(nextViewport)}
          mapStyle="mapbox://styles/hawaiians/ckrsy6wga3med17mxekp9kan6"
          mapboxApiAccessToken={`pk.eyJ1IjoiaGF3YWlpYW5zIiwiYSI6ImNrcnN4bHkxajExNnoydmxlczJkN3BiNW4ifQ.JxRuoffbMrDecqFpI7cJ4A`}
        />
        <div className="map-sidebar__body">
          <h3>
            FILTER MAP
          </h3>
          {items.sort((a, b) => {
            if (a.label > b.label) return 1;
            if (a.label < b.label) return -1;
            return 0;
          }).filter((curr, index, self) => (
            index === self.findIndex((t) => (
              t.label === curr.label
            ))
          ))
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
              )
            })}
        </div>
      </div>
      <style jsx>{`
        .map-sidebar {
          width: 100%;
          background: var(--color-background);
          color: var(--color-text);
          min-height: 100vh;
          border-left: 5px solid var(--color-text);
        }
        .map-sidebar__body {
          width: 100%;
          padding: 2.5rem;
        }

        .close {
          display: block;
          width: 1.5rem;
          height: 1.5rem;
        }

        h3 {
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
        <span className="filterItem__count">
          ({count})
        </span>
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
