"use client"

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { BlogPostContext } from "../../../contexts/BlogPostContext"
import { Edit, Plus } from "lucide-react"
import Loading from "../../../components/Loading/Loading"
import { motion } from "framer-motion"
import { FaRegFrown } from "react-icons/fa"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const BASE_URL = process.env.REACT_APP_BASE_URL_API

const BlogPosts = () => {
    const { loading, categories, fetchCategories, search, setSearch } =
        useContext(BlogPostContext)
    const [BlogPosts, setBlogPosts] = useState([]);
    const memoizedBlogPosts = useMemo(() => BlogPosts, [BlogPosts])
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(20)
    const [categorySelected, setCategorySelected] = useState(3)
    const navigate = useNavigate()

    // Fetch categories only once when component mounts
    useEffect(() => {
        if (categories.length === 0) {
            fetchCategories()
        }
    }, [categories.length, fetchCategories])

    // Fetch blog posts when relevant filters change
    useEffect(() => {
        fetchBlogPosts()
    }, [categorySelected, page, size, search])

    const fetchBlogPosts = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/BlogPost/get-blog-page`, {
                params: {
                    categoryId: categorySelected,
                    page: page,
                    size: size,
                    search: search,
                },
            })
            setBlogPosts(response.data.items)
        } catch (error) {
            console.error("Lỗi khi tải bài viết:", error.response?.data || error.message)
        }
    }, [categorySelected, page, size, search, setBlogPosts])

    const handleUpdate = (id) => {
        navigate("/manager/update-blog/" + id)
    }

    return (
        <div className="space-y-6">
            <div className="bg-white min-h-[800px] rounded-lg shadow">
                <Loading isLoading={loading} />
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
                            onChange={(e)=>setCategorySelected(Number(e.target.value))}
                        >
                            <option value={0}>{"All"}</option>
                            {categories.map(({ id, name }, index) => (
                                <option key={index} value={id}>
                                    {name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => (window.location.href = "create-blog")}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Thêm bai viet
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
                    ) : memoizedBlogPosts.length === 0 ? (
                        <div className="flex justify-center items-center">
                            <FaRegFrown className="text-gray-500 w-12 h-12" />
                            <span className="text-gray-500 ml-4">Không có bài viết nào</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <BlogPostTable blogPosts={memoizedBlogPosts} handleUpdate={handleUpdate} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

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
    )
})

export default BlogPosts

