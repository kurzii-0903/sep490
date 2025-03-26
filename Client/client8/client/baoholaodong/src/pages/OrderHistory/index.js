import { useState, useEffect, useContext } from "react";
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/api/Order/get-page-orders?customerId=${userId}`
        );

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
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId, currentPage]);

  // Lọc đơn hàng dựa trên truy vấn tìm kiếm
  const filteredOrders = Array.isArray(orders)
    ? orders.filter(
        (order) =>
          order.orderId
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.orderDetails?.some((item) =>
            item.productName?.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : [];

  // Định dạng tiền tệ
  const formatCurrency = (amount) => {
    return `${amount.toLocaleString("vi-VN")} đ`;
  };

  // Định dạng ngày theo DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Hiển thị badge trạng thái
  const renderStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "Completed":
        return <span className="status-badge completed">Đã hoàn thành</span>;
      case "Processing":
        return <span className="status-badge processing">Đang xử lý</span>;
      case "Pending":
        return <span className="status-badge pending">Chờ xác nhận</span>;
      default:
        return null;
    }
  };

  // Xử lý hành động "Mua lại"
  const handleBuyAgain = (order) => {
    order.orderDetails.forEach((item) => {
      const product = {
        id: item.orderDetailId,
        price: item.totalPrice / item.quantity,
        quantity: item.quantity,
        name: item.productName,
        discount: item.productDiscount,
        selectedVariant: null,
      };
      addToCart(product);
    });

    // Chuyển hướng sang trang Checkout
    navigate("/checkout");
  };

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="order-history-container">
      <h2 className="order-history-title">Lịch sử đơn hàng</h2>

      {/* Thanh tìm kiếm */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm đơn hàng..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="search-icon">
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
        </span>
      </div>

      {/* Danh sách đơn hàng */}
      {filteredOrders.length === 0 ? (
        <div className="no-orders">Không có đơn hàng nào.</div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.orderId} className="order-item">
              <div className="order-header">
                <div className="order-info">
                  <div className="order-detail">
                    <span className="label">Mã đơn hàng:</span>
                    <span>{order.orderId}</span>
                  </div>
                  <div className="order-detail">
                    <span className="label">Ngày đặt:</span>
                    <span>{formatDate(order.orderDate)}</span>
                  </div>
                </div>
                <div className="order-status">
                  {renderStatusBadge(order.status)}
                </div>
              </div>

              {/* Chi tiết sản phẩm trong đơn hàng */}
              <div className="order-products">
                {order.orderDetails.map((item) => (
                  <div key={item.orderDetailId} className="product-item">
                    <div className="product-info">
                      <span>{item.productName}</span>
                      <span className="quantity">x{item.quantity}</span>
                    </div>
                    <div className="product-price">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tổng tiền */}
              <div className="order-total">
                <span className="total-label">Tổng tiền:</span>
                <div className="total-amount">
                  {formatCurrency(order.totalAmount)}
                </div>
              </div>

              {/* Nút hành động */}
              {order.status.toLowerCase() === "completed" && (
                <div className="order-actions">
                  <button
                    className="buy-again-button"
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

      {/* Phân trang */}
      <div className="pagination">
        <div className="pagination-info">
          Hiển thị {filteredOrders.length} đơn hàng (Tổng: {orders.length})
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
  );
}

export default OrderHistory;