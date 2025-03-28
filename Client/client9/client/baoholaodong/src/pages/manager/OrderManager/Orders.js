import React, { useState, useEffect, useCallback } from "react";
import { SquarePen, Eye, Plus, CheckCircle, XCircle } from "lucide-react";
import Modal from "../../../components/Modal/Modal";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";
import { formatVND } from "../../../utils/format";
const BASE_URL = process.env.REACT_APP_BASE_URL_API;

const Orders = () => {
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [startDateString, setStartDateString] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDateString, setEndDateString] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/Order/get-page-orders?page=${currentPage}&pageSize=10&customerName=${searchName}&startDate=${startDateString}&endDate=${endDateString}&status=${
            status === "all" ? "" : status
          }`
        );
        const detailedOrders = await Promise.all(
          response.data.items.map(async (order) => {
            const detailResponse = await axios.get(
              `${BASE_URL}/api/Order/get-order/${order.orderId}`
            );
            return detailResponse.data;
          })
        );
        setOrders(detailedOrders || []);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [currentPage, searchName, startDateString, endDateString, status]);

  const connectToHub = useCallback(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/orderHub`)
      .withAutomaticReconnect()
      .build();
    connection
      .start()
      .then(() => {})
      .catch((err) => console.error("SignalR Connection Error:", err));
    connection.on("NewOrderCreated", async (newOrder) => {
      const detailResponse = await axios.get(
        `${BASE_URL}/api/Order/get-order/${newOrder.orderId}`
      );
      setOrders((prevOrders) => [detailResponse.data, ...prevOrders]);
    });
    return connection;
  }, []);

  useEffect(() => {
    const hubConnection = connectToHub();
    return () => {
      hubConnection.stop();
    };
  }, [connectToHub]);

  const updateOrderStatus = async (orderId, invoiceNumber, newStatus) => {
    if (updatingOrderId) return;
    if (!invoiceNumber) {
      alert("Không có thông tin hóa đơn để cập nhật trạng thái.");
      return;
    }
    setUpdatingOrderId(orderId);
    try {
      await axios.put(
        `${BASE_URL}/api/invoice/confirm-invoice-by-employee/${invoiceNumber}/${newStatus}`
      );
      const detailResponse = await axios.get(
        `${BASE_URL}/api/Order/get-order/${orderId}`
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? detailResponse.data : order
        )
      );
    } catch (err) {
      alert("Cập nhật trạng thái đơn hàng thất bại.");
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCreate = () => {
    navigate("/manager/create-order");
  };

  const handleStartDateChange = (e) => {
    if (!e.target.value) {
      setStartDate(null);
      setStartDateString("");
      return;
    }
    const formattedDate = formatDate(e.target.value);
    setStartDate(e.target.value);
    setStartDateString(formattedDate);
  };

  const handleEndDateChange = (e) => {
    if (!e.target.value) {
      setEndDate(null);
      setEndDateString("");
      return;
    }
    const formattedDate = formatDate(e.target.value);
    setEndDate(e.target.value);
    setEndDateString(formattedDate);
  };

  const formatDate = (date) => {
    const [day, month, year] = new Date(date)
      .toLocaleDateString("en-GB")
      .split("/");
    return `${day}${month}${year}`;
  };

  const handleViewInvoiceImage = (invoiceNumber) => {
    if (invoiceNumber) {
      const imageUrl = `${BASE_URL}/api/invoice/get-file-bill?invoiceNo=${invoiceNumber}`;
      setSelectedImageUrl(imageUrl);
      setIsOpenImage(true);
    } else {
      alert("Không có hình ảnh hóa đơn cho đơn hàng này.");
    }
  };

  return (
    <div className="space-x-6">
      <div className="bg-white rounded-lg shadow pt-6">
        <div className="flex p-6 border-b justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Quản lý đặt hàng
          </h3>
          <div className="flex space-x-4">
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value === "all" ? null : e.target.value)
              }
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="Pending">Đang xử lý</option>
              <option value="Confirmed">Hoàn thành</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Tên khách hàng..."
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Từ ngày"
            />
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              placeholder="Đến ngày"
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min={startDate}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
              onClick={handleCreate}
            >
              <Plus className="w-5 h-5 mr-2" />
              Tạo đơn hàng
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên khách hàng
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt hàng
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng thành tiền
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length > 0 &&
                  orders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.orderId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.orderDate).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${
                                                          order.status ===
                                                          "Pending"
                                                            ? "bg-yellow-200 text-yellow-800"
                                                            : order.status ===
                                                              "Cancelled"
                                                            ? "bg-red-300 text-red-800"
                                                            : order.status ===
                                                              "Confirmed"
                                                            ? "bg-green-300 text-green-800"
                                                            : "bg-blue-200 text-blue-800"
                                                        }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatVND(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() =>
                            navigate(`/manager/order-detail/${order.orderId}`)
                          }
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleViewInvoiceImage(order.invoice?.invoiceNumber)
                          }
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          disabled={!order.invoice?.invoiceNumber}
                          title="Xem hóa đơn"
                        >
                          <SquarePen className="h-5 w-5" />
                        </button>
                        {order.status === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  order.orderId,
                                  order.invoice?.invoiceNumber,
                                  "Confirmed"
                                )
                              }
                              className="text-green-600 hover:text-green-900 mr-4 disabled:opacity-50"
                              disabled={
                                updatingOrderId === order.orderId ||
                                !order.invoice?.invoiceNumber
                              }
                              title="Xác nhận đơn hàng"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  order.orderId,
                                  order.invoice?.invoiceNumber,
                                  "Cancelled"
                                )
                              }
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              disabled={
                                updatingOrderId === order.orderId ||
                                !order.invoice?.invoiceNumber
                              }
                              title="Hủy đơn hàng"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="p-6 flex justify-center mt-4">
              {orders.length !== 0 ? (
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() =>
                      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-200"
                  >
                    <i className="fas fa-angle-left"></i>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(() => Number(page))}
                        className={`px-3 py-1 border rounded-md ${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((prevPage) =>
                        Math.min(prevPage + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-200"
                  >
                    <i className="fas fa-angle-right"></i>
                  </button>
                </nav>
              ) : (
                ""
              )}
            </div>
          </div>
          <Modal
            isOpen={isOpenImage}
            onClose={() => setIsOpenImage(false)}
            title={"Hình ảnh chuyển khoản"}
          >
            <div className="p-6">
              {selectedImageUrl ? (
                <img
                  src={selectedImageUrl}
                  alt="Invoice Image"
                  className="max-w-full h-auto"
                />
              ) : (
                <p>Không có hình ảnh</p>
              )}
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Orders;
