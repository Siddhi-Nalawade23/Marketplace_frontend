import { Link } from "react-router-dom";
import { addToCart } from "../api/cart";
import { useToast } from "./Toast";
import "./ProductCard.css";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGFwdG9wfGVufDB8fDB8fHww";

function ProductCard({ product, showSellerControls, onDelete }) {
  const showToast = useToast();

  const handleAddToCart = () => {
    addToCart(product.id, 1)
      .then(() => showToast(`${product.name} added to cart`, "success"))
      .catch((err) => {
        if (err.response?.status === 401) {
          showToast("Please log in first", "error");
        } else {
          showToast("Failed to add to cart", "error");
        }
      });
  };

  const inStock = product.stock > 0;

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.image_url || DEFAULT_IMAGE}
          alt={product.name}
          className="product-card__image"
        />
        <span className={`product-card__stamp ${inStock ? "product-card__stamp--ok" : "product-card__stamp--out"}`}>
          {inStock ? "In Stock" : "Sold Out"}
        </span>
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>

        <div className="product-card__perforation" />

        <div className="product-card__footer">
          <span className="product-card__price">₹{product.price}</span>
          {!showSellerControls && (
            <button className="product-card__button" onClick={handleAddToCart} disabled={!inStock}>
              Add to Cart
            </button>
          )}
        </div>

        {showSellerControls && (
          <div className="product-card__seller-controls">
            <Link to={`/admin/products/${product.id}/edit`} className="product-card__edit">
              Edit
            </Link>
            <button className="product-card__delete" onClick={onDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;