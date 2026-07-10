import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../api/orders";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError(err.message);
        }
      });
  }, []);

  if (error) return <p className="orders__error">{error}</p>;

  return (
    <div className="orders">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div className="orders__card" key={order.id}>
            <div className="orders__card-header">
              <span>Order #{order.id}</span>
              <span className="orders__status">{order.status}</span>
            </div>
            <ul className="orders__items">
              {order.order_items.map((item) => (
                <li key={item.id}>
                  {item.product.name} × {item.quantity} — ₹
                  {(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="orders__total">
              Total: ₹{parseFloat(order.total).toFixed(2)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;