import React, { useState, useEffect, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import Toast from "../components/toast";
import { CartContext } from "../contexts/CartContext";

const CustomerLayout = ({config}) => {
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

    const params = new URLSearchParams(location.search);
    const isCheckoutPage = location.pathname === "/checkout";
    const isRegisterPage = location.pathname === "/register";
    const isSigninPage = location.pathname === "/login";
    const isDone = params.get("done") === "true";
    const shouldHideHeaderFooter = (isCheckoutPage && isDone) || isRegisterPage || isSigninPage;

    return (
        <div className="flex flex-col min-h-screen">
            {!shouldHideHeaderFooter && (
                <Header config ={config} cartCount={cartCount} cartItems={cartItems} showToast={showToast} />
            )}
            {/*{!isCheckoutPage && location.pathname !== "/" && <Breadcrumb />}*/}
            <main className="flex-1">
                <Outlet context={{ addToCart }} />
            </main>
            {!shouldHideHeaderFooter && <Footer config={config} />}
            {toast && <Toast message={toast} onClose={handleToastClose} />}
        </div>
    );
};

export default CustomerLayout;