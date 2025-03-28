"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, CheckCircle, Clock, XCircle, Image } from "lucide-react";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      await axios.put(
        `${BASE_URL}/api/invoice/confirm-invoice-by-employee/${order.invoice.invoiceNumber}/${newStatus}`
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

  const getInvoiceImageUrl = (invoiceNo) => {
    if (!invoiceNo) return null;
    return `${BASE_URL}/api/invoice/get-file-bill?invoiceNo=${invoiceNo}`;
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
                  {order.invoice && order.invoice.invoiceNumber ? (
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                      <div className="relative min-h-[200px] flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                        <img
                          src={
                            getInvoiceImageUrl(order.invoice.invoiceNumber) ||
                            "/placeholder.svg"
                          }
                          alt="Hình ảnh hóa đơn"
                          className="w-full h-auto object-contain max-h-[400px] relative z-10"
                          onLoad={(e) => {
                            const target = e.target;
                            const parent = target.parentElement;
                            if (parent && parent.firstChild) {
                              parent.firstChild.classList.add("hidden");
                            }
                          }}
                          onError={(e) => {
                            const target = e.target;
                            target.classList.add("hidden");
                            const parent = target.parentElement;
                            if (parent) {
                              if (parent.firstChild) {
                                parent.firstChild.classList.add("hidden");
                              }
                              const errorDiv = document.createElement("div");
                              errorDiv.className =
                                "absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-500 p-4 text-center";
                              errorDiv.innerHTML = `
                                                                <p>Không thể tải hình ảnh hóa đơn</p>
                                                                <button class="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors">
                                                                    Thử lại
                                                                </button>
                                                            `;
                              errorDiv
                                .querySelector("button")
                                .addEventListener("click", () => {
                                  const timestamp = new Date().getTime();
                                  target.src = `${getInvoiceImageUrl(
                                    order.invoice.invoiceNumber
                                  )}&t=${timestamp}`;
                                  target.classList.remove("hidden");
                                  errorDiv.remove();
                                  if (parent.firstChild) {
                                    parent.firstChild.classList.remove(
                                      "hidden"
                                    );
                                  }
                                });
                              parent.appendChild(errorDiv);
                            }
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-md p-8 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                      <Image className="w-12 h-12 mb-2 text-gray-400" />
                      <p>Không có hình ảnh hóa đơn</p>
                    </div>
                  )}
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
                                width={"50px"}
                              />
                            </td>
                            <td className="border border-gray-200 px-3 py-2">
                              {item.productName}
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
                            colSpan={4}
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
