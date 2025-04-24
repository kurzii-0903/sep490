"use client"

import {useContext, useEffect, useState} from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react"
import {setAxiosInstance} from "../../../axiosInstance"
import axiosInstance from "../../../axiosInstance"
import {AuthContext} from "../../../contexts/AuthContext"

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user && user.token) {
      setAxiosInstance(user.token);
    }
  }, [user]);
  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await axiosInstance.get(`/api/Order/get-order/${id}`);
      setOrder(response.data);
      console.log("API Response:", response.data);
    } catch (err) {
      setError("Không thể tải dữ liệu đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    if (updating) return;
    if (!order?.invoice) {
      alert("Không có thông tin hóa đơn để cập nhật trạng thái.");
      return;
    }
    setUpdating(true);
    try {
      await axiosInstance.put(
        `/api/invoice/confirm-invoice-by-employee/${order.invoice.invoiceNumber}/${newStatus}`
      );
      await fetchOrder();
    } catch (err) {
      alert("Cập nhật trạng thái đơn hàng thất bại.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="w-full mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-6 w-full mt-4 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
              </div>
              <div>
                <div className="h-64 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="w-full mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md border border-red-200">
          <div className="p-6">
            <div className="flex items-center justify-center text-red-500">
              <XCircle className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="w-full mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-center text-gray-500">
              <p>Không tìm thấy đơn hàng.</p>
            </div>
          </div>
        </div>
      </div>
    );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Chờ xác nhận
          </span>
        );
      case "Confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Đã xác nhận
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
            {status}
          </span>
        );
    }
  };


  return (
    <div className="w-full mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Chi tiết đơn hàng
            </h1>
            <button
              onClick={() => navigate("/manager/orders")}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Trở về danh sách
            </button>
          </div>
        </div>
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Thông tin đơn hàng
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mã đơn hàng:</span>
                      <span className="font-medium">{order.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Khách hàng:</span>
                      <span className="font-medium">{order.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Số điện thoại:</span>
                      <span className="font-medium">{order.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Địa chỉ:</span>
                      <span className="font-medium text-right">
                        {order.address}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tổng tiền:</span>
                      <span className="font-medium">
                        {order.totalAmount.toLocaleString()} VND
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Trạng thái:</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngày đặt hàng:</span>
                      <span className="font-medium">
                        {new Date(order.orderDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ghi chú:</span>
                      <span className="font-medium">
                        {order.notes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Thông tin hóa đơn
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mã hóa đơn:</span>
                      <span className="font-medium">
                        {order.invoice.invoiceNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Thanh toán:</span>
                      <span className="font-medium">
                        {order.invoice.amount.toLocaleString()} VND
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phương thức:</span>
                      <span className="font-medium">
                        {order.invoice.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Trạng thái:</span>
                      <span className="font-medium">
                        {order.invoice.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngày tạo:</span>
                      <span className="font-medium">
                        {new Date(order.invoice.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Hình ảnh hóa đơn
                  </h2>
                </div>
                <div className="p-4">
                  <img
                      src={order.invoice.imageScreenTransfer}
                      alt="Hình ảnh hóa đơn"
                      className="w-full h-auto object-contain max-h-[400px] relative z-10"
                  />
                </div>
              </div>

              {order.status === "Pending" && (
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={() => updateOrderStatus("Confirmed")}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={updating}
                  >
                    {updating ? "Đang xử lý..." : "Xác nhận đơn hàng"}
                  </button>
                  <button
                    onClick={() => updateOrderStatus("Cancelled")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={updating}
                  >
                    {updating ? "Đang xử lý..." : "Hủy đơn hàng"}
                  </button>
                </div>
              )}
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Chi tiết sản phẩm
                  </h2>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-sm">
                          <th className="border border-gray-200 px-3 py-2 text-left">
                            Ảnh sản phẩm
                          </th>
                          <th className="border border-gray-200 px-3 py-2 text-left">
                            Sản phẩm
                          </th>
                          <th className="border border-gray-200 px-3 py-2 text-left">
                            Size
                          </th>
                          <th className="border border-gray-200 px-3 py-2 text-left">
                            Màu sắc
                          </th>
                          <th className="border border-gray-200 px-3 py-2 text-right">
                            Giá
                          </th>
                          <th className="border border-gray-200 px-3 py-2 text-center">
                            SL
                          </th>
                          <th className="border border-gray-200 px-3 py-2 text-right">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderDetails.map((item) => (
                          <tr
                            key={item.orderDetailId}
                            className="hover:bg-gray-50"
                          >
                            <td className="border border-gray-200 px-3 py-2">
                              <img
                                src={item.productImage}
                                key={item.productId}
                                alt={item.name}
                                width={"50px"}
                              />
                            </td>
                            <td className="border border-gray-200 px-3 py-2">
                              {item.productName}
                            </td>
                            <td className="border border-gray-200 px-3 py-2">
                              {item.size}
                            </td>
                            <td className="border border-gray-200 px-3 py-2">
                              {item.color}
                            </td>
                            <td className="border border-gray-200 px-3 py-2 text-right">
                              {item.productPrice.toLocaleString()} VND
                            </td>
                            <td className="border border-gray-200 px-3 py-2 text-center">
                              {item.quantity}
                            </td>
                            <td className="border border-gray-200 px-3 py-2 text-right">
                              {item.totalPrice.toLocaleString()} VND
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-medium">
                          <td
                            colSpan={6}
                            className="border border-gray-200 px-3 py-2 text-right"
                          >
                            Tổng cộng:
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-right">
                            {order.totalAmount.toLocaleString()} VND
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}