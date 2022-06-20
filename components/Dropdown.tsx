import React, { useState } from "react";
import theme from "styles/theme";

interface DropdownProps {
  links: Object;
  button: JSX.Element;
}

export default function Dropdown({ links, button }: DropdownProps) {
  const [showDropdown, setShow] = useState<Boolean>(false);

  return (
    <div
      className="wrapper"
      onClick={() => (showDropdown ? setShow(false) : setShow(true))}
    >
      {button}
      {showDropdown ? (
        <div className="BubbleBox">
          <ul className="menu-list">
            {Object.keys(links).map(function (key) {
              return (
                <a href={links[key]}>
                  <li className="list-item">{key}</li>
                </a>
              );
            })}
          </ul>
        </div>
      ) : null}
      <style jsx>{`
        .BubbleBox {
          margin-top: 1rem;
          position: absolute;
          left: 0;
          background: ${theme.color.background.base};
          border-radius: 0.5rem;
          box-shadow: 0 0.3rem 0.3rem rgba(0, 0, 0, 0.2);
        }

        .BubbleBox:before {
          content: "";
          position: absolute;
          top: -0.6rem;
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

        .menu-list {
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .list-item {
          color: ${theme.color.text.alt2};
          cursor: pointer;
          font-weight: 400;
          padding: 1rem 2.2rem;
          // TODO: Figure out why the css below is not showing
          /* border-bottom: 1rem solid ${theme.color.background.alt}; */
        }

        /* .list-item:nth-last-child(1) {
          border-bottom: none;
        } */

        .list-item:hover {
          background: ${theme.color.background.alt};
        }
      `}</style>
    </div>
  );
}
