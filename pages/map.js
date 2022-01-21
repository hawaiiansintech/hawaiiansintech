import Link from "next/link";
import React from "react";
import MapChart from "../components/MapChart";


export default function Map() {
    return (
        <div className="container">
        <Link href="/" shallow={true}>
            <a className="auxNav arrowback">←</a>
        </Link>
        <div className="map-container">
            <MapChart/>
        </div>

        <style jsx>{`
            .map-container{
                height: 800px;
                width: 80%;
                margin: auto;
            }

        `}</style>
        
        </div>
    );
}