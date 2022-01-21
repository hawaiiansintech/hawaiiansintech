/* Based off: https://codesandbox.io/s/usa-state-labels-map-fvi5o and https://codesandbox.io/s/usa-state-labels-map-forked-du7zm*/
import React from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from "react-simple-maps";
import { scaleQuantile } from "d3-scale";

import allStates from "./Data/AllStates.json";
import count from "./Data/StateData.json";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const colorScale = scaleQuantile()
  .domain(count.map((d) => d.count))
  .range(["#F6F4F3", "#F4EFEC", "#F2E9E4", "#F0E2DB", "#F0DCD1"]);

const offsets = {
  VT: [30, -8],
  NH: [10, 2],
  MA: [10, -1],
  RI: [10, 2],
  CT: [12, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21]
};

const MapChart = () => {
  return (
    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoUrl}>
        {({ geographies }) => (
          <>
            {geographies.map((geo) => {
              const cur = allStates.find((s) => s.val === geo.id);
              const properties = count.find((s) => s.state === cur.id);
              return (
                <Geography
                  key={geo.rsmKey}
                  stroke="white"
                  geography={geo}
                  fill={properties ? colorScale(properties.count) : "#EEE"}
                />
              );
            })}
            /
            {geographies.map((geo) => {
              const centroid = geoCentroid(geo);
              console.log(geo);
              const cur = allStates.find((s) => s.val === geo.id);
              const properties = count.find((s) => s.state === cur.id);
              console.log(properties);
              return (
                <g key={geo.rsmKey + "-name"} fill="#292048">
                  {cur &&
                    centroid[0] > -160 &&
                    centroid[0] < -67 &&
                    (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                      <Marker coordinates={centroid}>
                        <text y="2" fontSize={14} textAnchor="middle">
                          {/* {properties && `${properties.count}`} */}
                        </text>
                      </Marker>
                    ) : (
                      <div></div>
                    ))}
                </g>
              );
            })}
          </>
        )}
      </Geographies>
    </ComposableMap>
  );
};

export default MapChart;