import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, deleteProduct } from "../api/products";
import { isSeller } from "../api/authHelpers";
import ProductCard from "../components/ProductCard";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const loadProducts = () => {
    setLoading(true);
    setError(null);

    getProducts(search)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Products error:", err);
        setError(err.response?.data?.error || err.message || "Failed to load products");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;

    deleteProduct(id)
      .then(() => {
        loadProducts();
      })
      .catch((err) => {
        console.error("Delete error:", err.response || err);
        alert(
          err.response?.data?.error || "Failed to delete product"
        );
      });
  };

  if (loading) {
    return (
      <div className="home_Products">
        <div className="products__skeleton-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="products__skeleton-card" key={i}>
              <div className="products__skeleton-img" />
              <div className="products__skeleton-line" style={{ width: "70%" }} />
              <div className="products__skeleton-line" style={{ width: "45%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home_Products">
        <div className="products__error">
          <p>Error: {error}</p>
          <button onClick={loadProducts}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home_Products">
      <h1 className="Product-title">
        {search ? `Results for "${search}"` : "Marketplace"}
      </h1>

      {products.length === 0 ? (
        <div className="products__empty">
          <p>No products found{search ? ` for "${search}"` : ""}.</p>
        </div>
      ) : (
        <div className="home__grid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              showSellerControls={isSeller()}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;