import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../api/products";
import { getReviews, createReview, updateReview, createReply, updateReply } from "../api/reviews";
import { addToCart } from "../api/cart";
import { getCurrentUser } from "../api/authHelpers";
import { useToast } from "../components/Toast";
import "./ProductDetail.css";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGFwdG9wfGVufDB8fDB8fHww";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const currentUser = getCurrentUser();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [openReplyFor, setOpenReplyFor] = useState(null);

  const loadProduct = () => {
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.message));
  };

  const loadReviews = () => {
    getReviews(id)
      .then((res) => setReviews(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const myReview = reviews.find((r) => r.user.id === currentUser?.id);

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating || 5);
      setComment(myReview.comment || "");
    }
  }, [myReview?.id]);

  const isSeller = currentUser?.role === "seller";
  const ownsProduct = isSeller && product && product.user_id === currentUser.id;

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

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please log in to leave a review", "error");
      return;
    }

    const action = myReview
      ? updateReview(id, myReview.id, { rating, comment })
      : createReview(id, { rating, comment });

    action
      .then(() => {
        showToast(myReview ? "Review updated" : "Review posted", "success");
        loadReviews();
      })
      .catch((err) => {
        showToast(err.response?.data?.errors?.join(", ") || "Failed to submit review", "error");
      });
  };

  const handleReplyChange = (reviewId, value) => {
    setReplyDrafts((prev) => ({ ...prev, [reviewId]: value }));
  };

  const handleSubmitReply = (review) => {
    const text = replyDrafts[review.id];
    if (!text || !text.trim()) return;

    const action = review.reply
      ? updateReply(review.id, text)
      : createReply(review.id, text);

    action
      .then(() => {
        showToast(review.reply ? "Reply updated" : "Reply posted", "success");
        setOpenReplyFor(null);
        loadReviews();
      })
      .catch((err) => {
        showToast(err.response?.data?.error || err.response?.data?.errors?.join(", ") || "Failed to post reply", "error");
      });
  };

  const openReplyBox = (review) => {
    setReplyDrafts((prev) => ({ ...prev, [review.id]: review.reply?.comment || "" }));
    setOpenReplyFor(review.id);
  };

  if (error) return <p className="product-detail__error">{error}</p>;
  if (!product) return <p className="product-detail__loading">Loading...</p>;

  return (
    <div className="product-detail">
      <button className="product-detail__back" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="product-detail__main">
        <img
          src={product.image_url || DEFAULT_IMAGE}
          alt={product.name}
          className="product-detail__image"
        />

        <div className="product-detail__info">
          <h1 className="product-detail__name">{product.name}</h1>
          <p className="product-detail__description">{product.description}</p>
          <p className="product-detail__price">₹{product.price}</p>
               {product.stock > 0 && product.stock <= 5 && (
  <p className="product-detail__stock-warning">Only {product.stock} left in stock!</p>
)} 
          {!isSeller && (
            <button className="product-detail__add-btn" onClick={handleAddToCart} disabled={product.stock <= 0}>
              {product.stock > 0 ? "Add to Cart" : "Sold Out"}
            </button>
          )}
        </div>
      </div>

      <div className="product-detail__reviews">
        <h2 className="product-detail__reviews-title">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {!isSeller && currentUser && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3 className="review-form__title">
              {myReview ? "Edit your review" : "Write a review"}
            </h3>

            <div className="review-form__rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`review-form__star ${star <= rating ? "review-form__star--filled" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="review-form__textarea"
              placeholder="Share your thoughts about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />

            <button type="submit" className="review-form__submit">
              {myReview ? "Update Review" : "Post Review"}
            </button>
          </form>
        )}

        <div className="review-list">
          {reviews.length === 0 ? (
            <p className="review-list__empty">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div className="review-card" key={r.id}>
                <div className="review-card__header">
                  <span className="review-card__name">{r.user.name}</span>
                  <span className="review-card__stars">
                    {"★".repeat(r.rating || 0)}
                    {"☆".repeat(5 - (r.rating || 0))}
                  </span>
                </div>
                <p className="review-card__comment">{r.comment}</p>

                {r.reply && (
                  <div className="review-reply">
                    <span className="review-reply__label">Seller reply</span>
                    <p className="review-reply__comment">{r.reply.comment}</p>
                  </div>
                )}

                {ownsProduct && (
                  <div className="review-reply-box">
                    {openReplyFor === r.id ? (
                      <>
                        <textarea
                          className="review-reply-box__textarea"
                          placeholder="Write a reply to this review..."
                          value={replyDrafts[r.id] || ""}
                          onChange={(e) => handleReplyChange(r.id, e.target.value)}
                        />
                        <div className="review-reply-box__actions">
                          <button
                            className="review-reply-box__cancel"
                            onClick={() => setOpenReplyFor(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="review-reply-box__submit"
                            onClick={() => handleSubmitReply(r)}
                          >
                            {r.reply ? "Update Reply" : "Post Reply"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        className="review-reply-box__toggle"
                        onClick={() => openReplyBox(r)}
                      >
                        {r.reply ? "Edit reply" : "Reply to this review"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;