import React, { createContext, useState, useEffect } from "react";
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
    const [hubConnection, setHubConnection] = useState(null);
    const [search, setSearch] = useState("");
    const [groupCategories, setGroupCategories] = useState([]);


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
    const getCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/getall-category`); // API backend lấy danh mục
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
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <BlogPostContext.Provider
            value={{
                blogPosts,
                setBlogPosts,
                categories,
                categorySelected,
                groupCategories,
                page,
                size,
                setPage,
                setCategorySelected,
                setSize,
                setSearch,
                updateBlogPost,
                deleteBlogPost,
                setCategories,
                fetchCategories,
                getBlogsById,
                getCategories,
            }}
        >
            {children}
        </BlogPostContext.Provider>
    );
};