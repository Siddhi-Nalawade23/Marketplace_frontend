import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems, updateCartItem, removeCartItem } from "../api/cart";
import { createOrder } from "../api/orders";
import AddressModal from "../components/AddressModal";
import { useToast } from "../components/Toast";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  const loadCart = () => {
    getCartItems()
      .then((res) => setCartItems(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError(err.message);
        }
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
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart__item" key={item.id}>
              <span className="cart__item-name">{item.product.name}</span>
              <div className="cart__item-controls">
                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
              </div>
              <span className="cart__item-price">
                ₹{(item.product.price * item.quantity).toFixed(2)}
              </span>
              <button className="cart__item-remove" onClick={() => handleRemove(item.id)}>
                Remove
              </button>
            </div>
          ))}
          <div className="cart__total">Total: ₹{total.toFixed(2)}</div>
          <button className="cart__checkout" onClick={() => setShowAddressModal(true)}>
            Checkout
          </button>
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