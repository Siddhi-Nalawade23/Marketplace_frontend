import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { deleteProduct } from "../api/products";
import { isSeller } from "../api/authHelpers";
import ProductCard from "../components/ProductCard";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const loadProducts = () => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;

    deleteProduct(id)
      .then(() => {
        loadProducts();
      })
      .catch((err) => {
        console.log("Delete error:", err.response || err);
        alert(err.response?.data?.error || "Failed to delete product");
      });
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="home">
      <h1 className="home__title">Marketplace</h1>
      {products.length === 0 ? (
        <p>No products yet.</p>
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

export default Home;