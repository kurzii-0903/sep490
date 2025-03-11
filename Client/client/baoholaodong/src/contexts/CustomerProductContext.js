import React, {createContext, useState, useEffect, useCallback} from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;
export const CustomerProductContext = createContext();
export const CustomerProductProvider =({ children }) => {
    const [topSaleProducts,setTopSaleProducts] = useState([]);
    const [hubConnection, setHubConnection] = useState(null);
    const [groupCategories, setGroupCategories] = useState([]);

    const searchProduct = async (value) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/Product/search-product`, {
                params: { title: value },
            });
            return response.data;
        } catch (error) {
            return [];
        }
    };
    /** Lấy thông tin chi tiết sản phẩm */
    const getProductById = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/Product/get-product-by-id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin sản phẩm:", error.response?.data || error.message);
        }
    };
    /**  get top sale product */
    const fetchTopSaleProducts = async (size) => {
        try{
            const response = await axios.get(`${BASE_URL}/api/Product/top-sale-product`,{
                params: {
                    size: size
                }
            });
            setTopSaleProducts(response.data || []);
        }catch(error){
            throw error;
        }
    }
    /**
     * get categories
     * */
    const fetchProductCategories = async () => {
        try{
            const response = await axios.get(`${BASE_URL}/api/product/getall-category`);
            console.log("Fetched categories:", response.data); // Debug log
            setGroupCategories(response.data);
        }catch(error){
            throw error;
        }
    }
    /** Kết nối với SignalR */
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${BASE_URL}/productHub`)
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => setHubConnection(connection))
            .catch(err => console.error("Lỗi khi kết nối SignalR:", err));

        return () => {
            if (connection.state === signalR.HubConnectionState.Connected) {
                connection.stop();
            }
        };
    }, []);

    /** Lắng nghe sự kiện từ SignalR */
    useEffect(() => {
        if (!hubConnection) return;
        const handleProductChange = (productUpdated) => {
            setTopSaleProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === productUpdated.id ? productUpdated : product
                )
            );

        };
        hubConnection.on("ProductUpdated", handleProductChange);
        hubConnection.on("ProductAdded", handleProductChange);
        hubConnection.on("ProductDeleted", handleProductChange);
        hubConnection.on("ProductCategoryAdded");
        hubConnection.on("ProductCategoryUpdated");
        return () => {
            hubConnection.off("ProductUpdated", handleProductChange);
            hubConnection.off("ProductAdded", handleProductChange);
            hubConnection.off("ProductDeleted", handleProductChange);
            hubConnection.off("ProductCategoryAdded");
            hubConnection.off("ProductCategoryUpdated");
        };
    }, [hubConnection]);

    useEffect(() => {
        const loadData = async () => {
            if (topSaleProducts.length === 0) {
                await fetchTopSaleProducts();
            }
            if (groupCategories.length === 0) {
                await fetchProductCategories();
            }

        };
        loadData();
    }, [topSaleProducts.length, groupCategories.length]);

    return (
        <CustomerProductContext.Provider
            value={{
                topSaleProducts,
                getProductById,
                groupCategories,
                fetchProductCategories,
                searchProduct,
            }}
        >
            {children}
        </CustomerProductContext.Provider>
    )
}