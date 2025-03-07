import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;
export const BlogPostContext = createContext();

export const BlogPostProvider = ({ children }) => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [categorySelected, setCategorySelected] = useState(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);

    const fetchBlogPosts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/BlogPost/get-blog-page`, {
                params: { categoryId: categorySelected, page, size }
            });
            setBlogPosts(response.data.items);
        } catch (error) {
            console.error("Lỗi khi tải bài viết:", error);
        }
    };

    // Sử dụng useEffect để fetch dữ liệu khi categorySelected, page, hoặc size thay đổi
    useEffect(() => {
        fetchBlogPosts();
    }, [categorySelected, page, size]); // Chỉ gọi API khi các giá trị này thay đổi

    return (
        <BlogPostContext.Provider value={{ blogPosts, setCategorySelected, setPage, setSize }}>
            {children}
        </BlogPostContext.Provider>
    );
};
