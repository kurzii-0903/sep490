import React, { useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import "./style.css";

const Cart = () => {
    const { cartItems, totalPrice, setCartItems } = useContext(CartContext);

    const handleQuantityChange = (id, delta) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const handleRemove = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    return (
        <div className="cart-page">
            <div className="cart-page-content">
                <div className="cart-page-left">
                    <div className="max-w-6xl mx-auto p-4">
                        <h2 className="cart-page-title">Giỏ hàng của bạn</h2>
                        <table className="w-full text-left border-collapse custom-table">
                            <thead>
                            <tr className="cart-header">
                                <th className="p-2">THÔNG TIN SẢN PHẨM</th>
                                <th className="p-2 price-column">ĐƠN GIÁ</th>
                                <th className="p-2 quantity-column">SỐ LƯỢNG</th>
                                <th className="p-2">THÀNH TIỀN</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-9 flex items-center gap-20">
                                        <img src={item.productImages?.[0]?.image || "/images/default.png"} alt={item.name} className="w-16 h-16" />
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-gray-500 text-sm">
                                                {item.size} / {item.color}
                                            </p>
                                            <button
                                                className="text-red-500 text-sm mt-1"
                                                onClick={() => handleRemove(item.id)}
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
                                                onClick={() => handleQuantityChange(item.id, -1)}
                                            >
                                                -
                                            </button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <button
                                                className="border px-2"
                                                onClick={() => handleQuantityChange(item.id, 1)}
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
                    </div>
                </div>
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
            </div>
        </div>
    );
};

export default Cart;