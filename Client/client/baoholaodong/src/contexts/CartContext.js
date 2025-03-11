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
            sessionStorage.setItem("cartItems", JSON.stringify(updatedItems)); // Cập nhật sessionStorage ngay sau khi thêm vào giỏ hàng
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

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.filter(item => item.id !== productId);
            sessionStorage.setItem("cartItems", JSON.stringify(updatedItems));
            return updatedItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        try {
            sessionStorage.removeItem("cartItems");
        } catch (error) {
            console.error("Failed to clear cart items from sessionStorage:", error);
        }
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, totalPrice, addToCart, updateCartItemQuantity, removeFromCart, showToast, toast, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
