import React, { useState, useEffect, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import Toast from "../components/toast";
import Breadcrumb from "../components/breadcrumb";
import { CartContext } from "../contexts/CartContext";

const CustomerLayout = () => {
    const { addToCart, cartItems, setCartItems, showToast, toast } = useContext(CartContext);
    const [cartCount, setCartCount] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCartItems(savedCartItems);
    }, [setCartItems]);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        setCartCount(cartItems.length);
    }, [cartItems]);

    const handleToastClose = () => {
        showToast(null);
    };

    return (
        <div className="main-container">
            <Header cartCount={cartCount} cartItems={cartItems} showToast={showToast} />
            {location.pathname !== "/" && <Breadcrumb />}
            <main className="main-content">
                <Outlet context={{ addToCart }} />
            </main>
            <Footer />
            {toast && (
                <Toast message={toast} onClose={handleToastClose} />
            )}
        </div>
    );
};

export default CustomerLayout;