import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
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
            sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
        } catch (error) {
            console.error("Failed to save cart items to sessionStorage:", error);
        }
    }, [cartItems]);

    const updateTotalPrice = (items) => {
        const total = items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
        setTotalPrice(total);
    };

    const addToCart = (product) => {
        const selectedVariant = product.selectedVariant;
        const basePrice = selectedVariant?.price || product.price;
        const discount = selectedVariant?.discount || product.discount || 0;
        const priceAfterDiscount = selectedVariant?.priceAfterDiscount || product.priceAfterDiscount;

        // Nếu có variant, tính giá dựa trên discount của variant
        const finalPrice = selectedVariant
            ? basePrice - (basePrice * (selectedVariant.discount || 0) / 100)
            : product.finalPrice ||
            (priceAfterDiscount && priceAfterDiscount !== basePrice
                ? priceAfterDiscount
                : discount > 0
                    ? basePrice - (basePrice * discount / 100)
                    : basePrice);

        const availableQuantity = product.quantityInStock || selectedVariant?.quantity || product.quantity;
        const quantity = product.quantity || 1;

        if (quantity > availableQuantity) {
            showToast("Số lượng vượt quá tồn kho!");
            return;
        }

        setCartItems((prevItems) => {
            const variantKey = selectedVariant ? JSON.stringify(selectedVariant) : null;
            const existingItem = prevItems.find((item) => {
                const itemVariantKey = item.selectedVariant ? JSON.stringify(item.selectedVariant) : null;
                return item.id === product.id && itemVariantKey === variantKey;
            });

            let updatedItems;
            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > availableQuantity) {
                    showToast("Số lượng vượt quá tồn kho!");
                    return prevItems;
                }
                updatedItems = prevItems.map((item) =>
                    item.id === product.id &&
                    (item.selectedVariant ? JSON.stringify(item.selectedVariant) : null) === variantKey
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            } else {
                updatedItems = [
                    ...prevItems,
                    {
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        quantity,
                        finalPrice,
                        originalPrice: basePrice,
                        discount,
                        selectedVariant,
                        availableQuantity,
                    },
                ];
            }
            sessionStorage.setItem("cartItems", JSON.stringify(updatedItems));
            return updatedItems;
        });
        showToast("Sản phẩm đã được thêm vào giỏ hàng");
    };


    const updateCartItemQuantity = (productId, quantity, selectedVariant) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map((item) => {
                if (
                    item.id === productId &&
                    (item.selectedVariant ? JSON.stringify(item.selectedVariant) : null) ===
                    (selectedVariant ? JSON.stringify(selectedVariant) : null)
                ) {
                    const availableQuantity = item.availableQuantity || 0;
                    if (quantity > availableQuantity) {
                        showToast("Số lượng vượt quá tồn kho!");
                        return { ...item, quantity: availableQuantity };
                    }
                    return { ...item, quantity: Math.max(1, parseInt(quantity)) };
                }
                return item;
            });
            sessionStorage.setItem("cartItems", JSON.stringify(updatedItems));
            return updatedItems;
        });
    };

    const removeFromCart = (productId, selectedVariant) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.filter(
                (item) => item.id !== productId || JSON.stringify(item.selectedVariant) !== JSON.stringify(selectedVariant)
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
        <CartContext.Provider
            value={{ cartItems, setCartItems, totalPrice, addToCart, updateCartItemQuantity, removeFromCart, showToast, toast }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;