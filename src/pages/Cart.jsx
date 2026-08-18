import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems, updateCartItem, removeCartItem } from "../api/cart";
import { createOrder } from "../api/orders";
import AddressModal from "../components/AddressModal";
import { useToast } from "../components/Toast";
import "./Cart.css";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  const loadCart = () => {
    getCartItems()
      .then((res) => {
        setCartItems(res.data);
      })
      .catch((err) => {
        console.error("CART ERROR:", err.response?.data || err);
      });
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    updateCartItem(id, quantity).then(loadCart);
  };

  const handleRemove = (id) => {
    removeCartItem(id).then(loadCart);
  };

  const handleConfirmAddress = (shippingDetails) => {
    createOrder(shippingDetails)
      .then(() => {
        setShowAddressModal(false);
        showToast("Order placed successfully", "success");
        navigate("/orders");
      })
      .catch((err) => {
        setShowAddressModal(false);
        showToast(err.response?.data?.error || "Checkout failed", "error");
      });
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (error) return <p className="cart__error">{error}</p>;

  return (
    <div className="cart">
      <div className="cart__header">
        <span className="cart__header-icon">
          <ShoppingCart size={22} />
        </span>
        <h2>Your Cart</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart__empty">
          <ShoppingCart size={36} />
          <p>Your cart is empty.</p>
          <button className="cart__browse" onClick={() => navigate("/products")}>
            Browse products
          </button>
        </div>
      ) : (
        <>
          <div className="cart__list">
            {cartItems.map((item) => (
              <div className="cart__item" key={item.id}>
                <span className="cart__item-name">{item.product.name}</span>

                <div className="cart__item-controls">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="cart__item-qty">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <span className="cart__item-price">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </span>

                <button
                  className="cart__item-remove"
                  onClick={() => handleRemove(item.id)}
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart__summary">
            <div className="cart__total">
              <span>Total</span>
              <span className="cart__total-amount">₹{total.toFixed(2)}</span>
            </div>
            <button className="cart__checkout" onClick={() => setShowAddressModal(true)}>
              Checkout
            </button>
          </div>
        </>
      )}

      {showAddressModal && (
        <AddressModal
          onClose={() => setShowAddressModal(false)}
          onConfirm={handleConfirmAddress}
        />
      )}
    </div>
  );
}

export default Cart;