"use client"

import { useState, useContext, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { formatVND } from "../../utils/format"
import axios from "axios"
import { AuthContext } from "../../contexts/AuthContext"
import { CreditCard, Truck, MapPin, Phone, Mail, User, DollarSign, CheckCircle, X } from "lucide-react"
import "./style.css"

const BASE_URL = process.env.REACT_APP_BASE_URL_API

export function ConfirmOrder() {
    const location = useLocation()
    const orderData = location.state
    const { user } = useContext(AuthContext)

    const [orderSuccess, setOrderSuccess] = useState(false)
    const [orderMessage, setOrderMessage] = useState("")
    const [notification, setNotification] = useState({ show: false, message: "", type: "" })
    const [customerInfo, setCustomerInfo] = useState({
        customerId: null,
        customerName: user ? user.customerName : "",
        customerEmail: user ? user.email : "",
        customerPhone: "",
        customerAddress: orderData.customerAddress,
        paymentMethod: orderData.paymentMethod,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [truckAnimation, setTruckAnimation] = useState(false)
    const [rotatePage, setRotatePage] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setCustomerInfo((prev) => ({ ...prev, [name]: value }))
    }

    const showNotification = (message, type = "error") => {
        setNotification({ show: true, message, type })
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "" })
        }, 5000)
    }

    const handleOrder = async () => {
        if (!customerInfo.customerName || !customerInfo.customerPhone || !customerInfo.customerAddress) {
            showNotification("Vui lòng điền đầy đủ thông tin giao hàng!", "error")
            return
        }

        setIsSubmitting(true)
        setTruckAnimation(true)

        const newOrder = {
            customerName: customerInfo.customerName,
            customerEmail: customerInfo.customerEmail,
            customerPhone: customerInfo.customerPhone,
            customerAddress: customerInfo.customerAddress,
            paymentMethod: customerInfo.paymentMethod,
            orderDetails: orderData.orderDetails.map(({ productId, quantity, variant }) => ({
                productId,
                quantity,
                variantId: variant.variantId,
            })),
        }

        try {
            console.log(newOrder)
            const response = await axios.post(`${BASE_URL}/api/Order/create-order-v2`, newOrder)

            setTimeout(() => {
                setTruckAnimation(false)
                setRotatePage(true)
                setTimeout(() => {
                    setOrderSuccess(true)
                    setOrderMessage(response.data)
                    setRotatePage(false)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                }, 1000) // Thời gian xoay trang: 1s
            }, 1500) // Thời gian xe tải chạy: 1.5s
        } catch (error) {
            console.error("Order failed:", error)
            setTruckAnimation(false)
            showNotification("Đặt hàng thất bại. Vui lòng thử lại sau!", "error")
            setIsSubmitting(false)
        }
    }

    const totalAmount = orderData.orderDetails.reduce((total, item) => total + item.price * item.quantity, 0)

    if (orderSuccess) {
        return (
            <div className="confirm-container">
                <div className="confirm-success-card">
                    <div className="confirm-success-header">
                        <h1 className="confirm-success-title">
                            <CheckCircle className="confirm-icon" />
                            Đặt hàng thành công
                        </h1>
                    </div>
                    <div className="confirm-success-content">
                        <div className="confirm-success-icon">
                            <CheckCircle className="confirm-icon-large" />
                        </div>
                        <h2 className="confirm-thank-you">Cảm ơn bạn đã đặt hàng!</h2>
                        <p className="confirm-order-message">{orderMessage}</p>
                        <div className="confirm-order-info">
                            <h3 className="confirm-info-title">Thông tin đơn hàng</h3>
                            <p>Họ tên: {customerInfo.customerName}</p>
                            <p>Số điện thoại: {customerInfo.customerPhone}</p>
                            <p>Địa chỉ: {customerInfo.customerAddress}</p>
                            <p>
                                Phương thức thanh toán: {customerInfo.paymentMethod === "Cash" ? "Tiền mặt" : "Thanh toán online"}
                            </p>
                            <p className="confirm-total">Tổng tiền: {formatVND(totalAmount)}</p>
                        </div>
                        <div className="confirm-button-group">
                            <button onClick={() => (window.location.href = "/")} className="confirm-btn-continue">
                                Tiếp tục mua sắm
                            </button>
                            <button onClick={() => (window.location.href = "/account/orders")} className="confirm-btn-view-order">
                                Xem đơn hàng của tôi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`confirm-container ${rotatePage ? "confirm-rotate" : ""}`}>
            {notification.show && (
                <div className={`confirm-notification ${notification.type}`}>
                    <div className="confirm-notification-content">
                        {notification.type === "error" ? (
                            <svg className="confirm-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <svg className="confirm-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                        <span>{notification.message}</span>
                    </div>
                    <button
                        onClick={() => setNotification({ show: false, message: "", type: "" })}
                        className="confirm-close-btn"
                    >
                        <X className="confirm-icon-small" />
                    </button>
                </div>
            )}
            <div className="confirm-order-card">
                <div className="confirm-order-header">
                    <h1 className="confirm-order-title">
                        <Truck className={`confirm-icon ${truckAnimation ? "confirm-truck-move" : ""}`} />
                        Xác nhận đơn hàng
                    </h1>
                </div>
                <div className="confirm-order-content">
                    <div className="confirm-section">
                        <h2 className="confirm-section-title">Thông tin giao hàng</h2>
                        <div className="confirm-grid">
                            <div className="confirm-input-group">
                                <label className="confirm-label">
                                    <User className="confirm-icon-small" />
                                    Họ tên
                                </label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={customerInfo.customerName}
                                    onChange={handleInputChange}
                                    className="confirm-input"
                                    placeholder="Nhập họ tên người nhận"
                                    required
                                />
                            </div>
                            <div className="confirm-input-group">
                                <label className="confirm-label">
                                    <Mail className="confirm-icon-small" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={customerInfo.customerEmail}
                                    onChange={handleInputChange}
                                    className="confirm-input"
                                    placeholder="Nhập email"
                                />
                            </div>
                            <div className="confirm-input-group">
                                <label className="confirm-label">
                                    <Phone className="confirm-icon-small" />
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    name="customerPhone"
                                    value={customerInfo.customerPhone}
                                    onChange={handleInputChange}
                                    className="confirm-input"
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                            </div>
                            <div className="confirm-input-group">
                                <label className="confirm-label">
                                    <MapPin className="confirm-icon-small" />
                                    Địa chỉ giao hàng
                                </label>
                                <input
                                    type="text"
                                    name="customerAddress"
                                    value={customerInfo.customerAddress}
                                    onChange={handleInputChange}
                                    className="confirm-input"
                                    placeholder="Nhập địa chỉ giao hàng"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="confirm-section">
                        <h2 className="confirm-section-title">
                            <CreditCard className="confirm-icon" />
                            Phương thức thanh toán
                        </h2>
                        <div className="confirm-payment-options">
                            <label
                                className={`confirm-payment-option ${customerInfo.paymentMethod === "Cash" ? "confirm-active" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Cash"
                                    checked={customerInfo.paymentMethod === "Cash"}
                                    onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: "Cash" })}
                                    className="confirm-radio"
                                />
                                <DollarSign className="confirm-icon" />
                                <div>
                                    <p className="confirm-payment-title">Tiền mặt</p>
                                    <p className="confirm-payment-desc">Thanh toán khi nhận hàng</p>
                                </div>
                            </label>
                            <label
                                className={`confirm-payment-option ${customerInfo.paymentMethod === "Online" ? "confirm-active" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Online"
                                    checked={customerInfo.paymentMethod === "Online"}
                                    onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: "Online" })}
                                    className="confirm-radio"
                                />
                                <CreditCard className="confirm-icon" />
                                <div>
                                    <p className="confirm-payment-title">Thanh toán online</p>
                                    <p className="confirm-payment-desc">Chuyển khoản qua cổng thanh toán</p>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="confirm-section">
                        <h2 className="confirm-section-title">Chi tiết sản phẩm</h2>
                        <div className="confirm-table-wrapper">
                            <table className="confirm-order-table">
                                <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Size</th>
                                    <th>Màu</th>
                                    <th>SL</th>
                                    <th>Đơn giá</th>
                                    <th>Thành tiền</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orderData.orderDetails.map((item, index) => (
                                    <tr key={`${item.productId}-${index}`} className={index % 2 === 0 ? "confirm-even" : "confirm-odd"}>
                                        <td>
                                            <div className="confirm-product-info">
                                                <img
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={item.productName}
                                                    className="confirm-product-img"
                                                />
                                                <span>{item.productName}</span>
                                            </div>
                                        </td>
                                        <td>{item.variant.size || "N/A"}</td>
                                        <td>{item.variant ? item.variant.color : "N/A"}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatVND(item.price)}</td>
                                        <td>{formatVND(item.price * item.quantity)}</td>
                                            </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    </div>
                                    </div>
                                    <div className="confirm-footer">
                                    <div className="confirm-note">Vui lòng kiểm tra thông tin trước khi đặt hàng</div>
                                    <div className="confirm-total-section">
                                    <div className="confirm-total-amount">
                                    Tổng tiền: <span>{formatVND(totalAmount)}</span>
                        </div>
                        <button
                            className={`confirm-order-btn ${isSubmitting ? "confirm-disabled" : ""}`}
                            onClick={handleOrder}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="confirm-loading">
                                    <svg
                                        className="confirm-spinner"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="confirm-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path
                                            className="confirm-path"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
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