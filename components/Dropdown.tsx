import React, { useState, ReactElement } from "react";
import theme from "styles/theme";

interface DropdownProps {
  links: Record<string, string>;
  button: ReactElement;
}

export default function Dropdown({ links, button }: DropdownProps) {
  const [showDropdown, setShow] = useState<boolean>(false);

  return (
    <div
      className="wrapper"
      onClick={() => (showDropdown ? setShow(false) : setShow(true))}
    >
      {button}
      {showDropdown ? (
        <div className="BubbleBox">
          <ul>
            {Object.keys(links).map(function (key) {
              const twitter = links[key].includes("twitter");
              const instagram = links[key].includes("instagram");
              return (
                <div key={key} className="link-wrapper">
                  <a href={links[key]}>
                    <li>
                      {twitter ? <img src="images/twitter.png" /> : null}
                      {instagram ? (
                        <img className="instagram" src="images/instagram.png" />
                      ) : null}
                      {key}
                    </li>
                  </a>
                </div>
              );
            })}
          </ul>
        </div>
      ) : null}
      <style jsx>{`
        ul {
          padding: 0;
          margin: 0;
          list-style: none;
        }
        li {
          text-align: middle;
          color: ${theme.color.text.alt2};
          font-weight: 400;
          padding: 1rem 2rem;
          white-space: nowrap;
        }
        img {
          vertical-align: middle;
          max-height: 1rem;
          margin-right: 0.4rem;
        }
        .BubbleBox {
          margin-top: 1rem;
          position: absolute;
          background: ${theme.color.background.base};
          border-radius: 0.5rem;
          box-shadow: 0 0.3rem 0.3rem rgba(0, 0, 0, 0.2);
        }
        .BubbleBox:before {
          content: "";
          position: absolute;
          top: -1rem;
          width: 0;
          height: 0;
          left: 1rem;
          border-left: 1rem solid transparent;
          border-right: 1rem solid transparent;
          border-bottom: 1rem solid ${theme.color.background.base};
        }
        .wrapper {
          position: relative;
          justify-content: center;
        }
        .link-wrapper {
          cursor: pointer;
          border-bottom: 0.2rem solid ${theme.color.background.alt};
        }
        .link-wrapper:hover {
          background: ${theme.color.background.alt};
        }
        .link-wrapper:nth-last-child(1) {
          border-bottom: none;
        }
        .instagram {
          margin-bottom: 0.2rem;
        }
        @media screen and (max-width: ${theme.layout.breakPoints.small}) {
          .BubbleBox {
            right: 0rem;
          }
          .BubbleBox:before {
            left: auto;
            right: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
