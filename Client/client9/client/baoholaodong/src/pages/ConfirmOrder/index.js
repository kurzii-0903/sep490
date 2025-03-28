"use client";

import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatVND } from "../../utils/format";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import {
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  DollarSign,
  CheckCircle,
  X,
} from "lucide-react";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

export function ConfirmOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;
  const { user } = useContext(AuthContext);

  // State for customer details from API
  const [customerDetails, setCustomerDetails] = useState(null);

  // State for order success notification
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  // State for inline notification
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Fetch customer details when component mounts
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/User/get-customer-by-id/${user.userId}`
        );
        setCustomerDetails(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
      }
    };

    if (user && user.userId) {
      fetchCustomerDetails();
    }
  }, [user]);

  // State để lưu thông tin khách hàng có thể chỉnh sửa
  const [customerInfo, setCustomerInfo] = useState({
    customerId: user.userId,
    customerName: customerDetails?.name || "",
    customerEmail: customerDetails?.email || user.email || "",
    customerPhone: customerDetails?.phoneNumber || "",
    customerAddress:
      customerDetails?.address || orderData.customerAddress || "",
    paymentMethod: orderData.paymentMethod || "Cash",
  });

  // Cập nhật customerInfo khi customerDetails thay đổi
  useEffect(() => {
    if (customerDetails) {
      setCustomerInfo((prevInfo) => ({
        ...prevInfo,
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phoneNumber,
        customerAddress: customerDetails.address,
      }));
    }
  }, [customerDetails]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý khi thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Hiển thị thông báo
  const showNotification = (message, type = "error") => {
    setNotification({ show: true, message, type });

    // Tự động ẩn thông báo sau 5 giây
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  const handleOrder = async () => {
    if (
      !customerInfo.customerName ||
      !customerInfo.customerPhone ||
      !customerInfo.customerAddress
    ) {
      showNotification("Vui lòng điền đầy đủ thông tin giao hàng!", "error");
      return;
    }

    setIsSubmitting(true);

    const newOrder = {
      customerName: customerInfo.customerName,
      customerEmail: customerInfo.customerEmail,
      customerPhone: customerInfo.customerPhone,
      customerAddress: customerInfo.customerAddress,
      paymentMethod: customerInfo.paymentMethod,
      orderDetails: orderData.orderDetails.map(
        ({ productId, quantity, variant }) => ({
          productId,
          quantity,
          variantId: variant.variantId,
        })
      ),
    };

    try {
      console.log(newOrder);
      const response = await axios.post(
        `${BASE_URL}/api/Order/create-order-v2`,
        newOrder
      );

      // Show success message instead of alert
      setOrderSuccess(true);
      setOrderMessage(response.data);

      // Scroll to top to see the success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Order failed:", error);
      showNotification("Đặt hàng thất bại. Vui lòng thử lại sau!", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = orderData.orderDetails.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Function to handle navigating to order history
  const handleViewOrderHistory = () => {
    navigate(`/order-history/${user.userId}`);
  };

  // If order is successful, show success message at the top
  if (orderSuccess) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-700 py-6 px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
              <CheckCircle className="mr-3 h-6 w-6" />
              Đặt hàng thành công
            </h1>
          </div>

          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Cảm ơn bạn đã đặt hàng!
            </h2>
            <p className="text-lg text-gray-600 mb-6">{orderMessage}</p>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                Thông tin đơn hàng
              </h3>
              <p className="text-gray-600">
                Họ tên: {customerInfo.customerName}
              </p>
              <p className="text-gray-600">
                Số điện thoại: {customerInfo.customerPhone}
              </p>
              <p className="text-gray-600">
                Địa chỉ: {customerInfo.customerAddress}
              </p>
              <p className="text-gray-600">
                Phương thức thanh toán:{" "}
                {customerInfo.paymentMethod === "Cash"
                  ? "Tiền mặt"
                  : "Thanh toán online"}
              </p>
              <p className="font-medium text-gray-800 mt-2">
                Tổng tiền: {formatVND(totalAmount)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
              <button
                onClick={handleViewOrderHistory}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Xem đơn hàng của tôi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {notification.show && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center justify-between ${
            notification.type === "error"
              ? "bg-red-100 text-red-800 border border-red-300"
              : notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-blue-100 text-blue-800 border border-blue-300"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "error" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
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
            onClick={() =>
              setNotification({ show: false, message: "", type: "" })
            }
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Thông tin giao hàng
            </h2>

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
                  onChange={() =>
                    setCustomerInfo({ ...customerInfo, paymentMethod: "Cash" })
                  }
                  className="mr-3 h-4 w-4 text-blue-600"
                />
                <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Tiền mặt</p>
                  <p className="text-sm text-gray-500">
                    Thanh toán khi nhận hàng
                  </p>
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
                  onChange={() =>
                    setCustomerInfo({
                      ...customerInfo,
                      paymentMethod: "Online",
                    })
                  }
                  className="mr-3 h-4 w-4 text-blue-600"
                />
                <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Thanh toán online</p>
                  <p className="text-sm text-gray-500">
                    Chuyển khoản qua cổng thanh toán
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Chi tiết đơn hàng */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Chi tiết sản phẩm
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left border-b font-medium text-gray-700">
                      Sản phẩm
                    </th>
                    <th className="py-3 px-4 text-center border-b font-medium text-gray-700">
                      Size
                    </th>
                    <th className="py-3 px-4 text-center border-b font-medium text-gray-700">
                      Màu
                    </th>
                    <th className="py-3 px-4 text-center border-b font-medium text-gray-700">
                      SL
                    </th>
                    <th className="py-3 px-4 text-right border-b font-medium text-gray-700">
                      Đơn giá
                    </th>
                    <th className="py-3 px-4 text-right border-b font-medium text-gray-700">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.orderDetails.map((item, index) => (
                    <tr
                      key={`${item.productId}-${index}`}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-4 px-4 border-b">
                        <div className="flex items-center">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded-md border mr-3"
                          />
                          <span className="font-medium">
                            {item.productName}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center border-b">
                        {item.variant.size || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-center border-b">
                        {item.variant ? (
                          <div className="flex items-center justify-center">
                            {item.variant.color}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="py-4 px-4 text-center border-b">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-right border-b">
                        {formatVND(item.price)}
                      </td>
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
            <div className="text-gray-500 mb-4 md:mb-0">
              Vui lòng kiểm tra thông tin trước khi đặt hàng
            </div>

            <div className="flex flex-col items-end">
              <div className="text-xl font-bold text-gray-800 mb-4">
                Tổng tiền:{" "}
                <span className="text-blue-600">{formatVND(totalAmount)}</span>
              </div>

              <button
                className={`px-8 py-3 rounded-lg text-white font-medium text-lg transition-all ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
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
  );
}
