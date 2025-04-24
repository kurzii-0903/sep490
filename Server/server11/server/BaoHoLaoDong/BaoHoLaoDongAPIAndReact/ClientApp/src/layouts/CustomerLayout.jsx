import React, { useState, useEffect, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import Toast from "../components/toast";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const CustomerLayout = () => {
    const { addToCart, cartItems, setCartItems, showToast, toast } = useContext(CartContext);
    const { user, setUser, fetchUser } = useContext(AuthContext);
    const [cartCount, setCartCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFetched, setIsFetched] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const protectedRoutes = [
        "/checkout",
        "/order-history",
        "/confirm-order",
        "/customer-profile",
    ];
    const publicRoutes = [
        "/",
        "/products",
        "/products/:slug",
        "/blogs",
        "/blogs/:slug",
        "/about",
        "/contact",
        "/cart",
        "/register",
        "/login",
        "/forgot-password",
        "/reset-password",
        "/verification",
        "/logout",
        "/feedback/:slug",
        "/products/:group/:cate/:slug",
        "/category/:categoryId",
    ];

    const isRouteMatch = (routePattern, pathname) => {
        const regex = new RegExp(
            `^${routePattern.replace(/:[^/]+/g, "[^/]+")}$`
        );
        return regex.test(pathname);
    };

    useEffect(() => {
        const handleFetchUser = async () => {
            if (isFetched) return;
            setIsLoading(true);
            try {
                const userData = await fetchUser();
                if (!userData && protectedRoutes.some((route) => isRouteMatch(route, location.pathname))) {
                    navigate("/login");
                }
                setError(null);
            } catch (error) {
                if (error.response?.status === 401) {
                    setUser(null);
                    if (protectedRoutes.some((route) => isRouteMatch(route, location.pathname))) {
                        navigate("/login");
                    }
                } else {
                    console.error("Không lấy được thông tin người dùng:", error);
                    setError("Không thể xác thực người dùng.");
                }
            } finally {
                setIsLoading(false);
                setIsFetched(true);
            }
        };

        const isProtected = protectedRoutes.some((route) =>
            isRouteMatch(route, location.pathname)
        );
        const isPublic = publicRoutes.some((route) =>
            isRouteMatch(route, location.pathname)
        );

        if (isProtected || location.pathname === "/") {
            handleFetchUser();
        } else if (isPublic) {
            if (user && !["/register", "/login", "/forgot-password", "/reset-password", "/verification", "/logout"].includes(location.pathname)) {
                handleFetchUser();
            } else {
                setIsLoading(false);
                setError(null);
                setIsFetched(true);
            }
        } else {
            setIsLoading(false);
            setError(null);
            setUser(null);
            setIsFetched(true);
        }
    }, [location.pathname, user, fetchUser, navigate]);

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
    const shouldHideHeaderFooter =
        (isCheckoutPage && isDone) || isRegisterPage || isSigninPage;

    return (
        <div className="flex flex-col min-h-screen">
            {isLoading ? (
                <div className="flex items-center justify-center w-full h-full">
                    <span>Loading...</span>
                </div>
            ) : error && protectedRoutes.some((route) => isRouteMatch(route, location.pathname)) ? (
                <div className="flex items-center justify-center w-full h-full text-red-600">
                    <span>{error}</span>
                </div>
            ) : (
                <>
                    {!shouldHideHeaderFooter && (
                        <Header cartCount={cartCount} cartItems={cartItems} showToast={showToast} />
                    )}
                    <main className="flex-1">
                        <Outlet context={{ addToCart }} />
                    </main>
                    {!shouldHideHeaderFooter && <Footer />}
                    {toast && <Toast message={toast} onClose={handleToastClose} />}
                </>
            )}
        </div>
    );
};

export default CustomerLayout;