import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import "./style.css";

const OrderHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const userId = user?.userId;

  const tabs = [];

  const fetchOrders = useCallback(
    async (query = "") => {
      try {
        setLoading(true);
        let url;
        if (query) {
          url = `/api/Order/get-page-orders?emailOrPhone=${encodeURIComponent(
            query
          )}`;
        } else {
          url = `/api/Order/get-page-orders?customerId=${userId}&page=${currentPage}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setOrders(
          Array.isArray(response.data.items) ? response.data.items : []
        );
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    },
    [userId, currentPage, user?.token]
  );

  useEffect(() => {
    if (!user || !userId) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, userId, navigate, fetchOrders]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (updatingOrderId) return;

    setUpdatingOrderId(orderId);
    try {
      if (!user?.token) {
        alert("Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }

      const payload = { orderId, status: newStatus };
      await axios.put(`/api/Order/confirm-order-by-customer`, payload, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type":
            "application/json;odata.metadata=minimal;odata.streaming=true",
          accept: "*/*",
        },
      });

      let attempts = 0;
      const maxAttempts = 15;
      const delay = 11000;
      let detailResponse;
      while (attempts < maxAttempts) {
        detailResponse = await axios.get(`/api/Order/get-order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (detailResponse.data.status === newStatus) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempts++;
      }

      if (
        attempts === maxAttempts &&
        detailResponse.data.status !== newStatus
      ) {
        alert("Cập nhật trạng thái thất bại. Vui lòng thử lại sau.");
        return;
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? detailResponse.data : order
        )
      );
    } catch (err) {
      alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      updateOrderStatus(orderId, "Cancelled");
    }
  };

  const handleConfirmReceived = (orderId) => {
    if (window.confirm("Bạn xác nhận đã nhận được đơn hàng?")) {
      updateOrderStatus(orderId, "Received");
    }
  };

  const formatCurrency = (amount) => {
    return amount !== undefined && amount !== null
      ? `${amount.toLocaleString("vi-VN")}`
      : "0";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const day = date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return `${time}, ${day}`;
  };

  const handleBuyAgain = (order) => {
    if (!order || !order.orderDetails || !Array.isArray(order.orderDetails)) {
      console.error("Invalid order data:", order);
      return;
    }

    order.orderDetails.forEach((item) => {
      if (!item.totalPrice || !item.quantity || !item.productName) {
        console.error("Invalid order detail:", item);
        return;
      }

      const selectedVariant = {
        size: item.size || null,
        color: item.color || null,
        price: item.totalPrice / item.quantity,
        discount: item.productDiscount || 0,
        quantity: item.quantity + 10,
      };

      const product = {
        id: item.orderDetailId || Date.now(),
        name: item.productName,
        image: item.image || null,
        quantity: item.quantity,
        price: item.totalPrice / item.quantity,
        finalPrice: item.totalPrice / item.quantity,
        originalPrice: item.totalPrice / item.quantity,
        discount: item.productDiscount || 0,
        selectedVariant:
          selectedVariant.size || selectedVariant.color
            ? selectedVariant
            : null,
        quantityInStock: item.quantity + 10,
      };

      addToCart(product);
    });

    navigate("/cart");
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div className="order-history-container">Đang tải...</div>;
  }

  return (
    <div className="order-history-container">
      <div className="main-content">
        <h1 className="page-title">Quản lý đơn hàng</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Nhập email hoặc số điện thoại để tìm kiếm..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Tìm kiếm
          </button>
        </div>

        <div className="orders-table">
          <div className="table-header">
            <div className="header-cell">Mã đơn hàng</div>
            <div className="header-cell">Tên người đặt</div>
            <div className="header-cell">Sản phẩm</div>
            <div className="header-cell">Tổng tiền</div>
            <div className="header-cell">Ngày đặt hàng</div>
            <div className="header-cell">Trạng thái</div>
            <div className="header-cell">Hành động</div>
          </div>

          {orders.length === 0 ? (
            <div className="no-orders">Không có đơn hàng nào.</div>
          ) : (
            orders.map((order) => (
              <div key={order.orderId} className="table-row">
                <div className="cell order-id">{order.orderId}</div>
                <div className="cell customer-name">
                  {order.fullName || "N/A"}
                </div>
                <div className="cell order-product">
                  {order.orderDetails?.map((item) => (
                    <div key={item.orderDetailId}>
                      {item.productName} x{item.quantity}
                    </div>
                  ))}
                </div>
                <div className="cell order-total">
                  {formatCurrency(order.totalAmount)}đ
                </div>
                <div className="cell order-date">
                  {formatDate(order.orderDate)}
                </div>
                <div className="cell order-status">
                  {(() => {
                    switch (order.status?.toLowerCase()) {
                      case "completed":
                        return (
                          <span className="status-badge completed">
                            Đã hoàn thành
                          </span>
                        );
                      case "pending":
                        return (
                          <span className="status-badge pending">
                            Chờ xác nhận
                          </span>
                        );
                      case "cancelled":
                        return (
                          <span className="status-badge cancelled">
                            Đã bị huỷ
                          </span>
                        );
                      case "received":
                        return (
                          <span className="status-badge received">
                            Đã nhận hàng
                          </span>
                        );
                      default:
                        return (
                          <span className="status-badge unknown">
                            Không xác định
                          </span>
                        );
                    }
                  })()}
                </div>
                <div className="cell order-actions">
                  {order.status?.toLowerCase() === "completed" && (
                    <>
                      <button
                        className="action-button buy-again"
                        onClick={() => handleBuyAgain(order)}
                      >
                        Mua lại
                      </button>
                      <button
                        className="action-button received"
                        onClick={() => handleConfirmReceived(order.orderId)}
                        disabled={updatingOrderId === order.orderId}
                      >
                        Đã nhận hàng
                      </button>
                    </>
                  )}
                  {order.status?.toLowerCase() === "received" && (
                    <button
                      className="action-button buy-again"
                      onClick={() => handleBuyAgain(order)}
                    >
                      Mua lại
                    </button>
                  )}
                  {order.status?.toLowerCase() === "pending" && (
                    <button
                      className="action-button cancel"
                      onClick={() => handleCancelOrder(order.orderId)}
                      disabled={updatingOrderId === order.orderId}
                    >
                      Hủy đơn
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pagination">
          <div className="pagination-info">
            Hiển thị {orders.length} đơn hàng (Tổng: {orders.length})
          </div>
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Trước
              </button>
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
