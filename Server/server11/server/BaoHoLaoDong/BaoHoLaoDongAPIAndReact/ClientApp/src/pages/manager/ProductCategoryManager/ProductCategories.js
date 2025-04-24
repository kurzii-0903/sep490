import React, { useContext, useEffect, useState, useCallback } from "react";
import { ProductContext } from "../../../contexts/AdminProductContext";
import { AuthContext } from "../../../contexts/AuthContext";
import { Edit, Plus, Trash2, EyeIcon } from "lucide-react";
import Modal from "../../../components/Modal/Modal";
import Loading from "../../../components/Loading/Loading";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProductCategories = () => {
    const { createCategory, updateCategory, groupCategories, createGroup, updateGroupCategory } =
        useContext(ProductContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpenCreateCategory, setIsOpenCreateCategory] = useState(false);
    const [isOpenEditCategory, setIsOpenEditCategory] = useState(false);
    const [isOpenEditGroup, setIsOpenEditGroup] = useState(false);
    const [categorySelected, setCategorySelected] = useState(null);
    const [groupSelected, setGroupSelected] = useState(null);
    const [isOpenCreateGroup, setIsOpenCreateGroup] = useState(false);
    const [isComponentLoading, setIsComponentLoading] = useState(false);

    // Check if user is authenticated as Admin or Manager
    const isAuthenticated = user && ["Admin", "Manager"].includes(user.role);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    const handleEditGroup = useCallback((group) => {
        setGroupSelected(group);
        setIsOpenEditGroup(true);
    }, []);

    const handleEditCategory = useCallback((category) => {
        setCategorySelected(category);
        setIsOpenEditCategory(true);
    }, []);

    const handleCreateCategory = useCallback((group) => {
        setIsOpenCreateCategory(true);
        setGroupSelected(group);
    }, []);

    useEffect(() => {
        const selectedGroup = groupCategories.find((group) => group.groupId === groupSelected?.groupId);
        setGroupSelected(selectedGroup || null);
    }, [groupCategories, groupSelected]);

    return (
        <div className="space-y-6">
            {isAuthenticated ? (
                <div className="bg-white rounded-lg shadow min-h-[800px]">
                    {/* Header */}
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">Danh mục sản phẩm</h3>
                        <button
                            onClick={() => setIsOpenCreateGroup(!isOpenCreateGroup)}
                            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                        >
                            <Plus size={20} className="mr-2" />
                            Thêm nhóm danh mục
                        </button>
                    </div>
                    <div className="grid grid-cols-10 gap-8 p-6">
                        {/* Bảng nhóm danh mục chiếm 3/10 */}
                        <div className="col-span-3">
                            <TableByGroup
                                groups={groupCategories ? groupCategories : []}
                                groupSelected={groupSelected}
                                setGroupSelected={setGroupSelected}
                                onHandleEdit={handleEditGroup}
                                onHandleCreateCategory={handleCreateCategory}
                            />
                        </div>
                        {/* Bảng danh mục chiếm 7/10 */}
                        <div className="col-span-7">
                            <TableBycategories
                                categories={groupSelected ? groupSelected.categories : []}
                                onHandleEdit={handleEditCategory}
                            />
                        </div>
                    </div>
                    {/* Modal thêm danh mục */}
                    <Modal
                        isOpen={isOpenCreateCategory}
                        onClose={() => setIsOpenCreateCategory(false)}
                        title={"Thêm danh mục cho " + (groupSelected ? groupSelected.groupName : "")}
                    >
                        <CreateCategoryForm
                            onCreateCategory={createCategory}
                            group={groupSelected}
                            setIsLoading={setIsComponentLoading}
                            close={() => setIsOpenCreateCategory(false)}
                        />
                    </Modal>
                    <Modal
                        isOpen={isOpenEditCategory}
                        onClose={() => setIsOpenEditCategory(false)}
                        title={"Cập nhật danh mục"}
                    >
                        <EditCategoryForm
                            category={categorySelected}
                            updateCategory={updateCategory}
                            setIsLoading={setIsComponentLoading}
                            groupCategories={groupCategories}
                            close={() => setIsOpenEditCategory(false)}
                        />
                    </Modal>
                    {/* Modal cập nhật nhóm */}
                    <Modal
                        isOpen={isOpenEditGroup}
                        onClose={() => setIsOpenEditGroup(false)}
                        title={"Cập nhật nhóm danh mục"}
                    >
                        <UpdateGroupForm
                            close={() => setIsOpenEditGroup(false)}
                            setLoading={setIsComponentLoading}
                            groupSelected={groupSelected}
                            onUpdateGroup={updateGroupCategory}
                        />
                    </Modal>
                    <Modal
                        isOpen={isOpenCreateGroup}
                        onClose={() => setIsOpenCreateGroup(false)}
                        title={"Tạo nhóm danh mục"}
                    >
                        <CreateGroupForm
                            close={() => setIsOpenCreateGroup(false)}
                            setLoading={setIsComponentLoading}
                            onCreateGroup={createGroup}
                        />
                    </Modal>
                    <Loading isLoading={isComponentLoading} />
                </div>
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    <span>Đang xác thực...</span>
                </div>
            )}
        </div>
    );
};

// Component Form để thêm danh mục
const CreateCategoryForm = ({ onCreateCategory, group, close, setIsLoading }) => {
    const [newCategory, setNewCategory] = useState({
        categoryName: "",
        description: "",
        groupId: group?.groupId || "",
    });

    // Hàm xử lý onChange chung
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
            console.error("Lỗi khi thêm danh mục:", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Tên danh mục</label>
                    <input
                        type="text"
                        name="categoryName"
                        value={newCategory.categoryName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tên danh mục..."
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Mô tả</label>
                    <textarea
                        name="description"
                        value={newCategory.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mô tả danh mục..."
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={close}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleCreateCategory}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

// Component Form để chỉnh sửa danh mục
const EditCategoryForm = ({ category, updateCategory, groupCategories, close, setIsLoading }) => {
    const [categoryUpdate, setCategory] = useState({
        categoryId: category?.categoryId || "",
        categoryName: category?.categoryName || "",
        description: category?.description || "",
        groupId: category?.groupId || "",
    });

    // Hàm xử lý onChange
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory((prev) => ({ ...prev, [name]: value }));
    };

    // Hàm xử lý cập nhật danh mục
    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            await updateCategory(categoryUpdate);
            close();
        } catch (error) {
            alert("Cập nhật thất bại!");
            console.error("Lỗi khi cập nhật danh mục:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Tên danh mục</label>
                    <input
                        type="text"
                        name="categoryName"
                        value={categoryUpdate.categoryName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tên danh mục..."
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Mô tả</label>
                    <textarea
                        name="description"
                        value={categoryUpdate.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mô tả danh mục..."
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="groupId">
                        Nhóm
                    </label>
                    <select
                        name="groupId"
                        value={categoryUpdate.groupId}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                    >
                        {groupCategories.map((group) => (
                            <option key={group.groupId} value={group.groupId}>
                                {group.groupName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={close}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
};

// Component Form để tạo nhóm danh mục
const CreateGroupForm = ({ onCreateGroup, close, setLoading }) => {
    const [newGroup, setNewGroup] = useState({
        name: "",
        description: "",
    });

    // Hàm xử lý onChange chung
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewGroup((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateGroup = async () => {
        setLoading(true);
        try {
            await onCreateGroup(newGroup);
            close();
        } catch (e) {
            console.error("Lỗi khi tạo nhóm danh mục:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Tên nhóm danh mục</label>
                    <input
                        type="text"
                        name="name"
                        value={newGroup.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tên danh mục..."
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Mô tả</label>
                    <textarea
                        name="description"
                        value={newGroup.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mô tả danh mục..."
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={close}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleCreateGroup}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

// Component Form để cập nhật nhóm danh mục
const UpdateGroupForm = ({ onUpdateGroup, close, setLoading, groupSelected }) => {
    const [updateGroup, setUpdateGroup] = useState({
        id: groupSelected?.groupId || "",
        name: groupSelected?.groupName || "",
        description: groupSelected?.description || "",
    });

    // Hàm xử lý onChange chung
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateGroup((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateGroup = async () => {
        setLoading(true);
        try {
            await onUpdateGroup(updateGroup);
            close();
        } catch (e) {
            console.error("Lỗi khi cập nhật nhóm danh mục:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Tên nhóm danh mục</label>
                    <input
                        type="text"
                        name="name"
                        value={updateGroup.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tên danh mục..."
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Mô tả</label>
                    <textarea
                        name="description"
                        value={updateGroup.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mô tả danh mục..."
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={close}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleUpdateGroup}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
};

// Component bảng nhóm danh mục
const TableByGroup = ({ groups, setGroupSelected, groupSelected, onHandleEdit, onHandleCreateCategory }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
                <thead>
                <tr>
                    <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        colSpan="2"
                    >
                        Mã danh mục
                    </th>
                    <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        colSpan="2"
                    >
                        Nhóm danh mục
                    </th>
                    <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        colSpan="2"
                    >
                        Chức năng
                    </th>
                </tr>
                </thead>
                <tbody>
                {groups.map((group, index) => (
                    <motion.tr
                        key={index}
                        variants={{
                            hidden: { opacity: 0, y: 0 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`border-b border-gray-200 hover:bg-gray-100 transition ${
                            groupSelected && group.groupId === groupSelected.groupId ? "bg-gray-100" : ""
                        }`}
                    >
                        <td className="px-6 py-4 whitespace-nowrap text-sm" colSpan="2">
                            {group.groupId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" colSpan="2">
                            {group.groupName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" colSpan="2">
                            <button
                                onClick={() => onHandleEdit(group)}
                                className="text-blue-500 hover:text-blue-700 mx-2"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => setGroupSelected(group)}
                                className="text-blue-500 hover:text-blue-700 mx-2"
                            >
                                <EyeIcon size={18} />
                            </button>
                            <button
                                onClick={() => onHandleCreateCategory(group)}
                                className="text-blue-500 hover:text-blue-700 mx-2"
                            >
                                <Plus size={18} />
                            </button>
                        </td>
                    </motion.tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

// Component bảng danh mục
const TableBycategories = ({ categories, onHandleEdit }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
                <thead>
                <tr>
                    <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        colSpan="2"
                    >
                        Mã loại sản phẩm
                    </th>
                    <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        colSpan="2"
                    >
                        Tên loại sản phẩm
                    </th>
                    <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        colSpan="2"
                    >
                        Mô tả loại sản phẩm
                    </th>
                    <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        colSpan="2"
                    >
                        Cập nhật
                    </th>
                </tr>
                </thead>
                <tbody>
                {categories.map((cate, index) => (
                    <motion.tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-100 transition"
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1, delay: index * 0.05 }}
                    >
                        <td className="px-6 py-4 whitespace-nowrap text-sm" colSpan="2">
                            {cate.categoryId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" colSpan="2">
                            {cate.categoryName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" colSpan="2">
                            {cate.description || "Không có mô tả"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" colSpan="2">
                            <button
                                onClick={() => onHandleEdit(cate)}
                                className="text-blue-500 hover:text-blue-700 mx-2"
                            >
                                <Edit size={18} />
                            </button>
                            <button className="text-red-500 hover:text-red-700">
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </motion.tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductCategories;