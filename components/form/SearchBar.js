import FuzzySort from "fuzzysort";
import { useEffect, useState } from "react";
import Input from "./Input.js";
import ButtonBox from "./ButtonBox.js";
import { cssHelperButtonReset } from "../../styles/global.js";

export default function SearchBar({ dictionary, handleSelect, handleUpdate }) {
  const [searchResults, setSearchResults] = useState([]);

  const onSearchChange = (e) => {
    let results = FuzzySort.go(e.target.value, dictionary, { key: "name" });
    results = results.filter((result) => result.score > -200);
    setSearchResults(results);
    handleUpdate(results);
  };

  return (
    <>
      <Input
        label="What’s your professional focus?"
        labelTranslation="He aha kou ʻoihana?"
        onChange={onSearchChange}
        placeholder="Search"
      />
      {searchResults.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridAutoRows: "1fr",
            columnGap: "0.5rem",
            rowGap: "0.5rem",
            maxWidth: "var(--page-interior-width)",
            margin: "1rem auto 0",
          }}
        >
          {searchResults.map((result, i) => {
            return (
              <ButtonBox
                label={result.obj.name}
                onClick={() => {
                  handleSelect(result.obj);
                }}
                key={`ButtonBox-${i}-`}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
