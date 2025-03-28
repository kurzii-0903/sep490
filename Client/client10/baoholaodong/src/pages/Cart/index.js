"use client";
import { useContext, useState } from "react";
import { CartContext } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import "./style.css";
import noImage from "../../images/no-image-product.jpg"; // Thêm import

const Cart = () => {
    const { cartItems, setCartItems } = useContext(CartContext);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();

    const handleQuantityChange = (index, delta) => {
        setCartItems((prevItems) =>
            prevItems.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        quantity: Math.min(Math.max(1, item.quantity + delta), item.availableQuantity),
                    }
                    : item
            )
        );
    };

    const handleRemove = (index) => {
        setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
    };

    const handleSelectItem = (index) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(index) ? prevSelected.filter((i) => i !== index) : [...prevSelected, index]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            const allIndexes = cartItems.map((_, index) => index);
            setSelectedItems(allIndexes);
        }
    };

    const totalPrice = cartItems
        .filter((_, index) => selectedItems.includes(index))
        .reduce((total, item) => total + item.finalPrice * item.quantity, 0);

    const handelOrder = () => {
        if (selectedItems.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
            return;
        }
        const orderPayload = {
            customerId: null,
            customerName: "",
            customerPhone: "",
            customerEmail: "",
            customerAddress: "",
            paymentMethod: "Cash",
            orderDetails: cartItems
            .map((item, index) => ({
                index,
                productId: item.id,
                productName: item.name,
                quantity: item.quantity,
                price: item.finalPrice,
                image: item.image || noImage,
                variant: item.selectedVariant || {},
            }))
                .filter((item) => selectedItems.includes(item.index)),
        };
        navigate("/confirm-order", { state: orderPayload });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl md:text-3xl font-bold mb-8 text-red-700 flex items-center">
                    <ShoppingCart className="mr-2" />
                    Giỏ hàng của bạn
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3">
                        {cartItems.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <div className="flex justify-center mb-4">
                                    <ShoppingBag className="h-24 w-24 text-gray-300" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-500 mb-4">Giỏ hàng của bạn đang trống</h2>
                                <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
                                <a
                                    href="/"
                                    className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                                >
                                    Tiếp tục mua sắm
                                </a>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-4 border-b border-gray-200 flex items-center">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.length === cartItems.length}
                                            onChange={handleSelectAll}
                                            className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700">
                                            Chọn tất cả ({cartItems.length} sản phẩm)
                                        </span>
                                    </label>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {cartItems.map((item, index) => {
                                        const isSelected = selectedItems.includes(index);
                                        return (
                                            <div
                                                key={index}
                                                className={`p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors ${
                                                    isSelected ? "bg-red-50" : ""
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleSelectItem(index)}
                                                        className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                    />
                                                </div>

                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.image || noImage}
                                                        alt={item.name}
                                                        className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                                    />
                                                </div>

                                                <div className="flex-grow">
                                                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                                                    {item.selectedVariant && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {item.selectedVariant.size && (
                                                                <span className="mr-2">Size: {item.selectedVariant.size}</span>
                                                            )}
                                                            {item.selectedVariant.color && (
                                                                <span className="flex items-center">
                                                                    Màu:
                                                                      <span

                                                                        style={{ backgroundColor: item.selectedVariant.color }}
                                                                    ></span>
                                                                    {item.selectedVariant.color}
                                                                </span>
                                                            )}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
                                                    <div className="text-red-600 font-semibold">
                                                        {item.discount > 0 ? (
                                                            <>
                                                                <span>{item.finalPrice.toLocaleString()}đ</span>
                                                                <span className="text-gray-400 line-through ml-2">
                                                                    {item.originalPrice.toLocaleString()}đ
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span>{item.finalPrice.toLocaleString()}đ</span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center border border-gray-300 rounded-md">
                                                        <button
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                            onClick={() => handleQuantityChange(index, -1)}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="px-3 py-1 text-center w-10">{item.quantity}</span>
                                                        <button
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                            onClick={() => handleQuantityChange(index, 1)}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <div className="text-red-600 font-semibold whitespace-nowrap">
                                                        {(item.finalPrice * item.quantity).toLocaleString()}đ
                                                    </div>

                                                    <button
                                                        className="text-gray-500 hover:text-red-600 transition-colors"
                                                        onClick={() => handleRemove(index)}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6">
                                    <h2 className="text-lg font-semibold">Thông tin đơn hàng</h2>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="text-gray-600">Tổng sản phẩm</span>
                                        <span className="font-medium">
                                            {cartItems
                                                .filter((_, index) => selectedItems.includes(index))
                                                .reduce((total, item) => total + item.quantity, 0)}{" "}
                                            sản phẩm
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="text-gray-600">Tạm tính</span>
                                        <span className="font-medium">{totalPrice.toLocaleString()}đ</span>
                                    </div>

                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="text-gray-600">Giảm giá</span>
                                        <span className="text-sm text-gray-500">Áp dụng tại trang thanh toán</span>
                                    </div>

                                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                        <span className="text-gray-600">Phí vận chuyển</span>
                                        <span className="text-sm text-gray-500">Được tính tại trang thanh toán</span>
                                    </div>

                                    <div className="flex justify-between items-center py-4 mt-2">
                                        <span className="text-lg font-semibold">Tổng tiền</span>
                                        <span className="text-xl font-bold text-red-600">{totalPrice.toLocaleString()}đ</span>
                                    </div>

                                    <button
                                        onClick={handelOrder}
                                        disabled={selectedItems.length === 0}
                                        className={`w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center mt-4 ${
                                            selectedItems.length === 0
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-red-600 hover:bg-red-700 transition-colors"
                                        }`}
                                    >
                                        Thanh toán
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </button>

                                    <a
                                        href="/"
                                        className="w-full py-3 px-4 rounded-lg font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors flex items-center justify-center mt-3"
                                    >
                                        Tiếp tục mua hàng
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;