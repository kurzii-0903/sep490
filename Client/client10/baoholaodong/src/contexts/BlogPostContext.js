﻿import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;
export const BlogPostContext = createContext();

export const BlogPostProvider = ({ children }) => {
    const [blogPosts, setBlogPosts] = useState([]); 
    const [categories, setCategories] = useState([]); 
    const [categorySelected, setCategorySelected] = useState(0); 
    const [page, setPage] = useState(1); 
    const [size, setSize] = useState(8); 
    const [loading, setLoading] = useState(false); 
    const [hubConnection, setHubConnection] = useState(null);
    const [search, setSearch] = useState("");
    const [groupCategories, setGroupCategories] = useState([]);
    
    /** Lấy danh sách bài viết */
    const fetchBlogPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/BlogPost/get-blog-page`, {
                params: { categoryId: categorySelected, page, size }
            });
            setBlogPosts(response.data.items); 
        } catch (error) {
            console.error("Lỗi khi tải bài viết:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const getBlogsById = async (id) => {
        if (!id) {
          console.error("Invalid blog ID");
          return;
        }
        try {
          const response = await axios.get(`${BASE_URL}/api/BlogPost/get-blog-by-id/${id}`);
          return response.data;
        } catch (error) {
          console.error("Lỗi khi lấy thông tin bài viết:", error.response?.data || error.message);
        }
      };
      
    /** Lấy danh sách danh mục bài viết */
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/BlogPost/get-blog-categories`);
            setCategories(response.data); 
        } catch (error) {
            console.error("Lỗi khi lấy danh mục bài viết:", error.response?.data || error.message);
        }
    };

    /** Tạo bài viết mới */
    const createBlogPost = async (blogPost) => {
        try {         
            const response = await axios.post(`${BASE_URL}/api/BlogPost/create-blog`, blogPost);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo bài viết:", error.response?.data || error.message);
            throw error;
        }
    };
    const getCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/getall-category`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error);
            return [];
        }
    };
    
    /** Cập nhật bài viết */
    const updateBlogPost = async (blogPost) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/BlogPost/update-blog`, blogPost);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật bài viết:", error.response?.data || error.message);
            throw error;
        }
    };
  

    /** Xóa bài viết */
    const deleteBlogPost = async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/BlogPost/delete-blog/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa bài viết:", error.response?.data || error.message);
            throw error;
        }
    };

    /** Tìm kiếm bài viết */
    const searchBlogPost = async (value) => {
        if (!value.trim()) {
            fetchBlogPosts(); // Re-fetch blog posts if search term is empty
            return;
        }
        try {
            const response = await axios.get(`${BASE_URL}/api/BlogPost/search-blog`, {
                params: { title: value },
            });
            setBlogPosts(response.data);
        } catch (error) {
            console.error("Lỗi khi tìm kiếm bài viết:", error.response?.data || error.message);
        }
    };
  
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (search.trim() !== "") {
                searchBlogPost(search);
            } else {
                fetchBlogPosts();
            }
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [search]);
        /** Kết nối với SignalR */
        useEffect(() => {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${BASE_URL}/blogHub`)
                .withAutomaticReconnect()
                .build();
        
            connection.start()
                .then(() => setHubConnection(connection))
                .catch(err => console.error("Error connecting to SignalR Hub:", err));
        
            return () => {
                if (connection.state === signalR.HubConnectionState.Connected) {
                    connection.stop();
                }
            };
        }, []);
        useEffect(() => {
            if (!hubConnection) return;
        
            const handleBlogChange = (blogUpdated) => {
                setBlogPosts((prevBlog) =>
                    prevBlog.map((blog) =>
                        blog.id === blogUpdated.id ? blogUpdated : blog
                    )
                );
            };
        
            const handleCategoriesChange = (categoryUpdated) => {
                setCategories((prevCategories) => {
                    const index = prevCategories.findIndex(
                        (category) => category.id === categoryUpdated.id
                    );
                    if (index !== -1) {
                        const newCategories = [...prevCategories];
                        newCategories[index] = categoryUpdated;
                        return newCategories;
                    }
                    return [...prevCategories, categoryUpdated]; // Nếu không tìm thấy thì thêm mới
                });
            };
        
            // Lắng nghe các sự kiện SignalR
            hubConnection.on("BlogAdded", handleBlogChange);
            hubConnection.on("BlogUpdated", handleBlogChange);
            hubConnection.on("BlogDeleted", handleBlogChange);
            hubConnection.on("BlogCategoryAdded", handleCategoriesChange);
            hubConnection.on("BlogCategoryUpdated", handleCategoriesChange);
        
            // Cleanup event listeners khi component unmount hoặc khi hubConnection thay đổi
            return () => {
                hubConnection.off("BlogAdded", handleBlogChange);
                hubConnection.off("BlogUpdated", handleBlogChange);
                hubConnection.off("BlogDeleted", handleBlogChange);
                hubConnection.off("BlogCategoryAdded", handleCategoriesChange);
                hubConnection.off("BlogCategoryUpdated", handleCategoriesChange);
            };
        }, [hubConnection]);
    useEffect(() => {
        fetchBlogPosts();
    }, [categorySelected, page, size]);

    useEffect(() => {
        fetchCategories();
    }, []); 
    
   
    return (
        <BlogPostContext.Provider
            value={{
                blogPosts,
                categories,
                loading,
                categorySelected,
                setCategories,
                fetchCategories,
                groupCategories,
                page,
                size,
                setPage,
                setCategorySelected,
                setSize,
                setSearch,
                createBlogPost,
                updateBlogPost,
                deleteBlogPost,
                searchBlogPost,
                setCategories,
                fetchBlogPosts,
                getBlogsById,
                getCategories,
            }}
        >
            {children}
        </BlogPostContext.Provider>
    );
};