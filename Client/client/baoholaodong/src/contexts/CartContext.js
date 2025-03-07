import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        console.log("useEffect for loading cart items from localStorage triggered");
        try {
            const savedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            setCartItems(savedCartItems);
            updateTotalPrice(savedCartItems); // Update total price based on loaded items
            console.log("Loaded cart items from localStorage:", savedCartItems);
        } catch (error) {
            console.error("Failed to load cart items from localStorage:", error);
        }
    }, []);

    useEffect(() => {
        console.log("useEffect for saving cart items to localStorage triggered");
        try {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            console.log("Saved cart items to localStorage:", cartItems);
        } catch (error) {
            console.error("Failed to save cart items to localStorage:", error);
        }
        updateTotalPrice(cartItems); // Update total price based on current items
    }, [cartItems]);

    const updateTotalPrice = (items) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    const addToCart = (product) => {
        const price = product.discount > 0 ? product.price - product.discount : product.price;
        const quantity = product.selectedVariant ? product.quantity : 1;
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);
            let updatedItems;
            if (existingItem) {
                updatedItems = prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity, price } : item
                );
            } else {
                updatedItems = [...prevItems, { ...product, quantity, price }];
            }
            console.log("Updated cart items:", updatedItems);
            return updatedItems;
        });
        showToast("Sản phẩm đã được thêm vào giỏ hàng");
    };

    const updateCartItemQuantity = (productId, quantity) => {
        setCartItems((prevItems) => {
            return prevItems.map(item =>
                item.id === productId ? { ...item, quantity: parseInt(quantity) } : item
            );
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, totalPrice, addToCart, updateCartItemQuantity, removeFromCart, showToast, toast }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;