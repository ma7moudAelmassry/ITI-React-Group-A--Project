import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";


function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export default function SearchBar({ onSearchSubmit }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

 
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const nextQuery = query.trim();
    if (!nextQuery) return;

  
    setSearchParams({ query: nextQuery });

    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <form
      className="fk-search"
      role="search"
      onSubmit={handleSearch}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="search"
        name="query"
        placeholder="Search movies"
        aria-label="Search movies"
        required
        pattern=".*\S.*"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" aria-label="Search">
        <SearchIcon />
      </button>
    </form>
  );
}