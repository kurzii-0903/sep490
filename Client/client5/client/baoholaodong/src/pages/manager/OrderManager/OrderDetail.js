import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

export default function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);
    const fetchOrder = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/Order/get-order/${id}`);
            setOrder(response.data);
        } catch (err) {
            setError("Không thể tải dữ liệu đơn hàng.");
        } finally {
            setLoading(false);
        }
    };
    const updateOrderStatus = async (newStatus) => {
        if (updating) return;
        setUpdating(true);
        try {
            await axios.put(`${BASE_URL}/api/invoice/confirm-invoice-by-employee/${order.invoice.invoiceNumber}/${newStatus}`);
            await fetchOrder();
        } catch (err) {
            alert("Cập nhật trạng thái đơn hàng thất bại.");
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <p className="text-center text-blue-500">Đang tải dữ liệu...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!order) return <p className="text-center text-gray-500">Không tìm thấy đơn hàng.</p>;

    return (
        <div className="max-w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Chi tiết đơn hàng</h2>
            <div className="grid grid-cols-2 gap-6">
                {/* Bên trái - Thông tin đơn hàng */}
                <div className="bg-gray-100 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h3>
                    <p><strong>Mã đơn hàng:</strong> {order.orderId}</p>
                    <p><strong>Khách hàng:</strong> {order.fullName}</p>
                    <p><strong>Số điện thoại:</strong> {order.phoneNumber}</p>
                    <p><strong>Địa chỉ:</strong> {order.address}</p>
                    <p><strong>Tổng tiền:</strong> {order.totalAmount.toLocaleString()} VND</p>
                    <p><strong>Trạng thái:</strong>
                        <span className={`ml-2 px-3 py-1 text-white rounded-full text-sm
                            ${order.status === "Pending" ? "bg-yellow-500" :
                            order.status === "Confirmed" ? "bg-green-500" :
                                "bg-red-500"}`}>
                            {order.status}
                        </span>
                    </p>
                    <p><strong>Ngày đặt hàng:</strong> {new Date(order.orderDate).toLocaleString()}</p>

                    {/* Hóa đơn */}
                    <h3 className="text-xl font-semibold mt-6 mb-4">Hóa đơn</h3>
                    <p><strong>Mã hóa đơn:</strong> {order.invoice.invoiceNumber}</p>
                    <p><strong>Thanh toán:</strong> {order.invoice.amount.toLocaleString()} VND</p>
                    <p><strong>Phương thức:</strong> {order.invoice.paymentMethod}</p>
                    <p><strong>Trạng thái:</strong> {order.invoice.paymentStatus}</p>
                    <p><strong>Ngày tạo:</strong> {new Date(order.invoice.createdAt).toLocaleString()}</p>

                    {/* Nút xác nhận & hủy đơn */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => updateOrderStatus("Confirmed")}
                            className={`px-5 py-2 font-semibold text-white rounded-lg transition 
                            ${order.status !== "Pending" ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"} `}
                            disabled={order.status !== "Pending" || updating}
                        >
                            {updating ? "Đang xử lý..." : "Xác nhận đơn hàng"}
                        </button>
                        <button
                            onClick={() => updateOrderStatus("Cancelled")}
                            className={`px-5 py-2 font-semibold text-white rounded-lg transition 
                            ${order.status !== "Pending" ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"} `}
                            disabled={order.status !== "Pending" || updating}
                        >
                            {updating ? "Đang xử lý..." : "Hủy đơn hàng"}
                        </button>
                    </div>
                </div>

                {/* Bên phải - Danh sách sản phẩm */}
                <div className="bg-gray-50 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">Chi tiết sản phẩm</h3>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">Sản phẩm</th>
                            <th className="border border-gray-300 p-2">Giá</th>
                            <th className="border border-gray-300 p-2">Số lượng</th>
                            <th className="border border-gray-300 p-2">Thành tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.orderDetails.map((item) => (
                            <tr key={item.orderDetailId} className="text-center">
                                <td className="border border-gray-300 p-2">{item.productName}</td>
                                <td className="border border-gray-300 p-2">{item.productPrice.toLocaleString()} VND</td>
                                <td className="border border-gray-300 p-2">{item.quantity}</td>
                                <td className="border border-gray-300 p-2">{item.totalPrice.toLocaleString()} VND</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
