import React, {createContext, useState, useEffect, useContext} from "react";
import * as signalR from "@microsoft/signalr";
import axiosInstance, {setAxiosInstance} from '../axiosInstance';
import {AuthContext} from "./AuthContext";
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

    const {user} = useContext(AuthContext);
    useEffect(() => {
        if (user && user.token) {
            setAxiosInstance(user.token);
        }
    }, [user]);

    /** Lấy danh sách bài viết */
    const fetchBlogPosts = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/BlogPost/get-blog-page`, {
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
            const response = await axiosInstance.get(`/api/BlogPost/get-blog-by-id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin bài viết:", error.response?.data || error.message);
        }
    };

    /** Lấy danh sách danh mục bài viết */
    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(`/api/BlogPost/get-blog-categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục bài viết:", error.response?.data || error.message);
        }
    };

    /** Tạo bài viết mới */
    const createBlogPost = async (blogPost) => {
        try {
            const response = await axiosInstance.post(`/api/BlogPost/create-blog`, blogPost);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo bài viết:", error.response?.data || error.message);
            throw error;
        }
    };

    /** Cập nhật bài viết */
    const updateBlogPost = async (blogPost) => {
        try {
            const response = await axiosInstance.put(`/api/BlogPost/update-blog`, blogPost);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật bài viết:", error.response?.data || error.message);
            throw error;
        }
    };

    /** Xóa bài viết */
    const deleteBlogPost = async (id) => {
        try {
            const response = await axiosInstance.delete(`/api/BlogPost/delete-blog/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa bài viết:", error.response?.data || error.message);
            throw error;
        }
    };

    /** Tìm kiếm bài viết */
    const searchBlogPost = async (value) => {
        if (!value.trim()) {
            fetchBlogPosts();
            return;
        }
        try {
            const response = await axiosInstance.get(`/api/BlogPost/search-blog`, {
                params: { title: value },
            });
            setBlogPosts(response.data);
        } catch (error) {
            console.error("Lỗi khi tìm kiếm bài viết:", error.response?.data || error.message);
        }
    };

    /** Tạo danh mục bài viết mới */
    const createBlogCategory = async (categoryData) => {
        try {
            setLoading(true);
            const response = await axiosInstance.post(`/api/BlogPost/create-blog-category`, categoryData);
            const newCategory = response.data; // { id, name, description, createdAt, updatedAt }
            setCategories((prevCategories) => [...prevCategories, newCategory]);
            return newCategory;
        } catch (error) {
            console.error("Lỗi khi tạo danh mục bài viết:", error.response?.data || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /** Cập nhật danh mục bài viết */
    const updateBlogCategory = async (categoryData) => {
        try {
            setLoading(true);
            const response = await axiosInstance.put(`/api/BlogPost/update-blog-category`, categoryData);
            const updatedCategory = response.data; // { id, name, description, createdAt, updatedAt }
            setCategories((prevCategories) =>
                prevCategories.map((cat) =>
                    cat.id === updatedCategory.id ? updatedCategory : cat
                )
            );
            return updatedCategory;
        } catch (error) {
            console.error("Lỗi khi cập nhật danh mục bài viết:", error.response?.data || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // SignalR
    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`/blogHub`)
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
                return [...prevCategories, categoryUpdated];
            });
        };

        hubConnection.on("BlogAdded", handleBlogChange);
        hubConnection.on("BlogUpdated", handleBlogChange);
        hubConnection.on("BlogDeleted", handleBlogChange);
        hubConnection.on("BlogCategoryAdded", handleCategoriesChange);
        hubConnection.on("BlogCategoryUpdated", handleCategoriesChange);

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

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (search.trim() !== "") {
                searchBlogPost(search);
            } else {
                fetchBlogPosts(); // ✅ Chỉ gọi lại khi clear tìm kiếm
            }
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [search]);


    return (
        <BlogPostContext.Provider
            value={{
                blogPosts,
                categories,
                loading,
                categorySelected,
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
                createBlogCategory,
                updateBlogCategory,
            }}
        >
            {children}
        </BlogPostContext.Provider>
    );
};