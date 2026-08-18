import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getCurrentUser, isSeller } from "../api/authHelpers";
import {
    House, Package, Search, ShoppingCart, ArrowRight, X,
    PlusCircle, ClipboardList, LayoutGrid,
} from "lucide-react";

function Home() {
    const navigate = useNavigate();
    const [showBanner, setShowBanner] = useState(true);
    const user = getCurrentUser();
    const seller = isSeller();

    return (
        <div className="home">
            {showBanner && (
                <div className="welcome-banner">
                    <div className="welcome-banner__icon">
                        <House size={20} />
                    </div>

                    <div className="welcome-banner__content">
                        <h1 className="welcome-banner__title">
                            {seller ? `Welcome back${user?.name ? `, ${user.name}` : ""}` : "Welcome to Marketplace"}
                        </h1>
                        <p className="welcome-banner__text">
                            {seller
                                ? "Manage your listings, track incoming orders, and keep your storefront up to date."
                                : "Use your dashboard to quickly access your content, search for products, and manage your orders."}
                        </p>
                    </div>

                    <button
                        className="welcome-banner__close"
                        onClick={() => setShowBanner(false)}
                        aria-label="Dismiss welcome banner"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {seller ? (
                <>
                    <section className="home-section">
                        <div className="home-section__header">
                            <h2>Your Storefront</h2>
                            <p>Add new products or review what's currently listed</p>
                        </div>

                        <button
                            className="collection-panel collection-panel--seller"
                            onClick={() => navigate("/admin/products")}
                        >
                            <span className="collection-panel__pattern" aria-hidden="true" />
                            <span className="collection-panel__eyebrow">Seller tools</span>
                            <h3>Manage your listings</h3>
                            <p>Add new products, update stock and pricing, or retire old listings.</p>
                            <span className="collection-panel__cta">
                                Go to listings <ArrowRight size={16} />
                            </span>
                        </button>
                    </section>

                    <section className="home-section">
                        <div className="home-section__header">
                            <h2>Quick Actions</h2>
                            <p>Everything you need to run your storefront</p>
                        </div>

                        <div className="quick-links">
                            <button className="quick-link quick-link--seller" onClick={() => navigate("/admin/products")}>
                                <span className="quick-link__icon quick-link__icon--seller"><PlusCircle size={18} /></span>
                                <span className="quick-link__title">Add Product</span>
                                <span className="quick-link__desc">List a new item for sale</span>
                                <ArrowRight className="quick-link__arrow" size={16} />
                            </button>

                            <button className="quick-link quick-link--seller" onClick={() => navigate("/products")}>
                                <span className="quick-link__icon quick-link__icon--seller"><LayoutGrid size={18} /></span>
                                <span className="quick-link__title">My Listings</span>
                                <span className="quick-link__desc">View and edit your products</span>
                                <ArrowRight className="quick-link__arrow" size={16} />
                            </button>

                            <button className="quick-link quick-link--seller" onClick={() => navigate("/search")}>
                                <span className="quick-link__icon quick-link__icon--seller"><Search size={18} /></span>
                                <span className="quick-link__title">Search</span>
                                <span className="quick-link__desc">Search for product</span>
                                <ArrowRight className="quick-link__arrow" size={16} />
                            </button>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    <section className="home-section">
                        <div className="home-section__header">
                            <h2>My Collections</h2>
                            <p>View the products that have been added to your account</p>
                        </div>

                        <button className="collection-panel" onClick={() => navigate("/products")}>
                            <span className="collection-panel__pattern" aria-hidden="true" />
                            <span className="collection-panel__eyebrow">Buyable now</span>
                            <h3>Everything in one place</h3>
                            <p>Browse the full catalog and add items straight to your cart.</p>
                            <span className="collection-panel__cta">
                                View collection <ArrowRight size={16} />
                            </span>
                        </button>
                    </section>

                    <section className="home-section">
                        <div className="home-section__header">
                            <h2>Get Started</h2>
                            <p>New here? These are the great places to start.</p>
                        </div>

                        <div className="quick-links">
                            <button className="quick-link" onClick={() => navigate("/products")}>
                                <span className="quick-link__icon"><Package size={18} /></span>
                                <span className="quick-link__title">Products</span>
                                <span className="quick-link__desc">Explore the products available</span>
                                <ArrowRight className="quick-link__arrow" size={16} />
                            </button>

                            <button className="quick-link" onClick={() => navigate("/search")}>
                                <span className="quick-link__icon"><Search size={18} /></span>
                                <span className="quick-link__title">Search</span>
                                <span className="quick-link__desc">Search for products and services</span>
                                <ArrowRight className="quick-link__arrow" size={16} />
                            </button>

                            <button className="quick-link" onClick={() => navigate("/cart")}>
                                <span className="quick-link__icon"><ShoppingCart size={18} /></span>
                                <span className="quick-link__title">My Cart</span>
                                <span className="quick-link__desc">Access your cart to manage your items</span>
                                <ArrowRight className="quick-link__arrow" size={16} />
                            </button>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

export default Home;