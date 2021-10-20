import FuzzySort from "fuzzysort";
import { useEffect, useState } from "react";
import Input from "./Input.js";
import { cssHelperButtonReset } from "../../styles/global.js";

const INPUT_TAB_INDEX = 3;

export default function SearchBar({ dictionary, onSelect }) {
  const [searchResults, setSearchResults] = useState([]);
  const [hideResults, setHideResults] = useState(true);
  const [focused, setFocused] = useState(0);

  const onSearchChange = (e) => {
    let results = FuzzySort.go(e.target.value, dictionary, { key: "name" });
    results = results.filter((result) => result.score > -200).slice(0, 4);
    setSearchResults(results);
    setHideResults(false);
    setFocused(0);
  };

  const handleKeyDown = (e) => {
    const downKey = e.keyCode === 40,
      upKey = e.keyCode === 38,
      enterKey = e.keyCode === 13;

    if (upKey && focused > 0) {
      e.preventDefault();
      setFocused(focused - 1);
    } else if (downKey && focused < searchResults.length - 1) {
      e.preventDefault();
      setFocused(focused + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <Input
        label="What’s your professional focus?"
        labelTranslation="He aha kou ʻoihana?"
        onBlur={() => {
          setHideResults(true);
        }}
        onChange={onSearchChange}
        placeholder="Search"
        tabIndex={INPUT_TAB_INDEX}
      />
      {searchResults.length > 0 && !hideResults && (
        <div className="search-bar-wrapper">
          <div className="search-bar-suggestions" tabIndex="-1">
            {searchResults?.map((result, i) => {
              const tabIndex = INPUT_TAB_INDEX + i + 1;
              return (
                <SearchBarResult
                  data={result}
                  onFocus={() => {
                    setFocused(i);
                  }}
                  onMouseOver={() => {
                    setFocused(i);
                  }}
                  focused={i === focused}
                  tabIndex={tabIndex}
                  key={`result-${i}`}
                >
                  {result.target}
                </SearchBarResult>
              );
            })}
          </div>
        </div>
      )}
      <style jsx>{`
        .search-bar-wrapper {
          position: relative;
        }
        .search-bar-suggestions {
          position: absolute;
          display: flex;
          flex-direction: column;
          z-index: 500;
          background: var(--color-background-balloon);
          width: 100%;
          top: 0;
          border-radius: var(--border-radius-small);
          padding: 0.2rem;
        }
      `}</style>
    </>
  );
}

function SearchBarResult({
  children,
  data,
  onFocus,
  onMouseOver,
  focused,
  tabIndex,
}) {
  let chars;
  if (typeof children === "string") {
    chars = children.split("");
  }

  return (
    <>
      <button tabIndex={tabIndex} onMouseOver={onMouseOver} onFocus={onFocus}>
        <h3>
          {chars.map((char, i) => {
            let renderChar = char;
            if (data.indexes.indexOf(i) > -1) {
              renderChar = <strong key={`strong-${i}`}>{char}</strong>;
            }
            return renderChar;
          })}
        </h3>
      </button>
      <style jsx>{`
        button {
          --color-background-dropdown: #ffffff;
          --color-background-dropdown-alt: #eee;
          --color-background-dropdown-focused: #ffd6c7;
          ${cssHelperButtonReset}
          padding: 0.5rem 0.75rem;
          border-radius: var(--border-radius-x-small);
          width: 100%;
          text-align: left;
          background: ${focused
            ? "var(--color-background-dropdown-focused)"
            : "initial"};
        }
        button:focus {
          background: var(--color-background-dropdown-focused);
        }
        h3 {
          font-size: 1.6rem;
          margin: 0;
        }
      `}</style>
    </>
  );
}
