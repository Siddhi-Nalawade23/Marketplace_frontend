import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, getCategories } from "../api/adminProducts";
import { isSeller } from "../api/authHelpers";
import "./Auth.css";

function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    if (!isSeller()) {
      navigate("/");
      return;
    }
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    createProduct({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category_id: categoryId,
      image_url: imageUrl,

    })
      .then(() => navigate("/"))
      .catch((err) => {
        const messages = err.response?.data?.errors?.join(", ") || err.message;
        setError(messages);
      });
  };

  return (
    <div className="auth">
      <h2>Add Product</h2>
      {error && <p className="auth__error">{error}</p>}
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
  type="text"
  placeholder="Image URL (optional)"
  value={imageUrl}
  onChange={(e) => setImageUrl(e.target.value)}
/>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;