import "./Home.css";
import house from "../assets/house.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
    const navigate = useNavigate();
    const [showBanner, setShowBanner] = useState(true);
    return (
        <div className="home">
            <div className="Banu">
                {showBanner && (
                    <div className="Banner">
                        <button
                            className="Banner__close"
                            onClick={() => setShowBanner(false)}
                        >
                            ×
                        </button>

                        <div className="Banner__image">
                            <img src={house} alt="house" width={40} height={40} />
                        </div>

                        <div className="Banner__content">
                            <h3 className="home__title">
                                Welcome to MARKETPLACE!
                            </h3>

                            <p className="home__description">
                                Use your dashboard to quickly access your content,
                                search for products, and manage your orders.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="collection">
                <h2>My Collections</h2>
                <p>View the Products that have been added to your account</p>
                <div className="collection__badge">
                    <h3>These Products are Buyable</h3>
                    <span>We are able to open these books and go on the different pages..and we love it!</span>
                    <br />
                    <button
                        className="collection__button"
                        onClick={() => navigate("/products")}
                    >
                        View collection
                    </button>
                </div>
            </div>
            <div className="home-get-started">
                <h2>Get Started</h2>
                <p>New here? These are the great places to start!</p>
                <div className="home__main-div">

                    <div className="child" onClick={() => navigate("/products")}>
                        <span style={{ fontWeight: 'bold' }}>Products</span>
                        <p>Explore the products available</p>
                    </div>
                    <div className="child" onClick={() => navigate("/search")}>
                        <span style={{ fontWeight: 'bold' }}>Search</span>
                        <p>Search for products and services</p>
                    </div>
                    <div className="child" onClick={() => navigate("/cart")}>
                        <span style={{ fontWeight: 'bold' }}>My Cart</span>
                        <p>Access your cart to manage your items</p>
                    </div>
                </div>
            </div>



        </div>
    )
}
export default Home;