import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, getCategories } from "../api/adminProducts";
import { isSeller } from "../api/authHelpers";
import "./Auth.css";

import {
  Tag,
  FileText,
  DollarSign,
  Package,
  Grid2X2,
  Image,
  Plus
} from "lucide-react";

function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isSeller()) {
      navigate("/");
      return;
    }

    getCategories().then((res) => setCategories(res.data));
  }, [navigate]);

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
        const messages =
          err.response?.data?.errors?.join(", ") || err.message;

        setError(messages);
      });
  };

  return (
    <div className="auth">
      <div className="add-product-header">
        <div className="add-product-icon">
          <Plus size={20} />
        </div>

        <div>
          <h3>Add Product</h3>
          <p>Fill in the details to add a new product</p>
        </div>
      </div>

      {error && <p className="auth__error">{error}</p>}

      <form className="auth__form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="name">
            <Tag size={18} />
            Product Name
          </label>

          <input
            id="name"
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">
            <FileText size={18} />
            Description
          </label>

          <textarea
            id="description"
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">
            <DollarSign size={18} />
            Price
          </label>

          <input
            id="price"
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">
            <Package size={18} />
            Stock
          </label>

          <input
            id="stock"
            type="number"
            placeholder="Enter stock quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">
            <Grid2X2 size={18} />
            Category
          </label>

          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select category</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">
            <Image size={18} />
            Image URL (optional)
          </label>

          <input
            id="imageUrl"
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <button className="AddBtn" type="submit">
          <Plus size={19} />
          Add Product
        </button>

      </form>
    </div>
  );
}

export default AddProduct;