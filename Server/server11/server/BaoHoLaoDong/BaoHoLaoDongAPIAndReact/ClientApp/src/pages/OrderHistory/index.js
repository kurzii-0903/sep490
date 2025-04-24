import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { AuthContext } from "../../contexts/AuthContext";
import { setAxiosInstance } from "../../axiosInstance";
import { formatVND } from "../../utils/format";
import axios from "axios";
import "./style.css";

function OrderHistory() {
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [totalItems, setTotalItems] = useState(0);
    const [status, setStatus] = useState("all");
    const userId = user?.userId;

    useEffect(() => {
        if (!user || !userId) {
            navigate("/login");
            return;
        }
        if (user.token && user.role === "Customer") {
            setAxiosInstance(user.token);
        }
    }, [user, userId, navigate]);

    const fetchOrders = useCallback(
        async (query = "") => {
            try {
                setLoading(true);
                let url;
                if (query) {
                    url = `/api/Order/get-page-orders?emailOrPhone=${encodeURIComponent(query)}`;
                } else {
                    url = `/api/Order/get-page-orders?customerId=${userId}&page=${currentPage}&status=${status === "all" ? "" : status}`;
                }

                const response = await axios.get(url);
                setOrders(
                    Array.isArray(response.data.items) ? response.data.items : []
                );
                setTotalPages(response.data.totalPages || 1);
                setTotalItems(response.data.totalItems || 0);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        },
        [userId, currentPage, status]
    );

    useEffect(() => {
        if (user && userId && user.role === "Customer") {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user, userId, fetchOrders]);

    const handleSearch = () => {
        if (user.role !== "Customer") return; // Không cho phép tìm kiếm với admin/manager
        setCurrentPage(1);
        fetchOrders(searchQuery);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        if (user.role !== "Customer") return; // Chỉ cho phép Customer cập nhật
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
                detailResponse = await axios.get(`/api/Order/get-order/${orderId}`);
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
            ? `${amount.toLocaleString("vi-VN")} đ`
            : "0 đ";
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

        return `${day} ${time}`;
    };


    const renderStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return <span className="oh-status-badge completed">Đã hoàn thành</span>;
            case "pending":
                return <span className="oh-status-badge pending">Chờ xác nhận</span>;
            case "cancelled":
                return <span className="oh-status-badge cancelled">Đã bị huỷ</span>;
            case "received":
                return <span className="oh-status-badge received">Đã nhận hàng</span>;
            default:
                return <span className="oh-status-badge unknown">Không xác định</span>;
        }
    };

    const handleBuyAgain = (order) => {
        if (user.role !== "Customer") return;
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
                variantId: item.variantId || null,
                size: item.size || null,
                color: item.color || null,
                price: item.totalPrice / item.quantity,
                discount: item.productDiscount || 0,
                quantity: item.quantity + 10,
            };

            const product = {
                id: item.productId || item.orderDetailId || Date.now(),
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
        if (user.role !== "Customer") return; 
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="order-history-container">
            {loading && <div className="order-history-container">Đang tải...</div>}
            {!loading && (
                <>
                    <h2 className="page-title">Lịch sử đơn hàng</h2>
                    {user.role !== "Customer" ? (
                        <div className="oh-no-orders">Không có thông tin dành cho quản trị viên.</div>
                    ) : (
                        <>
                            <div className="search-container">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="Pending">Đang xử lý</option>
                                    <option value="Completed">Hoàn thành</option>
                                    <option value="Cancelled">Đã hủy</option>
                                </select>
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
                                                        - {item.productName} x {item.quantity}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="cell order-total">
                                                {formatVND(order.totalAmount)}
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
                                                        <button
                                                            className="action-button received"
                                                            onClick={() => handleConfirmReceived(order.orderId)}
                                                            disabled={updatingOrderId === order.orderId}
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
                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                            </svg>
                                                            <span>Đã nhận được hàng</span>
                                                        </button>
                                                    </>
                                                )}
                                                {order.status?.toLowerCase() === "received" && (
                                                    <button
                                                        className="action-button buy-again"
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
                                                )}
                                                {order.status?.toLowerCase() === "pending" && (
                                                    <button
                                                        className="action-button cancel"
                                                        onClick={() => handleCancelOrder(order.orderId)}
                                                        disabled={updatingOrderId === order.orderId}
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
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                        <span>Hủy đơn hàng</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="pagination">
                                <div className="pagination-info">
                                    Hiển thị {orders.length} đơn hàng (Tổng: {totalItems})
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
                        </>
                    )}
                </>
            )}
        </div>
    );
}
export default OrderHistory;