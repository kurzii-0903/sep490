import { createContext, useCallback } from "react";
import axios from "axios";


export const OrderContext = createContext();
export const OrderProvider = ({ children }) => {

    const createOrder = async (order) => {
        try {
            const response = await axios.post(`/api/Order/payment`, order);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw new Error("Không thể kết nối đến server!");
        }
    };

    const getAllOrders = useCallback(async () => {
        try {
            const response = await axios.get(`/api/Order/getall-orders`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng:", error.response?.data || error.message);
        }
    }, []);

    const getInvoiceImage = async (orderId) => {
        try {
            const response = await axios.get(`/api/Order/img/invoice?orderId=${orderId}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("Không tìm thấy ảnh chuyển khoản cho đơn hàng này");
                return null;
            }
            console.error("Lỗi khi lấy ảnh chuyển khoản:", error.response?.data || error.message);
            return { error: true, message: "Không thể tải ảnh chuyển khoản" };
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await axios.put(`/api/Order/confirm-order?orderId=${orderId}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật đơn hàng:", error.response?.data || error.message);
        }
    };

    return (
        <OrderContext.Provider value={{ createOrder, getAllOrders, getInvoiceImage, updateOrderStatus }}>
            {children}
        </OrderContext.Provider>
    );
};
