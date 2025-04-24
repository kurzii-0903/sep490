"use client";

import React, { useContext, useMemo } from "react";
import { BlogPostContext } from "../../../contexts/BlogPostContext";
import { Edit, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { FaRegFrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BlogPosts = () => {
    const { blogPosts, loading, categories, setCategorySelected, categorySelected, search, setSearch, page, setPage } =
        useContext(BlogPostContext);
    const navigate = useNavigate();

    const POSTS_PER_PAGE = 8; // Hiển thị 8 bài mỗi trang

    // Lọc bài viết theo search và categorySelected
    const filteredPosts = useMemo(() => {
        let filtered = blogPosts || [];

        if (search) {
            filtered = filtered.filter((post) =>
                post.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (categorySelected !== 0) {
            filtered = filtered.filter((post) => post.categoryId === categorySelected);
        }

        return filtered;
    }, [blogPosts, search, categorySelected]);

    // Phân trang sau khi lọc
    const paginatedPosts = useMemo(() => {
        const totalFilteredPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
        const startIndex = (page - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        return filteredPosts.slice(startIndex, endIndex);
    }, [filteredPosts, page]);

    const totalFilteredPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

    const handleUpdate = (id) => {
        navigate("/manager/update-blog/" + id);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalFilteredPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white min-h-[800px] rounded-lg shadow">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Danh sách blog</h3>
                    <div className="flex space-x-4">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={categorySelected}
                            onChange={(e) => setCategorySelected(Number(e.target.value))}
                        >
                            <option value={0}>{"All"}</option>
                            {categories.map(({ id, name }, index) => (
                                <option key={index} value={id}>
                                    {name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => navigate("/manager/create-blog")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Thêm bài viết
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
                            ))}
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="flex justify-center items-center">
                            <FaRegFrown className="text-gray-500 w-12 h-12" />
                            <span className="text-gray-500 ml-4">Không có bài viết nào</span>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <BlogPostTable blogPosts={paginatedPosts} handleUpdate={handleUpdate} />
                            </div>
                            {totalFilteredPages > 1 && (
                                <div className="mt-6 flex justify-center items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        Trước
                                    </button>
                                    {Array.from({ length: totalFilteredPages }, (_, i) => i + 1).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-1 border rounded ${
                                                page === pageNum ? "bg-blue-500 text-white" : ""
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalFilteredPages}
                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const BlogPostTable = React.memo(({ blogPosts = [], handleUpdate }) => {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <motion.thead>
                <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STT
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tiêu đề
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nội dung
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                    </th>
                </tr>
            </motion.thead>
            <motion.tbody
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
                }}
            >
                {blogPosts.map(({ postId, title, status }, index) => (
                    <motion.tr
                        key={postId}
                        variants={{
                            hidden: { opacity: 0, y: 0 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b bg-white divide-y divide-gray-200 hover:bg-gray-100"
                    >
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                        <td className="px-6 py-4 text-sm truncate max-w-[150px]">{title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                            <button onClick={() => handleUpdate(postId)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                <Edit className="w-5 h-5" />
                            </button>
                        </td>
                    </motion.tr>
                ))}
            </motion.tbody>
        </table>
    );
});

export default BlogPosts;