import React, { useState } from "react";
import theme from "styles/theme";

interface ImageExpandProps {
  imagePath: string;
}

export default function ImageExpand({ imagePath }: ImageExpandProps) {
  const [expandImage, setExpand] = useState<boolean>(false);
  return (
    <>
      <img
        className="image"
        src={imagePath}
        onClick={() => (expandImage ? setExpand(false) : setExpand(true))}
      ></img>
      <style jsx>{`
        .image {
          cursor: pointer;
          max-height: ${expandImage ? "50rem" : "30rem"};
          box-shadow: 0.1rem 0.1rem 0.1rem 0.1rem;
        }
        .image:hover {
          box-shadow: 0.15rem 0.15rem 0.15rem 0.2rem;
        }
        @media screen and (max-width: ${theme.layout.breakPoints.small}) {
          .image {
            max-height: ${expandImage ? "35rem" : "25rem"};
          }
        }
      `}</style>
    </>
  );
}
