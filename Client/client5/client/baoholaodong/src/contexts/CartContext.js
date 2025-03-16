import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => { // Lấy dữ liệu giỏ hàng từ sessionStorage khi trang load
        try {
            return JSON.parse(sessionStorage.getItem("cartItems")) || [];
        } catch (error) {
            console.error("Failed to load cart items from sessionStorage:", error);
            return [];
        }
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        updateTotalPrice(cartItems);
    }, [cartItems]);

    useEffect(() => {
        try {
            sessionStorage.setItem("cartItems", JSON.stringify(cartItems)); // Lưu giỏ hàng vào sessionStorage mỗi khi thay đổi
        } catch (error) {
            console.error("Failed to save cart items to sessionStorage:", error);
        }
    }, [cartItems]);

    const updateTotalPrice = (items) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    const addToCart = (product) => {
        const price = product.discount > 0 ? product.price - product.discount : product.price;
        const quantity = product.selectedVariant ? product.quantity : 1;
        const variantKey = product.selectedVariant ? JSON.stringify(product.selectedVariant) : '';

        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id && JSON.stringify(item.selectedVariant) === variantKey);
            let updatedItems;
            if (existingItem) {
                updatedItems = prevItems.map(item =>
                    item.id === product.id && JSON.stringify(item.selectedVariant) === variantKey
                        ? { ...item, quantity: item.quantity + quantity, price }
                        : item
                );
            } else {
                updatedItems = [...prevItems, { ...product, quantity, price, selectedVariant: product.selectedVariant }];
            }
            sessionStorage.setItem("cartItems", JSON.stringify(updatedItems));
            return updatedItems;
        });
        showToast("Sản phẩm đã được thêm vào giỏ hàng");
    };

    const updateCartItemQuantity = (productId, quantity) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map(item =>
                item.id === productId ? { ...item, quantity: parseInt(quantity) } : item
            );
            sessionStorage.setItem("cartItems", JSON.stringify(updatedItems));
            return updatedItems;
        });
    };

    const removeFromCart = (productId, selectedVariant) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.filter(item =>
                item.id !== productId || JSON.stringify(item.selectedVariant) !== JSON.stringify(selectedVariant)
            );
            sessionStorage.setItem("cartItems", JSON.stringify(updatedItems));
            return updatedItems;
        });
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
