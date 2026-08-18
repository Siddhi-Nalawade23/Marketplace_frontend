import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../api/products";
import { updateProduct } from "../api/products";
import { getCategories } from "../api/adminProducts";
import { isSeller } from "../api/authHelpers";
import "./Auth.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSeller()) {
      navigate("/");
      return;
    }

    Promise.all([getProduct(id), getCategories()])
      .then(([productRes, categoriesRes]) => {
        const p = productRes.data;
        setName(p.name);
        setDescription(p.description || "");
        setPrice(p.price);
        setStock(p.stock);
        setCategoryId(p.category_id);
        setImageUrl(p.image_url || "");
        setCategories(categoriesRes.data);
        setLoading(false);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    updateProduct(id, {
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="auth">
      <h2>Edit Product</h2>
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
        <button type="submit" className="loginbtn">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProduct;