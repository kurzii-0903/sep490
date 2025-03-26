"use client"

import { useState, useContext } from "react"
import { useLocation } from "react-router-dom"
import { formatVND } from "../../utils/format"
import axios from "axios"
import { AuthContext } from "../../contexts/AuthContext"
import { CreditCard, Truck, MapPin, Phone, Mail, User, DollarSign } from "lucide-react"

const BASE_URL = process.env.REACT_APP_BASE_URL_API

export function ConfirmOrder() {
    const location = useLocation()
    const orderData = location.state
    const { user } = useContext(AuthContext)

    // State để lưu thông tin khách hàng có thể chỉnh sửa
    const [customerInfo, setCustomerInfo] = useState({
        customerId: null,
        customerName: user ? user.customerName : "",
        customerEmail: user ? user.email : "",
        customerPhone: "",
        customerAddress: orderData.customerAddress,
        paymentMethod: orderData.paymentMethod,
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Xử lý khi thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setCustomerInfo((prev) => ({ ...prev, [name]: value }))
    }

    const handleOrder = async () => {
        if (!customerInfo.customerName || !customerInfo.customerPhone || !customerInfo.customerAddress) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng!")
            return
        }

        setIsSubmitting(true)

        const newOrder = {
            customerName: customerInfo.customerName,
            customerEmail: customerInfo.customerEmail,
            customerPhone: customerInfo.customerPhone,
            customerAddress: customerInfo.customerAddress,
            paymentMethod: customerInfo.paymentMethod,
            orderDetails: orderData.orderDetails.map(({ productId, quantity, variant }) => ({
                productId,
                quantity,
                variantId:variant.variantId
            })),
        }

        try {
            console.log(newOrder)
            const response = await axios.post(`${BASE_URL}/api/Order/create-order-v2`, newOrder)
            alert("Đặt hàng thành công!")
            if (response.data.invoice.paymentMethod === "Cash") {
                window.location.href = "/"
            } else {
                window.location.href = `/checkout?invoiceNumber=${response.data.invoice.invoiceNumber}`
            }
        } catch (error) {
            console.error("Order failed:", error)
            alert("Đặt hàng thất bại. Vui lòng thử lại!")
        } finally {
            setIsSubmitting(false)
        }
    }

    const totalAmount = orderData.orderDetails.reduce((total, item) => total + item.price * item.quantity, 0)

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-6 px-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                        <Truck className="mr-3 h-6 w-6" />
                        Xác nhận đơn hàng
                    </h1>
                </div>

                <div className="p-6 md:p-8">
                    {/* Thông tin khách hàng */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Thông tin giao hàng</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700 flex items-center">
                                    <User className="w-4 h-4 mr-1" />
                                    Họ tên
                                </label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={customerInfo.customerName}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="Nhập họ tên người nhận"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700 flex items-center">
                                    <Mail className="w-4 h-4 mr-1" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={customerInfo.customerEmail}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="Nhập email"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700 flex items-center">
                                    <Phone className="w-4 h-4 mr-1" />
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    name="customerPhone"
                                    value={customerInfo.customerPhone}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700 flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    Địa chỉ giao hàng
                                </label>
                                <input
                                    type="text"
                                    name="customerAddress"
                                    value={customerInfo.customerAddress}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="Nhập địa chỉ giao hàng"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Phương thức thanh toán */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 flex items-center">
                            <CreditCard className="mr-2 h-5 w-5" />
                            Phương thức thanh toán
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label
                                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                                    customerInfo.paymentMethod === "Cash"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-blue-200"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Cash"
                                    checked={customerInfo.paymentMethod === "Cash"}
                                    onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: "Cash" })}
                                    className="mr-3 h-4 w-4 text-blue-600"
                                />
                                <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Tiền mặt</p>
                                    <p className="text-sm text-gray-500">Thanh toán khi nhận hàng</p>
                                </div>
                            </label>

                            <label
                                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                                    customerInfo.paymentMethod === "Online"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-blue-200"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Online"
                                    checked={customerInfo.paymentMethod === "Online"}
                                    onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: "Online" })}
                                    className="mr-3 h-4 w-4 text-blue-600"
                                />
                                <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Thanh toán online</p>
                                    <p className="text-sm text-gray-500">Chuyển khoản qua cổng thanh toán</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Chi tiết đơn hàng */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Chi tiết sản phẩm</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="bg-gray-50">
                                    <th className="py-3 px-4 text-left border-b font-medium text-gray-700">Sản phẩm</th>
                                    <th className="py-3 px-4 text-center border-b font-medium text-gray-700">Size</th>
                                    <th className="py-3 px-4 text-center border-b font-medium text-gray-700">Màu</th>
                                    <th className="py-3 px-4 text-center border-b font-medium text-gray-700">SL</th>
                                    <th className="py-3 px-4 text-right border-b font-medium text-gray-700">Đơn giá</th>
                                    <th className="py-3 px-4 text-right border-b font-medium text-gray-700">Thành tiền</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orderData.orderDetails.map((item, index) => (
                                    <tr key={`${item.productId}-${index}`} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                        <td className="py-4 px-4 border-b">
                                            <div className="flex items-center">
                                                <img
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={item.productName}
                                                    className="w-16 h-16 object-cover rounded-md border mr-3"
                                                />
                                                <span className="font-medium">{item.productName}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center border-b">{item.variant.size || "N/A"}</td>
                                        <td className="py-4 px-4 text-center border-b">
                                            {item.variant ? (
                                                <div className="flex items-center justify-center">
                                                    {item.variant.color}
                                                </div>
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center border-b">{item.quantity}</td>
                                        <td className="py-4 px-4 text-right border-b">{formatVND(item.price)}</td>
                                        <td className="py-4 px-4 text-right border-b font-semibold">
                                            {formatVND(item.price * item.quantity)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tổng tiền và nút đặt hàng */}
                    <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-500 mb-4 md:mb-0">Vui lòng kiểm tra thông tin trước khi đặt hàng</div>

                        <div className="flex flex-col items-end">
                            <div className="text-xl font-bold text-gray-800 mb-4">
                                Tổng tiền: <span className="text-blue-600">{formatVND(totalAmount)}</span>
                            </div>

                            <button
                                className={`px-8 py-3 rounded-lg text-white font-medium text-lg transition-all ${
                                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                                }`}
                                onClick={handleOrder}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Đang xử lý...
                                    </div>
                                ) : (
                                    "Đặt hàng"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

