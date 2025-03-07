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
        const savedCartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
        console.log("Loaded cart items from sessionStorage:", savedCartItems);
        setCartItems(savedCartItems);
    }, [setCartItems]);

    useEffect(() => {
        console.log("Saving cart items to sessionStorage:", cartItems);
        sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
        setCartCount(cartItems.length);
    }, [cartItems]);

    const handleToastClose = () => {
        showToast(null);
    };

    const isCheckoutPage = location.pathname === "/checkout";

    return (
        <div className="main-container">
            {!isCheckoutPage && <Header cartCount={cartCount} cartItems={cartItems} showToast={showToast} />}
            {!isCheckoutPage && location.pathname !== "/" && <Breadcrumb />}
            <main className="main-content">
                <Outlet context={{ addToCart }} />
            </main>
            {!isCheckoutPage && <Footer />}
            {toast && (
                <Toast message={toast} onClose={handleToastClose} />
            )}
        </div>
    );
};

export default CustomerLayout;