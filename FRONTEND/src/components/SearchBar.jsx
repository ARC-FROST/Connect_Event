import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    // send query to search page
    navigate(`/search?q=${query}`);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search events, media, tags..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button className="btn">Search</button>
    </form>
  );
}

export default SearchBar;