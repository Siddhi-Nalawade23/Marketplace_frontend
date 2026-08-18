import { useState } from "react";
import { INDIAN_STATES } from "../data/indianStates";
import "./AddressModal.css";

const PHONE_REGEX = /^[6-9]\d{9}$/;
const PINCODE_REGEX = /^\d{6}$/;

function AddressModal({ onClose, onConfirm }) {
  const [form, setForm] = useState({
    shipping_name: "",
    shipping_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_pincode: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.shipping_name.trim()) next.shipping_name = "Name is required";
    if (!PHONE_REGEX.test(form.shipping_phone)) next.shipping_phone = "Enter a valid 10-digit mobile number";
    if (!form.shipping_address.trim()) next.shipping_address = "Address is required";
    if (!form.shipping_city.trim()) next.shipping_city = "City is required";
    if (!form.shipping_state) next.shipping_state = "Select a state";
    if (!PINCODE_REGEX.test(form.shipping_pincode)) next.shipping_pincode = "Enter a valid 6-digit pincode";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onConfirm(form);
    }
  };

  return (
    <div className="address-modal__overlay" onClick={onClose}>
      <div className="address-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="address-modal__title">Shipping Details</h3>
        <p className="address-modal__subtitle">Where should we send your order?</p>

        <form className="address-modal__form" onSubmit={handleSubmit}>
          <div className="address-modal__field">
            <label>Full Name</label>
            <input
              type="text"
              value={form.shipping_name}
              onChange={handleChange("shipping_name")}
              placeholder="e.g. Priya Sharma"
            />
            {errors.shipping_name && <span className="address-modal__error">{errors.shipping_name}</span>}
          </div>

          <div className="address-modal__field">
            <label>Phone Number</label>
            <input
              type="tel"
              value={form.shipping_phone}
              onChange={handleChange("shipping_phone")}
              placeholder="e.g. 9876543210"
              maxLength={10}
            />
            {errors.shipping_phone && <span className="address-modal__error">{errors.shipping_phone}</span>}
          </div>

          <div className="address-modal__field">
            <label>Address</label>
            <input
              type="text"
              value={form.shipping_address}
              onChange={handleChange("shipping_address")}
              placeholder="House no, street, locality"
            />
            {errors.shipping_address && <span className="address-modal__error">{errors.shipping_address}</span>}
          </div>

          <div className="address-modal__row">
            <div className="address-modal__field">
              <label>City</label>
              <input
                type="text"
                value={form.shipping_city}
                onChange={handleChange("shipping_city")}
                placeholder="e.g. Pune"
              />
              {errors.shipping_city && <span className="address-modal__error">{errors.shipping_city}</span>}
            </div>

            <div className="address-modal__field">
              <label>Pincode</label>
              <input
                type="text"
                value={form.shipping_pincode}
                onChange={handleChange("shipping_pincode")}
                placeholder="e.g. 411001"
                maxLength={6}
              />
              {errors.shipping_pincode && <span className="address-modal__error">{errors.shipping_pincode}</span>}
            </div>
          </div>

          <div className="address-modal__field">
            <label>State</label>
            <select value={form.shipping_state} onChange={handleChange("shipping_state")}>
              <option value="">Select state</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.shipping_state && <span className="address-modal__error">{errors.shipping_state}</span>}
          </div>

          <div className="address-modal__actions">
            <button type="button" className="address-modal__cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="address-modal__confirm">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddressModal;