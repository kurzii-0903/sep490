
import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatVND } from "../../utils/format";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import {
    CreditCard,
    Truck,
    MapPin,
    Phone,
    Mail,
    User,
    DollarSign,
    CheckCircle,
} from "lucide-react";
import PageWrapper from "../../components/pageWrapper/PageWrapper";

export function ConfirmOrder() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state;
    const { user } = useContext(AuthContext);
    const { clearSelectedItems, showToast } = useContext(CartContext);

    // State for customer details from API
    const [customerDetails, setCustomerDetails] = useState(null);

    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderMessage, setOrderMessage] = useState("");
    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [invoiceNumber, setInvoiceNumber] = useState(null);
    const [calculatedOrder, setCalculatedOrder] = useState({
        orderDetails: null,
        totalAmount: 0,
    });
    const [customerInfo, setCustomerInfo] = useState({
        customerId: user ? user.userId : null,
        customerName: user ? user.customerName : "",
        customerEmail: user ? user.email : "",
        customerPhone: "",
        customerAddress: orderData ? orderData.customerAddress : "",
        paymentMethod: orderData ? orderData.paymentMethod : "Cash",
    });
    const [isTaxIncluded, setIsTaxIncluded] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [truckAnimation, setTruckAnimation] = useState(false);
    const [rotatePage, setRotatePage] = useState(false);
    // State for tracking input errors
    const [errors, setErrors] = useState({
        customerName: false,
        customerEmail: false,
        customerPhone: false,
        customerAddress: false,
    });

    useEffect(() => {
        if (!orderData || !orderData.orderDetails || orderData.orderDetails.length === 0) {
            showNotification("Giỏ hàng của bạn trống hoặc dữ liệu không hợp lệ. Vui lòng kiểm tra lại!", "error");
            setTimeout(() => {
                navigate("/cart");
            }, 3000);
        }
    }, [orderData, navigate]);

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await axios.get(
                    `/api/User/get-customer-by-id/${user.userId}`
                );
                setCustomerDetails(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin khách hàng:", error);
                showNotification("Không thể lấy thông tin khách hàng!", "error");
            }
        };

        if (user && user.userId) {
            fetchCustomerDetails();
        }
    }, [user]);

    // Update customerInfo when customerDetails changes
    useEffect(() => {
        if (customerDetails) {
            setCustomerInfo((prevInfo) => ({
                ...prevInfo,
                customerName: customerDetails.name || prevInfo.customerName,
                customerEmail: customerDetails.email || prevInfo.customerEmail,
                customerPhone: customerDetails.phoneNumber || prevInfo.customerPhone,
                customerAddress: customerDetails.address || prevInfo.customerAddress,
            }));
        }
    }, [customerDetails]);

    const calculateOrder = async () => {
        if (!orderData || !orderData.orderDetails || orderData.orderDetails.length === 0) {
            return; // Không tính toán nếu đơn hàng rỗng (đã xử lý trong useEffect)
        }

        try {
            const newOrder = {
                customerName: customerInfo.customerName || "ngocquy",
                customerEmail: customerInfo.customerEmail || "user@gmail.com",
                customerPhone: customerInfo.customerPhone || "1234567890",
                customerAddress: customerInfo.customerAddress || "123",
                paymentMethod: customerInfo.paymentMethod || "Cash",
                isTaxIncluded: isTaxIncluded,
                orderDetails: orderData.orderDetails.map(
                    ({ productId, quantity, variant }) => ({
                        productId,
                        quantity,
                        variantId: variant.variantId,
                    })
                ),
            };
            const response = await axios.post(
                `/api/Order/calculate-order`,
                newOrder
            );
            setCalculatedOrder(response.data);
        } catch (error) {
            console.error("Lỗi tính toán đơn hàng:", error);
            showNotification("Không thể tính toán đơn hàng!", "error");
        }
    };

    useEffect(() => {
        if (orderData && orderData.orderDetails && orderData.orderDetails.length > 0) {
            calculateOrder();
        }
    }, [orderData, isTaxIncluded, customerInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo((prev) => ({ ...prev, [name]: value }));
        // Reset error when user starts typing
        setErrors((prev) => ({ ...prev, [name]: !value }));
    };

    const showNotification = (message, type = "error") => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
        }, 5000);
    };

    const handleOrder = async () => {
        if (!orderData || !orderData.orderDetails || orderData.orderDetails.length === 0) {
            showNotification("Không có sản phẩm để đặt hàng!", "error");
            setTimeout(() => {
                navigate("/cart");
            }, 3000);
            return;
        }

        const newErrors = {
            customerName: !customerInfo.customerName,
            customerEmail: !customerInfo.customerEmail,
            customerPhone: !customerInfo.customerPhone,
            customerAddress: !customerInfo.customerAddress,
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            showNotification("Vui lòng điền đầy đủ thông tin giao hàng!", "error");
            return;
        }

        setIsSubmitting(true);
        setTruckAnimation(true);

        const newOrder = {
            customerName: customerInfo.customerName,
            customerEmail: customerInfo.customerEmail,
            customerPhone: customerInfo.customerPhone,
            customerAddress: customerInfo.customerAddress,
            paymentMethod: customerInfo.paymentMethod,
            isTaxIncluded: isTaxIncluded,
            orderDetails: orderData.orderDetails.map(
                ({ productId, quantity, variant }) => ({
                    productId,
                    quantity,
                    variantId: variant.variantId,
                })
            ),
        };

        try {
            const response = await axios.post(
                `/api/Order/create-order-v2`,
                newOrder
            );
            const orderResponse = response.data;


            // Only clear cart if payment method is "Cash"
            if (customerInfo.paymentMethod === "Cash") {
                const orderedItemIndices = orderData.orderDetails.map(
                    (item) => item.index
                );
                clearSelectedItems(orderedItemIndices);
            }

            setTimeout(() => {
                setTruckAnimation(false);
                setRotatePage(true);
                setTimeout(() => {
                    setOrderSuccess(true);
                    setOrderMessage("Đơn hàng của bạn đã được ghi nhận.");
                    if (customerInfo.paymentMethod === "Online") {
                        setInvoiceNumber(orderResponse.invoice?.invoiceNumber);
                    }
                    setRotatePage(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }, 1000);
            }, 5000);
        } catch (error) {
            console.error("Order failed:", error);
            setTruckAnimation(false);
            showNotification("Đặt hàng thất bại. Vui lòng thử lại sau!", "error");
            setIsSubmitting(false);
        }
    };

    const totalAmount = orderData && orderData.orderDetails && orderData.orderDetails.length > 0
        ? orderData.orderDetails.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        )
        : 0;

    if (orderSuccess) {
        return (
            <PageWrapper title="Đặt hàng thành công">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                                <CheckCircle className="w-6 h-6 mr-2" />
                                Đặt hàng thành công
                            </h1>
                        </div>
                        <div className="p-6 md:p-8 space-y-6">
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Cảm ơn quý khách đã đặt hàng tại website{" "}
                                <span className="font-semibold text-blue-600">
                                    baoholaodongminhxuan.com
                                </span>
                                . <br />
                                Chúng tôi sẽ liên hệ lại với quý khách trong thời gian sớm nhất
                                có thể!
                            </p>
                            <div>
                                <h2 className="text-lg font-semibold underline mb-2">
                                    Thông tin khách hàng
                                </h2>
                                <p className="text-gray-700">{customerInfo.customerName}</p>
                                <p className="text-gray-700">
                                    Điện thoại: {customerInfo.customerPhone}
                                </p>
                                <p className="text-gray-700">
                                    Email: {customerInfo.customerEmail}
                                </p>
                                <p className="text-gray-700">
                                    Địa chỉ: {customerInfo.customerAddress}
                                </p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold underline mb-4">
                                    Thông tin đơn hàng
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full border border-collapse text-sm text-left">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border px-3 py-2">Sản phẩm</th>
                                                <th className="border px-3 py-2 text-center">Màu</th>
                                                <th className="border px-3 py-2 text-center">Size</th>
                                                <th className="border px-3 py-2 text-center">
                                                    Đơn giá
                                                </th>
                                                <th className="border px-3 py-2 text-center">SL</th>
                                                <th className="border px-3 py-2 text-center">
                                                    Thuế (%)
                                                </th>
                                                <th className="border px-3 py-2 text-right">
                                                    Thành tiền
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {calculatedOrder.orderDetails?.map(
                                                (
                                                    {
                                                        productId,
                                                        productName,
                                                        color,
                                                        size,
                                                        quantity,
                                                        totalPrice,
                                                        productTax,
                                                        productPrice,
                                                    },
                                                    index
                                                ) => (
                                                    <tr
                                                        key={`${productId}-${index}`}
                                                        className={
                                                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                        }
                                                    >
                                                        <td className="border px-3 py-2">{productName}</td>
                                                        <td className="border px-3 py-2 text-center">
                                                            {color || "N/A"}
                                                        </td>
                                                        <td className="border px-3 py-2 text-center">
                                                            {size || "N/A"}
                                                        </td>
                                                        <td className="border px-3 py-2 text-center">
                                                            {formatVND(productPrice)}
                                                        </td>
                                                        <td className="border px-3 py-2 text-center">
                                                            {quantity}
                                                        </td>
                                                        <td className="border px-3 py-2 text-center">
                                                            {productTax}%
                                                        </td>
                                                        <td className="border px-3 py-2 text-right">
                                                            {formatVND(totalPrice)}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex items-center mt-4 space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={isTaxIncluded}
                                        readOnly
                                        className="w-5 h-5"
                                    />
                                    <span className="text-base">Thuế giá trị gia tăng</span>
                                </div>
                                <div className="text-right text-lg font-bold mt-4">
                                    Tổng:{" "}
                                    <span className="text-red-600">
                                        {formatVND(calculatedOrder.totalAmount)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => navigate("/")}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Tiếp tục mua sắm
                                </button>
                                <button
                                    onClick={() => navigate("/order-history")}
                                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                >
                                    Xem đơn hàng của tôi
                                </button>
                                {customerInfo.paymentMethod === "Online" && invoiceNumber && (
                                    <button
                                        onClick={() =>
                                            navigate(`/checkout?invoiceNumber=${invoiceNumber}`)
                                        }
                                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Thanh toán ngay
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper title="Xác nhận đơn hàng">
            <div
                className={`max-w-6xl mx-auto px-4 py-8 ${rotatePage
                    ? "animate-[confirm-page-rotate_1s_ease-in-out_forwards]"
                    : ""
                    }`}
            >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-t from-red-900 to-red-600 p-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                            <Truck
                                className={`w-6 h-6 mr-2 ${truckAnimation
                                    ? "animate-[confirm-truck-slide_1.5s_ease-in-out_forwards]"
                                    : ""
                                    }`}
                            />
                            Xác nhận đơn hàng
                        </h1>
                    </div>
                    <div className="p-6 md:p-8">
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
                                Thông tin giao hàng
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <User className="w-4 h-4 mr-1" />
                                        Họ tên
                                    </label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={customerInfo.customerName}
                                        onChange={handleInputChange}
                                        className={`mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.customerName ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="Nhập họ tên người nhận"
                                        required
                                    />
                                    {errors.customerName && (
                                        <p className="text-red-500 text-sm mt-1">Vui lòng nhập họ tên</p>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <Mail className="w-4 h-4 mr-1" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="customerEmail"
                                        value={customerInfo.customerEmail}
                                        onChange={handleInputChange}
                                        className={`mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.customerEmail ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="Nhập email"
                                        required
                                    />
                                    {errors.customerEmail && (
                                        <p className="text-red-500 text-sm mt-1">Vui lòng nhập email</p>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <Phone className="w-4 h-4 mr-1" />
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        name="customerPhone"
                                        value={customerInfo.customerPhone}
                                        onChange={handleInputChange}
                                        className={`mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.customerPhone ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="Nhập số điện thoại"
                                        required
                                    />
                                    {errors.customerPhone && (
                                        <p className="text-red-500 text-sm mt-1">Vui lòng nhập số điện thoại</p>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        Địa chỉ giao hàng
                                    </label>
                                    <input
                                        type="text"
                                        name="customerAddress"
                                        value={customerInfo.customerAddress}
                                        onChange={handleInputChange}
                                        className={`mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.customerAddress ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="Nhập địa chỉ giao hàng"
                                        required
                                    />
                                    {errors.customerAddress && (
                                        <p className="text-red-500 text-sm mt-1">Vui lòng nhập địa chỉ</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                Phương thức thanh toán
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label
                                    className={`flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-200 transition-all ${customerInfo.paymentMethod === "Cash"
                                        ? "border-red-500 bg-blue-50"
                                        : ""
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Cash"
                                        checked={customerInfo.paymentMethod === "Cash"}
                                        onChange={() =>
                                            setCustomerInfo({
                                                ...customerInfo,
                                                paymentMethod: "Cash",
                                            })
                                        }
                                        className="w-4 h-4 text-red-500 mr-3"
                                    />
                                    <DollarSign className="w-5 h-5 text-red-500 mr-2" />
                                    <div>
                                        <p className="font-medium">Tiền mặt</p>
                                        <p
                                            className="text-sm text-gray-500"
                                        >
                                            Thanh toán khi nhận hàng
                                        </p>
                                    </div>
                                </label>
                                <label
                                    className={`flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-200 transition-all ${customerInfo.paymentMethod === "Online"
                                        ? "border-red-500 bg-blue-50"
                                        : ""
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
                                        className="w-4 h-4 text-red-500 mr-3"
                                    />
                                    <CreditCard className="w-5 h-5 text-red-500 mr-2" />
                                    <div>
                                        <p className="font-medium">Thanh toán online</p>
                                        <p className="text-sm text-gray-500">
                                            Chuyển khoản qua cổng thanh toán
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 pb-2 mb-4">
                                Thông tin đơn hàng
                                <span className="block h-1 w-24 bg-red-500 border-b-2 border-dashed border-red-500"></span>
                            </h2>
                            <div className="overflow-x-auto">
                                {!calculatedOrder.orderDetails ? (
                                    <div className="text-center py-5 text-gray-600">
                                        Đang tính toán đơn hàng...
                                    </div>
                                ) : (
                                    <table className="w-full border-collapse min-w-[800px]">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="p-3 text-left font-medium text-gray-700 min-w-[200px]">
                                                    Sản phẩm
                                                </th>
                                                <th className="p-3 text-center font-medium text-gray-700 min-w-[80px]">
                                                    Màu
                                                </th>
                                                <th className="p-3 text-center font-medium text-gray-700 min-w-[80px]">
                                                    Size
                                                </th>
                                                <th className="p-3 text-center font-medium text-gray-700 min-w-[100px]">
                                                    Đơn giá
                                                </th>
                                                <th className="p-3 text-center font-medium text-gray-700 min-w-[50px]">
                                                    SL
                                                </th>
                                                <th className="p-3 text-center font-medium text-gray-700 min-w-[80px]">
                                                    Thuế (%)
                                                </th>
                                                <th className="p-3 text-right font-medium text-gray-700 min-w-[120px]">
                                                    Thành tiền
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {calculatedOrder.orderDetails.map(
                                                (
                                                    {
                                                        productId,
                                                        productName,
                                                        productImage,
                                                        color,
                                                        size,
                                                        quantity,
                                                        totalPrice,
                                                        productTax,
                                                        productPrice,
                                                    },
                                                    index
                                                ) => (
                                                    <tr
                                                        key={`${productId}-${index}`}
                                                        className={
                                                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                        }
                                                    >
                                                        <td className="p-4">
                                                            <div className="flex items-center">
                                                                <img
                                                                    src={productImage || "/placeholder.svg"}
                                                                    alt={productName}
                                                                    className="w-16 h-16 object-cover rounded-md border border-gray-200 mr-3 flex-shrink-0"
                                                                />
                                                                <span className="truncate">{productName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            {color || "N/A"}
                                                        </td>
                                                        <td className="p-4 text-center">{size || "N/A"}</td>
                                                        <td className="p-4 text-center">
                                                            {formatVND(productPrice)}
                                                        </td>
                                                        <td className="p-4 text-center">{quantity}</td>
                                                        <td className="p-4 text-center">{`${productTax}%`}</td>
                                                        <td className="p-4 text-right font-semibold">
                                                            {formatVND(totalPrice)}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            <div className="mt-4 flex items-center">
                                <input
                                    type="checkbox"
                                    id="taxCheckbox"
                                    checked={isTaxIncluded}
                                    onChange={() => setIsTaxIncluded(!isTaxIncluded)}
                                    className="w-5 h-5 cursor-pointer mr-2"
                                />
                                <label
                                    htmlFor="taxCheckbox"
                                    className="text-base cursor-pointer"
                                >
                                    Thuế giá trị gia tăng
                                </label>
                            </div>
                            <div className="mt-4 text-right">
                                <div className="text-xl font-bold text-gray-800">
                                    Tổng :{" "}
                                    <span className="text-red-500">
                                        {calculatedOrder.totalAmount
                                            ? formatVND(calculatedOrder.totalAmount)
                                            : "Đang tính..."}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-end">
                            <div className="text-gray-500 mb-4 md:mb-0">
                                Vui lòng kiểm tra thông tin trước khi đặt hàng
                            </div>
                            <div className="text-right">
                                <button
                                    className={`px-8 py-3 rounded-lg text-white font-medium text-lg ${isSubmitting || !calculatedOrder.orderDetails
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-red-500 hover:bg-red-600 active:bg-red-500"
                                        }`}
                                    onClick={handleOrder}
                                    disabled={isSubmitting || !calculatedOrder.orderDetails}
                                >
                                    {isSubmitting
                                        ? "Đang xử lý..."
                                        : !calculatedOrder.orderDetails
                                            ? "Đang tính toán..."
                                            : "Đặt hàng"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {notification.show && (
                    <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up">
                        <div
                            className={`px-4 py-3 rounded-md shadow-md text-red-600 text-sm flex items-center gap-2 transition ${notification.type === "error" ? "bg-red-300" : "bg-green-500"
                                }`}
                        >
                            <span>{notification.type === "error" ? "❌" : "✅"}</span>
                            <span>{notification.message}</span>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}

export default ConfirmOrder;