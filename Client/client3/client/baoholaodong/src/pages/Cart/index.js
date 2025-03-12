import React, { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import "./style.css";

const Cart = () => {
    const { cartItems, setCartItems } = useContext(CartContext);
    const [selectedItems, setSelectedItems] = useState([]);

    const handleQuantityChange = (id, selectedVariant, delta) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id && JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const handleRemove = (id, selectedVariant) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id || JSON.stringify(item.selectedVariant) !== JSON.stringify(selectedVariant)));
    };

    const handleSelectItem = (id, selectedVariant) => {
        const itemKey = `${id}-${JSON.stringify(selectedVariant)}`;
        setSelectedItems((prevSelected) =>
            prevSelected.includes(itemKey)
                ? prevSelected.filter((key) => key !== itemKey)
                : [...prevSelected, itemKey]
        );
    };

    const totalPrice = cartItems
        .filter((item) => selectedItems.includes(`${item.id}-${JSON.stringify(item.selectedVariant)}`))
        .reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="cart-page">
            <div className="cart-page-content">
                <div className="cart-page-left">
                    <h2 className="cart-page-title">Giỏ hàng của bạn</h2>
                    <div className="max-w-6xl mx-auto p-4">
                        {cartItems.length === 0 ? (
                            <div className="empty-cart">
                                <img src="https://bizweb.dktcdn.net/100/490/431/themes/927074/assets/empty-cart.png?1717815949845" alt="Empty Cart" className="empty-cart-image" />
                                <span className="empty-message">Không có sản phẩm nào trong giỏ hàng của bạn</span>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse custom-table">
                                <thead>
                                <tr className="cart-header">
                                    <th className="p-2">CHỌN</th>
                                    <th className="p-2">THÔNG TIN SẢN PHẨM</th>
                                    <th className="p-2 price-column">ĐƠN GIÁ</th>
                                    <th className="p-2 quantity-column">SỐ LƯỢNG</th>
                                    <th className="p-2">THÀNH TIỀN</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cartItems.map((item) => (
                                    <tr key={`${item.id}-${JSON.stringify(item.selectedVariant)}`} className="border-b">
                                        <td className="p-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(`${item.id}-${JSON.stringify(item.selectedVariant)}`)}
                                                onChange={() => handleSelectItem(item.id, item.selectedVariant)}
                                            />
                                        </td>
                                        <td className="p-9 flex items-center gap-20">
                                            <img src={item.productImages?.[0]?.image || "/images/default.png"} alt={item.name} className="w-16 h-16" />
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                {item.selectedVariant && (
                                                    <p className="text-gray-500 text-sm">
                                                        {item.selectedVariant.Size && item.selectedVariant.Color && (
                                                            <span>{item.selectedVariant.Size} / {item.selectedVariant.Color}</span>
                                                        )}
                                                    </p>
                                                )}
                                                <button
                                                    className="text-red-500 text-sm mt-1"
                                                    onClick={() => handleRemove(item.id, item.selectedVariant)}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-2 text-red-500 font-bold price-column">{item.price.toLocaleString()}đ</td>
                                        <td className="p-2 quantity-column">
                                            <div className="flex items-center">
                                                <button
                                                    className="border px-2"
                                                    onClick={() => handleQuantityChange(item.id, item.selectedVariant, -1)}
                                                >
                                                    -
                                                </button>
                                                <span className="mx-2">{item.quantity}</span>
                                                <button
                                                    className="border px-2"
                                                    onClick={() => handleQuantityChange(item.id, item.selectedVariant, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-2 text-red-500 font-bold">
                                            {(item.price * item.quantity).toLocaleString()}đ
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                {cartItems.length > 0 && (
                    <div className="cart-page-right">
                        <div className="cart-summary-header">
                            <div>Thông tin đơn hàng</div>
                        </div>
                        <div className="cart-summary-content">
                            <div className="cart-summary-section">
                                <div>Tổng tiền</div>
                                <div className="price">{totalPrice.toLocaleString()}đ</div>
                            </div>
                            <div className="cart-summary-group">
                                <div className="cart-summary-section">
                                    <div>Giảm giá</div>
                                    <div className="small-light-text">Áp dụng tại trang thanh toán</div>
                                </div>
                                <div className="cart-summary-section">
                                    <div>Phí vận chuyển</div>
                                    <div className="small-light-text">Được tính tại trang thanh toán</div>
                                </div>
                            </div>
                            <a href="/checkout" className="cart-summary-button">Thanh toán</a>
                            <a href="/" className="cart-summary-button continue">Tiếp tục mua hàng</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;