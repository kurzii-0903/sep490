import { useState } from "react";
import { useLocation } from "react-router-dom";
import { formatVND } from "../../utils/format";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL_API;
export function ConfirmOrder() {
    const location = useLocation();
    const orderData = location.state;

    // State để lưu thông tin khách hàng có thể chỉnh sửa
    const [customerInfo, setCustomerInfo] = useState({
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        customerAddress: orderData.customerAddress,
        paymentMethod: orderData.paymentMethod
    });

    // Xử lý khi thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    };
    const handleOrder = async () => {
        const newOrder = {
            customerName: customerInfo.customerName,
            customerEmail: customerInfo.customerEmail,
            customerPhone: customerInfo.customerPhone,
            customerAddress: customerInfo.customerAddress,
            paymentMethod: customerInfo.paymentMethod,
            orderDetails: orderData.orderDetails.map(({ productId, quantity, size, color }) => ({
                productId,
                quantity,
                size,
                color
            }))
        };

        try {
            const response = await axios.post(`${BASE_URL}/api/Order/create-order-v2`, newOrder);
            if (response.data && response.data.invoice) {
                alert('Order successfully!');
                if (response.data.invoice.paymentMethod === 'Cash') {
                    window.location.href = "/";
                } else {
                    window.location.href = `/checkout?invoiceNumber=${response.data.invoice.invoiceNumber}`;
                }
            } else {
                alert("Unexpected response from server.");
            }
        } catch (error) {
            console.error("Order failed:", error);
            alert("Failed to place order. Please try again!");
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Thông tin đơn hàng</h1>

            {/* Thông tin khách hàng (Có thể chỉnh sửa) */}
            <div className="mb-8 space-y-2">
                <label><b>Khách hàng:</b></label>
                <input
                    type="text"
                    name="customerName"
                    value={customerInfo.customerName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />

                <label><b>Email:</b></label>
                <input
                    type="email"
                    name="customerEmail"
                    value={customerInfo.customerEmail}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />

                <label><b>Số điện thoại:</b></label>
                <input
                    type="text"
                    name="customerPhone"
                    value={customerInfo.customerPhone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />

                <label><b>Địa chỉ giao hàng:</b></label>
                <input
                    type="text"
                    name="customerAddress"
                    value={customerInfo.customerAddress}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />

                <label><b>Phương thức thanh toán:</b></label>
                <div className="flex gap-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="Cash"
                            checked={customerInfo.paymentMethod === "Cash"}
                            onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: "Cash" })}
                            className="mr-2"
                        />
                        Tiền mặt
                    </label>

                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="Online"
                            checked={customerInfo.paymentMethod === "Online"}
                            onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: "Online" })}
                            className="mr-2"
                        />
                        Thanh toán online
                    </label>
                </div>

            </div>

            {/* Danh sách chi tiết sản phẩm */}
            <h2 className="text-xl font-semibold mb-4">Chi tiết sản phẩm:</h2>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100 text-left">
                    <th className="border p-3">Hình ảnh</th>
                    <th className="border p-3">Tên sản phẩm</th>
                    <th className="border p-3">Size</th>
                    <th className="border p-3">Màu sắc</th>
                    <th className="border p-3 text-center">Số lượng</th>
                    <th className="border p-3">Giá</th>
                    <th className="border p-3">Thành tiền</th>
                </tr>
                </thead>
                <tbody>
                {orderData.orderDetails.map(item => (
                    <tr key={item.productId} className="text-center">
                        <td className="border p-3">
                            <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded-md" />
                        </td>
                        <td className="border p-3 text-left">{item.productName}</td>
                        <td className="border p-3">{item.size || 'N/A'}</td>
                        <td className="border p-3">{item.color || 'N/A'}</td>
                        <td className="border p-3">{item.quantity}</td>
                        <td className="border p-3">{formatVND(item.price)}</td>
                        <td className="border p-3 font-semibold">{formatVND(item.price * item.quantity)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Tổng tiền */}
            <div className="mt-6 text-right text-lg font-semibold">
                Tổng tiền: {formatVND(orderData.orderDetails.reduce((total, item) => total + item.price * item.quantity, 0))}
            </div>
            <button
                className="mt-6 px-6 py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                onClick={() => handleOrder()}
            >
                Đặt hàng
            </button>

        </div>
    );
}
