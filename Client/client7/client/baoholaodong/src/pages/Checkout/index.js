import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../../contexts/CartContext";
import { OrderContext } from "../../contexts/OrderContext";
import Loading from "../../components/Loading/Loading";
import "./style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
const BASE_URL = process.env.REACT_APP_BASE_URL_API;

const Checkout = () => {
  const navigate = useNavigate();
  const bankName = "tpb";
  const accountNumber = "29909302002";
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);

  const [quantity] = useState(
    cartItems.reduce((total, item) => total + item.quantity, 0)
  );
  const [file, setFile] = useState(null);
  const [isRequired, setIsRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [hubConnection, setHubConnection] = useState(null);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invoice = params.get("invoiceNumber");
    setInvoiceNumber(invoice);
  }, []);

  useEffect(() => {
    // Khởi tạo kết nối SignalR
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/orderHub`)
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Kết nối đến SignalR thành công!");
      })
      .catch((err) => console.error("Lỗi kết nối SignalR:", err));

    setHubConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  const handleConfirmPayment = async () => {
    try {
      if (!file) {
        alert("Vui lòng tải lên ảnh xác nhận thanh toán trước.");
        return;
      }
      setIsLoading(true);
      const formData = new FormData();
      formData.append("File", file);
      formData.append("InvoiceNumber", invoiceNumber);
      formData.append("Status", "pending");
      console.log("formData:", formData);
      const response = await axios.put(
        `${BASE_URL}/api/Invoice/confirm-invoice-by-customer`,
        formData
      );
      setIsLoading(false);
      alert("Xác nhận thanh toán thành công!");
      navigate("/");
    } catch (error) {
      console.log("Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <Loading isLoading={isLoading} />
      <div className="checkout-content">
        <div className="checkout-right">
          <div className="order-summary-header">
            <h3>Đơn hàng</h3>
            <span className="total-quantity">({quantity} sản phẩm)</span>
          </div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - {item.quantity} x {item.price.toLocaleString()}đ
              </li>
            ))}
          </ul>
          <div className="subtotal">
            <strong>Tạm tính: {totalPrice.toLocaleString()}đ</strong>
          </div>
          <div className="shipping-fee">
            <strong>Phí vận chuyển: 30,000đ</strong>
          </div>
          <div className="total-price">
            <strong>Tổng cộng: {(totalPrice + 30000).toLocaleString()}đ</strong>
          </div>
          <div className="payment-proof">
            <h3>QR Thanh toán</h3>
            <div
              style={{
                overflow: "hidden",
                width: "100%",
                height: "500px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                id="previewImage"
                src={`https://vietqr.co/api/generate/${bankName}/${accountNumber}/VIETQR.CO/${
                  totalPrice + 30000
                }/chuyenkhoan`}
                alt="Xem trước hình ảnh"
                className="preview-image"
                style={{ clipPath: "inset(33% 25% 33% 25%)" }}
              />
            </div>
            <div className="file-upload-container">
              <input
                type="file"
                id="paymentProof"
                form="shipping-form-id"
                name="paymentProof"
                accept="image/*"
                className="file-input"
                onChange={handleFileChange}
                required={isRequired}
              />
            </div>
            <button
              className="confirm-payment-btn"
              onClick={handleConfirmPayment}
              disabled={!file}
              style={{
                backgroundColor: file ? "#007bff" : "#cccccc",
                cursor: file ? "pointer" : "not-allowed",
              }}
            >
              Xác nhận thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
