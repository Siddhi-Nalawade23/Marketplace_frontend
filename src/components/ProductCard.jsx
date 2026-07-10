import { addToCart } from "../api/cart";
import "./Style.css";

function ProductCard({ product }) {
    const loadCart = () => {
  getCartItems()
    .then((res) => {
      console.log("Cart response:", res.data);
      setCartItems(res.data);
    })
    .catch((err) => {
      console.log("Cart error:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError(err.message);
      }
    });
};
  const handleAddToCart = () => {
    addToCart(product.id, 1)
      .then(() => alert(`${product.name} added to cart`))
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("Please log in first");
        } else {
          alert("Failed to add to cart");
        }
      });
  };

  return (
    <div className="product-card">
      <div className="product-card__image-placeholder" />
      <h3 className="product-card__name">{product.name}</h3>
      <p className="product-card__description">{product.description}</p>
      <p className="product-card__price">₹{product.price}</p>
      <button className="product-card__button" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;