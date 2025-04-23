// src/pages/manager/ProductManager/Products.js
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Edit, Trash2, Plus, CheckCircle } from "lucide-react";
import { FaRegFrown } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { ProductContext } from "../../../contexts/AdminProductContext";
import Loading from "../../../components/Loading/Loading";
import noImage from "../../../images/no-image-product.jpg";
import { motion } from "framer-motion";
import Modal from "../../../components/Modal/Modal";
import { formatVND } from "../../../utils/format";
import ManagerToast from "../../../components/managerToast/ManagerToast";
import RoleWrapper from "../../../components/RoleWrapper";

const useQuery = () => new URLSearchParams(useLocation().search);

const ProductTable = React.memo(({ products, handleUpdate }) => {
	const [selectImage, setSelectImage] = useState(null);
	const [isOpenShowImage, setIsOpenShowImage] = useState(false);
	const handelClickImage = (image) => {
		setSelectImage(image);
		setIsOpenShowImage(true);
	};

	return (
		<>
			<Modal onClose={() => setIsOpenShowImage(false)} isOpen={isOpenShowImage} title={"Product image"}>
				<div className="flex justify-center items-center">
					<img src={selectImage || noImage} alt="Product Image" className=" max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg" />
				</div>
			</Modal>
			<table className="min-w-full divide-y divide-gray-200">
				<motion.thead>
					<tr>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã sản phẩm</th>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh sản phẩm</th>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá sản phẩm</th>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá đã giảm</th>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm giá</th>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
						<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cập nhât</th>
					</tr>
				</motion.thead>
				<motion.tbody
					initial="hidden"
					animate="visible"
					variants={{
						hidden: { opacity: 0 },
						visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
					}}>
					{products.map(({ id, name, price, quantity,  priceAfterDiscount, discount, image, isNew, status }, index) => (
						<motion.tr
							key={id}
							variants={{
								hidden: { opacity: 0, y: 0 },
								visible: { opacity: 1, y: 0 },
							}}
							transition={{ duration: 0.3, delay: index * 0.05 }}
							className="border-b bg-white divide-y divide-gray-200 hover:bg-gray-100">
							<td className="px-6 py-4 whitespace-nowrap text-sm">
								{id} {isNew && <span className="ml-2 px-2 py-1 text-xs text-white bg-green-500 rounded">Mới</span>}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm">
								<img onClick={() => handelClickImage(image)} src={image || noImage} alt={name} className="w-16 h-16 object-cover rounded-md" />
							</td>
							<td className="px-6 py-4 text-sm truncate max-w-[150px]">
								{name}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm">{formatVND(price)}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm">{formatVND(priceAfterDiscount)}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm">{discount}%</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm">{quantity}</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`font-medium ${status ? "text-green-600" : "text-red-600"} flex items-center`}>
                                    {status ? (
										<><CheckCircle size={16} className="mr-1" /> Đang bán</>
									) : (
										<><Trash2 size={16} className="mr-1" /> Ngừng bán</>
									)}
                                </span>
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
								<button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => handleUpdate(id)}>
									<Edit className="w-5 h-5" />
								</button>
							</td>
						</motion.tr>
					))}
				</motion.tbody>
			</table>
		</>
	);
});

const Products = () => {
	const query = useQuery();
	const page = parseInt(query.get("page") ?? "1", 10);
	const navigate = useNavigate();
	const location = useLocation();
	const { products, loading, groupCategories, selectedGroup, setSelectGroup, search, setSearch, currentPage, setCurrentPage, totalPages } = useContext(ProductContext);
	const handleCreate = () => navigate("/manager/createproduct");
	const handleUpdate = (id) => navigate(`/manager/update-product/${id}`);
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState("success"); // Thêm state cho type

	useEffect(() => {
		if (location.state?.toastMessage) {
			setToastMessage(location.state.toastMessage);
			setToastType(location.state.toastType || "success"); // Lấy type từ state, mặc định là success
		}
	}, [location.state]);

	useEffect(() => {
		if (selectedGroup) {
			setCurrentPage(1);
			navigate(`/manager/products?page=${1}`, { replace: true });
		}
	}, [selectedGroup]);

	useEffect(() => {
		if (currentPage) {
			navigate(`/manager/products?page=${currentPage}`, { replace: true });
		}
	}, [currentPage]);

	const memoizedProducts = useMemo(() => products, [products]);

	return (
		<div className="space-y-6">
			<div className="bg-white min-h-[800px] rounded-lg shadow">
				<Loading isLoading={loading} />
				<div className="p-6 border-b flex justify-between items-center">
					<h3 className="text-lg font-semibold text-gray-800">Danh sách sản phẩm</h3>
					<div className="flex space-x-4">
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							type="text"
							placeholder="Tìm kiếm sản phẩm..."
							className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
						/>
						<select
							value={selectedGroup}
							onChange={(e) => setSelectGroup(e.target.value)}
							className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
						>
							<option key={0} value={0}>
								{"All"}
							</option>
							{groupCategories.map((group) => (
								<option key={group.groupId} value={group.groupId}>
									{group.groupName}
								</option>
							))}
						</select>
						<RoleWrapper allowedRoles={"Admin"}>
							<button
								className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
								onClick={handleCreate}>
								<Plus className="w-5 h-5 mr-2" />
								Thêm sản phẩm
							</button>
						</RoleWrapper>

					</div>
				</div>

				<div className="p-6">
					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{Array.from({ length: 4 }).map((_, index) => (
								<div key={index} className="animate-pulse bg-gray-200 h-48 rounded-lg"></div>
							))}
						</div>
					) : memoizedProducts.length === 0 ? (
						<div className="flex justify-center items-center">
							<FaRegFrown className="text-gray-500 w-12 h-12" />
							<span className="text-gray-500 ml-4">Không có sản phẩm nào</span>
						</div>
					) : (
						<div className="overflow-x-auto">
							<ProductTable products={memoizedProducts} handleUpdate={handleUpdate} />
						</div>
					)}
				</div>
				<div className="p-6 flex justify-center mt-4">
					{memoizedProducts.length !== 0 ? (
						<nav className="flex items-center space-x-1">
							<button
								onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
								disabled={currentPage === 1}
								className="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-200"><i
								className="fas fa-angle-left"></i></button>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
								<button
									key={page}
									onClick={() => setCurrentPage(() => Number(page))}
									className={`px-3 py-1 border rounded-md ${
										currentPage === page
											? "bg-blue-500 text-white"
											: "text-gray-700 hover:bg-gray-200"
									}`}
								>
									{page}
								</button>
							))}
							<button
								onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
								disabled={currentPage === totalPages}
								className="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-200"><i
								className="fas fa-angle-right"></i></button>
						</nav>
					) : (
						""
					)}
				</div>
			</div>
			{toastMessage && (
				<ManagerToast message={toastMessage} onClose={() => setToastMessage("")} type={toastType} />
			)}		</div>
	);
};

export default Products;