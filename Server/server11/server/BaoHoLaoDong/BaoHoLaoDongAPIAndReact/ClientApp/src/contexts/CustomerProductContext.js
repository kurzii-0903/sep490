import React, {createContext, useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export const CustomerProductContext = createContext();
export const CustomerProductProvider =({ children  }) => {
    const [topSaleProducts,setTopSaleProducts] = useState([]);
    const [topDealProducts,setTopDealProducts] = useState([]);
    const [hubConnection, setHubConnection] = useState(null);
    const [groupCategories, setGroupCategories] = useState([]);
    const navigate = useNavigate();
    const searchProduct = async (value) => {
        try {
            const response = await axios.get(`/api/Product/search-product`, {
                params: { title: value },
            });
            return response.data;
        } catch (error) {
            return [];
        }
    };
    const getProductPage = async (group,category,page,size) => {
        try {
            const response = await axios.get(`/api/Product/get-product-page`, {
                params: {group:group, category: category, page: page, pagesize: size },
            });
            return response.data;
        } catch (error) {

        } finally {

        }
    }
    /** Lấy thông tin chi tiết sản phẩm */
    const getProductById = async (id) => {
        try {
            const response = await axios.get(`/api/Product/get-product-by-id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin sản phẩm:", error.response?.data || error.message);
        }
    };
    /**  get top sale product */
    const fetchTopSaleProducts = async (size) => {
        try{
            const response = await axios.get(`/api/Product/top-sale-product`,{
                params: {
                    size: size
                }
            });
            console.log(response.data.length);
            setTopSaleProducts(response.data || []);
        }catch(error){
            return [];
        }
    }
    const fetchTopDealProducts = async (size,minDiscount) => {
        try{
            const response = await axios.get(`/api/Product/top-deal`,{
                params: {
                    size: size,
                    minDiscountPercent: minDiscount,
                }
            });
            setTopDealProducts(response.data || []);
        }catch(error){
            return [];
        }
    }
    const fetchReviewProduct= async (id,size) => {
        try{
            const response = await axios.get(`/api/Product/reviews`,{
                params: {
                    size:size,
                    id:id
                }
            })
            return response.data
        }catch(error){
            return null;
        }
    }
    const fetchRelatedProducts = async (id,size) => {
        try{
            const response = await axios.get(`/api/Product/related`, {
                params: {
                    size:size,
                    id:id,
                }
            })
            return response.data;
        }catch (error){
            return [];
        }
    }
    /**
     * get categories
     * */
    const fetchProductCategories = async () => {
        try{
            const response = await axios.get(`/api/product/getall-category`);
            console.log("Fetched categories:", response.data); // Debug log
            setGroupCategories(response.data);
        }catch(error){
            return [];
        }
    }

    useEffect(() => {
        const loadData = async () => {
            if (topSaleProducts.length === 0) {
                await fetchTopSaleProducts(15);
            }
            if (groupCategories.length === 0) {
                await fetchProductCategories();
            }
            if(topDealProducts.length === 0) {
                await fetchTopDealProducts(10,10);
            }
        };
        loadData();
    }, [topSaleProducts.length, groupCategories.length, topDealProducts.length]);

    return (
        <CustomerProductContext.Provider
            value={{
                topSaleProducts,
                getProductById,
                groupCategories,
                fetchProductCategories,
                searchProduct,
                getProductPage,
                topDealProducts,
                fetchRelatedProducts,
                fetchReviewProduct,
            }}
        >
            {children}
        </CustomerProductContext.Provider>
    )
}