import React, { useState, useContext, useCallback } from "react";
import { BlogPostContext } from "../../../contexts/BlogPostContext"; // Điều chỉnh đường dẫn
import { Edit, Plus, Trash2 } from "lucide-react";
import Modal from "../../../components/Modal/Modal"; // Giả sử bạn có component Modal
import Loading from "../../../components/Loading/Loading"; // Giả sử bạn có component Loading
import { motion } from "framer-motion";
import "./BlogCategories.css"; // Import file CSS

const BlogCategories = () => {
    const { categories, createBlogCategory, updateBlogCategory, loading } = useContext(BlogPostContext);
    const [isOpenCreateCategory, setIsOpenCreateCategory] = useState(false);
    const [isOpenEditCategory, setIsOpenEditCategory] = useState(false);
    const [categorySelected, setCategorySelected] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleEditCategory = useCallback((category) => {
        setCategorySelected(category);
        setIsOpenEditCategory(true);
    }, []);

    return (
        <div className="space-y-6">
            <div className="blog-cate-container">
                {/* Header */}
                <div className="blog-cate-header">
                    <h3 className="blog-cate-title">Danh mục bài viết</h3>
                    <button
                        onClick={() => setIsOpenCreateCategory(true)}
                        className="blog-cate-add-btn"
                    >
                        <Plus size={20} className="mr-2" />
                        Thêm danh mục
                    </button>
                </div>

                {/* Bảng danh mục */}
                <TableByCategories
                    categories={categories || []}
                    onHandleEdit={handleEditCategory}
                />

                {/* Modal thêm danh mục */}
                <Modal
                    isOpen={isOpenCreateCategory}
                    onClose={() => setIsOpenCreateCategory(false)}
                    title="Thêm danh mục bài viết"
                >
                    <CreateCategoryForm
                        onCreateCategory={createBlogCategory}
                        setIsLoading={setIsLoading}
                        close={() => setIsOpenCreateCategory(false)}
                    />
                </Modal>

                {/* Modal sửa danh mục */}
                <Modal
                    isOpen={isOpenEditCategory}
                    onClose={() => setIsOpenEditCategory(false)}
                    title="Cập nhật danh mục bài viết"
                >
                    <EditCategoryForm
                        category={categorySelected}
                        updateCategory={updateBlogCategory}
                        setIsLoading={setIsLoading}
                        close={() => setIsOpenEditCategory(false)}
                    />
                </Modal>

                <Loading isLoading={isLoading || loading} />
            </div>
        </div>
    );
};

// Component Form để thêm danh mục
const CreateCategoryForm = ({ onCreateCategory, close, setIsLoading }) => {
    const [newCategory, setNewCategory] = useState({
        name: "",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCategory((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateCategory = async () => {
        try {
            setIsLoading(true);
            await onCreateCategory(newCategory);
            close();
        } catch (e) {
            console.error("Error creating category:", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="blog-cate-form-container">
            <div className="blog-cate-form-group">
                <label className="blog-cate-form-label">Tên danh mục</label>
                <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleChange}
                    className="blog-cate-form-input"
                    placeholder="Nhập tên danh mục..."
                />
            </div>
            <div className="blog-cate-form-group">
                <label className="blog-cate-form-label">Mô tả</label>
                <textarea
                    name="description"
                    value={newCategory.description}
                    onChange={handleChange}
                    className="blog-cate-form-textarea"
                    placeholder="Nhập mô tả danh mục..."
                />
            </div>
            <div className="blog-cate-form-actions">
                <button className="blog-cate-form-cancel-btn">Hủy</button>
                <button onClick={handleCreateCategory} className="blog-cate-form-submit-btn">
                    Thêm
                </button>
            </div>
        </div>
    );
};

// Component Form để sửa danh mục
const EditCategoryForm = ({ category, updateCategory, close, setIsLoading }) => {
    const [categoryUpdate, setCategoryUpdate] = useState({
        id: category?.id || "",
        name: category?.name || "",
        description: category?.description || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryUpdate((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            await updateCategory(categoryUpdate);
            close();
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Cập nhật thất bại!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="blog-cate-form-container">
            <div className="blog-cate-form-group">
                <label className="blog-cate-form-label">Tên danh mục</label>
                <input
                    type="text"
                    name="name"
                    value={categoryUpdate.name}
                    onChange={handleChange}
                    className="blog-cate-form-input"
                    placeholder="Nhập tên danh mục..."
                />
            </div>
            <div className="blog-cate-form-group">
                <label className="blog-cate-form-label">Mô tả</label>
                <textarea
                    name="description"
                    value={categoryUpdate.description}
                    onChange={handleChange}
                    className="blog-cate-form-textarea"
                    placeholder="Nhập mô tả danh mục..."
                />
            </div>
            <div className="blog-cate-form-actions">
                <button className="blog-cate-form-cancel-btn">Hủy</button>
                <button onClick={handleUpdate} className="blog-cate-form-submit-btn">
                    Cập nhật
                </button>
            </div>
        </div>
    );
};

// Component Bảng danh mục
const TableByCategories = ({ categories, onHandleEdit }) => {
    return (
        <div className="blog-cate-table-container">
            <table className="blog-cate-table">
                <thead>
                <tr>
                    <th className="blog-cate-table-header" colSpan="2">Mã danh mục</th>
                    <th className="blog-cate-table-header" colSpan="2">Tên danh mục</th>
                    <th className="blog-cate-table-header" colSpan="2">Mô tả</th>
                    <th className="blog-cate-table-header" colSpan="2">Chức năng</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((cate, index) => (
                    <motion.tr
                        key={cate.id}
                        className="blog-cate-table-row"
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1, delay: index * 0.05 }}
                    >
                        <td className="blog-cate-table-cell" colSpan="2">{cate.id}</td>
                        <td className="blog-cate-table-cell" colSpan="2">{cate.name}</td>
                        <td className="blog-cate-table-cell" colSpan="2">
                            {cate.description || "Không có mô tả"}
                        </td>
                        <td className="blog-cate-table-cell" colSpan="2">
                            <button
                                onClick={() => onHandleEdit(cate)}
                                className="blog-cate-table-action-edit"
                            >
                                <Edit size={18} />
                            </button>
                        </td>
                    </motion.tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BlogCategories;