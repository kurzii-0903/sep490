import { createContext, useCallback } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

export const OrderContext = createContext();
export const OrderProvider = ({ children }) => {

    const createOrder = async (order) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/Order/payment`, order);
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
            const response = await axios.get(`${BASE_URL}/api/Order/getall-orders`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error.response?.data || error.message);
        }
    }, []);

    const getInvoiceImage = async (orderId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/Order/img//${orderId}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error.response?.data || error.message);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/Order/update-status/${orderId}`, { status });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error.response?.data || error.message);
        }
    };

    return (
        <OrderContext.Provider value={{ createOrder, getAllOrders }}>
            {children}
        </OrderContext.Provider>
    );
};
