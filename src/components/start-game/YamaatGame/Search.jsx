"use client";

import { useState } from "react";
import classes from "./Search.module.css";
import Image from "next/image";

function Search({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // 🔥 ننده على onSearch أول ما يكتب
    onSearch(value);
  };

  return (
    <div className={classes.main} id="start-game-yamaat-categories-section">
      <input
        className={classes.input}
        type="text"
        placeholder="ابحث في الفئات"
        value={query}
        onChange={handleQueryChange}
      />
      <button
        className={classes.submitBtn}
        type="button"
        onClick={() => onSearch(query)} // لو حابب تخلي الزرار شغال برضه
      >
        <Image src="/icons/search.svg" alt="search" width="36" height="36" />
      </button>
    </div>
  );
}

export default Search;
