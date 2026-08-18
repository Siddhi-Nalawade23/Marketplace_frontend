import { useState } from "react";
import { getProducts, deleteProduct } from "../api/products";
import { isSeller } from "../api/authHelpers";
import ProductCard from "../components/ProductCard";
import { Search as SearchIcon, X } from "lucide-react";
import "./Search.css";

function Search() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const runSearch = (term) => {
        setLoading(true);
        setError(null);
        setHasSearched(true);

        getProducts(term)
            .then((res) => setProducts(res.data))
            .catch((err) => {
                setError(err.response?.data?.error || err.message || "Search failed");
            })
            .finally(() => setLoading(false));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            runSearch(query.trim());
        }
    };

    const handleClear = () => {
        setQuery("");
        setProducts([]);
        setHasSearched(false);
        setError(null);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this product?")) return;

        deleteProduct(id)
            .then(() => runSearch(query))
            .catch((err) => {
                alert(err.response?.data?.error || "Failed to delete product");
            });
    };

    return (
        <div className="search-page">
            <div className="search-hero">
                <span className="search-hero__pattern" aria-hidden="true" />
                <h1 className="search-hero__title">Find products across the marketplace</h1>

                <form className="search-bar" onSubmit={handleSearch}>
                    <SearchIcon className="search-bar__icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search for phones, laptops, cameras..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-bar__input"
                    />
                    {query && (
                        <button
                            type="button"
                            className="search-bar__clear"
                            onClick={handleClear}
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <button type="submit" className="search-bar__submit">
                        Search
                    </button>
                </form>
            </div>

            <div className="search-results">
                {!hasSearched && (
                    <p className="search-results__hint">Start typing above to search the catalog.</p>
                )}

                {loading && (
                    <div className="search-skeleton-grid">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div className="search-skeleton-card" key={i}>
                                <div className="search-skeleton-img" />
                                <div className="search-skeleton-line" style={{ width: "70%" }} />
                                <div className="search-skeleton-line" style={{ width: "45%" }} />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="search-error">
                        <p>Error: {error}</p>
                        <button onClick={() => runSearch(query)}>Retry</button>
                    </div>
                )}

                {!loading && !error && hasSearched && products.length === 0 && (
                    <div className="search-empty">
                        <p>No products found for "{query}".</p>
                    </div>
                )}

                {!loading && !error && products.length > 0 && (
                    <>
                        <p className="search-results__count">
                            {products.length} result{products.length !== 1 ? "s" : ""} for "{query}"
                        </p>
                        <div className="search-results__grid">
                            {products.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    showSellerControls={isSeller()}
                                    onDelete={() => handleDelete(p.id)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Search;