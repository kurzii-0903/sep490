import React, { createContext, useState, useEffect, useContext } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const BlogPostContext = createContext();

export const BlogPostProvider = ({ children }) => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categorySelected, setCategorySelected] = useState(0);
    const [page, setPage] = useState(1);
    const [size] = useState(20); // Sử dụng size=20 để lấy từng trang
    const [loading, setLoading] = useState(false);
    const [hubConnection, setHubConnection] = useState(null);
    const [search, setSearch] = useState("");
    const [groupCategories, setGroupCategories] = useState([]);
    
    
    useEffect(() => {
        if(categorySelected){
            setPage(1);
        }
    }, [categorySelected]);
    /** Lấy tất cả bài viết */
    const fetchBlogPosts = async (resetCategory = false) => {
        setLoading(true);
        try {
            const categoryId = resetCategory ? 0 : categorySelected;
            let allPosts = [];
            let currentPage = 1;
            let totalPages = 1;

            // Lặp để lấy tất cả trang
            while (currentPage <= totalPages) {
                const params = { page: currentPage, size };
                if (categoryId !== 0) {
                    params.categoryId = categoryId;
                }
                const response = await axios.get(`/api/BlogPost/get-blog-page`, { params });
                const items = response.data.items || [];
                allPosts = [...allPosts, ...items];
                totalPages = response.data.totalPages || 1;
                currentPage++;
            }

            setBlogPosts(allPosts);
            if (resetCategory) setCategorySelected(0);
            console.log("Fetched all blog posts:", allPosts);
        } catch (error) {
            console.error("Lỗi khi tải bài viết:", error.response?.data || error.message);
            setBlogPosts([]);
        } finally {
            setLoading(false);
        }
    };

    /** Làm mới danh sách bài viết */
    const refreshBlogPosts = async (resetCategory = false) => {
        await fetchBlogPosts(resetCategory);
    };

    const getBlogsById = async (id) => {
        if (!id) {
            console.error("Invalid blog ID");
            return;
        }
        try {
            const response = await axios.get(`/api/BlogPost/get-blog-by-id/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin bài viết:", error.response?.data || error.message);
        }
    };

    /** Lấy danh sách danh mục bài viết */
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`/api/BlogPost/get-blog-categories`);
            const fetchedCategories = response.data || [];
            setCategories(fetchedCategories);
            console.log("Fetched categories:", fetchedCategories);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục bài viết:", error.response?.data || error.message);
            setCategories([]);
        }
    };

    /** Tạo bài viết mới */
    const createBlogPost = async (blogPost) => {
        try {
            const response = await axios.post(`/api/BlogPost/create-blog`, blogPost);
            console.log("Created blog post:", response.data);
            await fetchCategories();
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo bài viết:", error.response?.data || error.message);
            throw error;
        }
    };

    /** Cập nhật bài viết */
    const updateBlogPost = async (blogPost) => {
        try {
            const response = await axios.put(`/api/BlogPost/update-blog`, blogPost);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật bài viết:", error.response?.data || error.message);
            throw error;
        }
    };

    /** Xóa bài viết */
    const deleteBlogPost = async (id) => {
        try {
            const response = await axios.delete(`/api/BlogPost/delete-blog/${id}`);
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
            const response = await axios.get(`/api/BlogPost/search-blog`, {
                params: { title: value },
            });
            setBlogPosts(response.data || []);
        } catch (error) {
            console.error("Lỗi khi tìm kiếm bài viết:", error.response?.data || error.message);
            setBlogPosts([]);
        }
    };

    /** Tạo danh mục bài viết mới */
    const createBlogCategory = async (categoryData) => {
        try {
            setLoading(true);
            const response = await axios.post(`/api/BlogPost/create-blog-category`, categoryData);
            const newCategory = response.data;
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
            const response = await axios.put(`/api/BlogPost/update-blog-category`, categoryData);
            const updatedCategory = response.data;
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
            .then(() => {
                console.log("SignalR connected");
                setHubConnection(connection);
            })
            .catch(err => console.error("Error connecting to SignalR Hub:", err));

        return () => {
            if (connection.state === signalR.HubConnectionState.Connected) {
                connection.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (!hubConnection) return;

        const handleBlogChange = (blogUpdated, action) => {
            console.log(`SignalR event: ${action}`, blogUpdated);
            if (action === "BlogAdded") {
                setBlogPosts((prevBlog) => {
                    if (prevBlog.some(blog => blog.postId === blogUpdated.postId)) {
                        return prevBlog;
                    }
                    return [blogUpdated, ...prevBlog];
                });
            } else if (action === "BlogUpdated") {
                setBlogPosts((prevBlog) =>
                    prevBlog.map((blog) =>
                        blog.postId === blogUpdated.postId ? blogUpdated : blog
                    )
                );
            } else if (action === "BlogDeleted") {
                setBlogPosts((prevBlog) =>
                    prevBlog.filter((blog) => blog.postId !== blogUpdated.postId)
                );
            }
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

        hubConnection.on("BlogAdded", (blogUpdated) => handleBlogChange(blogUpdated, "BlogAdded"));
        hubConnection.on("BlogUpdated", (blogUpdated) => handleBlogChange(blogUpdated, "BlogUpdated"));
        hubConnection.on("BlogDeleted", (blogUpdated) => handleBlogChange(blogUpdated, "BlogDeleted"));
        hubConnection.on("BlogCategoryAdded", handleCategoriesChange);
        hubConnection.on("BlogCategoryUpdated", handleCategoriesChange);

        return () => {
            hubConnection.off("BlogAdded");
            hubConnection.off("BlogUpdated");
            hubConnection.off("BlogDeleted");
            hubConnection.off("BlogCategoryAdded");
            hubConnection.off("BlogCategoryUpdated");
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
                fetchBlogPosts();
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
                setSearch, 
                createBlogPost,
                updateBlogPost,
                deleteBlogPost,
                searchBlogPost,
                setCategories,
                fetchBlogPosts,
                refreshBlogPosts,
                getBlogsById,
                createBlogCategory,
                updateBlogCategory,
            }}
        >
            {children}
        </BlogPostContext.Provider>
    );
};