import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

function Search() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();

        if (search.trim()) {
            navigate(`/products?search=${encodeURIComponent(search.trim())}`);
        } else {
            navigate("/products");
        }
    };
    return (
        <>
            <div className="search-container">
                <span>
                    <h2 className="search-title">Search for Products and Services.</h2>
                </span>
                <form className="navbar__search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">
                        Search
                    </button>

                </form>


            </div>
        </>
    )
}
export default Search;