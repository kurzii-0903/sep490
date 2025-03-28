import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import "./style.css";

function OrderHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { userId } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL_API;
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const fetchOrders = useCallback(
    async (query = "") => {
      try {
        setLoading(true);
        let url;
        if (query) {
          url = `${BASE_URL}/api/Order/get-page-orders?emailOrPhone=${encodeURIComponent(
            query
          )}`;
        } else {
          url = `${BASE_URL}/api/Order/get-page-orders?customerId=${userId}&page=${currentPage}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(Array.isArray(data.items) ? data.items : []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    },
    [userId, currentPage]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatCurrency = (amount) => {
    return amount !== undefined && amount !== null
      ? `${amount.toLocaleString("vi-VN")} đ`
      : "0 đ";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <span className="oh-status-badge completed">Đã hoàn thành</span>;
      case "processing":
        return <span className="oh-status-badge processing">Đang xử lý</span>;
      case "pending":
        return <span className="oh-status-badge pending">Chờ xác nhận</span>;
      case "cancelled":
        return <span className="oh-status-badge cancelled">Đã bị huỷ</span>;
      default:
        return null;
    }
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
    return <div>Đang tải...</div>;
  }

  return (
    <div className="oh-order-history-container">
      <h2 className="oh-order-history-title">Lịch sử đơn hàng</h2>

      <div className="oh-search-container">
        <input
          type="text"
          placeholder="Nhập email hoặc số điện thoại để tìm kiếm..."
          className="oh-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="oh-search-button" onClick={handleSearch}>
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

      {orders.length === 0 ? (
        <div className="oh-no-orders">Không có đơn hàng nào.</div>
      ) : (
        <div className="oh-orders-list">
          {orders.map((order) => (
            <div key={order.orderId} className="oh-order-item">
              <div className="oh-order-header">
                <div className="oh-order-info">
                  <div className="oh-order-detail">
                    <span className="oh-label">Mã đơn hàng:</span>
                    <span>{order.orderId}</span>
                  </div>
                  <div className="oh-order-detail">
                    <span className="oh-label">Ngày đặt:</span>
                    <span>{formatDate(order.orderDate)}</span>
                  </div>
                </div>
                <div className="oh-order-status">
                  {renderStatusBadge(order.status)}
                </div>
              </div>

              <div className="oh-order-products">
                {order.orderDetails.map((item) => (
                  <div key={item.orderDetailId} className="oh-product-item">
                    <div className="oh-product-info">
                      <span>{item.productName}</span>
                      <span className="oh-quantity">x{item.quantity}</span>
                    </div>
                    <div className="oh-product-price">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="oh-order-total">
                <span className="oh-total-label">Tổng tiền:</span>
                <div className="oh-total-amount">
                  {formatCurrency(order.totalAmount)}
                </div>
              </div>

              {order.status?.toLowerCase() === "completed" && (
                <div className="oh-order-actions">
                  <button
                    className="oh-buy-again-button"
                    onClick={() => handleBuyAgain(order)}
                  >
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
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span>Mua lại</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="oh-pagination">
        <div className="oh-pagination-info">
          Hiển thị {orders.length} đơn hàng (Tổng: {orders.length})
        </div>
        {totalPages > 1 && (
          <div className="oh-pagination-controls">
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
  );
}

export default OrderHistory;
