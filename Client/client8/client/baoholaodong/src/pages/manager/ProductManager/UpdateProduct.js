import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from "../../../contexts/AdminProductContext";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Image, Package, Tag, CheckCircle, XCircle, Eye } from "lucide-react";
import { FaRegFrown } from "react-icons/fa";
import Modal from "../../../components/Modal/Modal";
import { toSlug } from "../../../utils/SlugUtils";
import ErrorList from "../../../components/ErrorList/ErrorList";
import { formatVND } from "../../../utils/format";
import UpdateInformationProductForm from "./form/UpdateInformationProductForm";
import AddProductTaxForm from "./form/AddProductTaxForm";
import UpdateImageForm from "./form/UpdateImageForm";
import CreateVariantForm from "./form/CreateVariantForm";
import UpdateVariantForm from "./form/UpdateVariantForm";
import AddMoreImageForm from "./form/AddMoreImageForm";
import { DisplayContent } from "../../../components/TextEditor";
import ManagerToast from "../../../components/managerToast/ManagerToast";

const LoadingSkeleton = () => {
	return (
		<div>
			{/* Product Information Skeleton */}
			<div className="p-6 space-y-4">
				<div className="h-6 w-32 bg-gray-200 rounded"></div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
					{[...Array(8)].map((_, i) => (
						<div key={i} className="flex items-center">
							<div className="h-5 w-32 bg-gray-200 rounded"></div>
							<div className="h-5 w-48 bg-gray-300 rounded ml-4"></div>
						</div>
					))}
				</div>
				<div className="h-16 bg-gray-200 rounded"></div>
			</div>

			{/* Product Images Skeleton */}
			<div className="p-6">
				<div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
					))}
				</div>
			</div>
			{/* Product Variants Skeleton */}
			<div className="p-6">
				<div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="p-4 border rounded-lg shadow-sm bg-gray-100">
							<div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
							<div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
							<div className="h-5 w-full bg-gray-200 rounded"></div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const UpdateProduct = () => {
	const { id, slug } = useParams();
	const { getProductById, categories, updateProduct, uploadImage, updateImage, deleteImage, updateVariant, createVariant, addProductTax, taxes, deleteProductTax } = useContext(ProductContext);

	// Tất cả Hook phải được gọi ở đây, trước bất kỳ return nào
	const [product, setProduct] = useState({
		id: parseInt(id),
		name: "",
		description: "",
		material: "",
		origin: "",
		categoryId: 1,
		categoryName: "",
		quantity: 0,
		price: 0,
		priceDiscount: 0,
		discount: 0,
		createdAt: "",
		updatedAt: "",
		status: true,
		freeShip: false,
		guarantee: 0,
		averageRating: 0,
		qualityCertificate: "",
		totalTax: 0,
		productImages: [
			{
				id: 0,
				fileName: "",
				image: "",
				description: null,
				isPrimary: true
			}
		],
		productVariants: [
			{
				variantId: 0,
				productId: 0,
				size: "",
				color: "",
				quantity: 0,
				price: 0.01,
				discount: 0,
				status: true
			}
		],
		taxes: [{
			productTaxId: 0,
			productId: 0,
			taxId: 0,
			taxName: "",
			taxRate: 0,
			description: ""
		}]
	});
	const [isOpenUpdateInformation, setIsOpenUpdateInformation] = useState(false);
	const [isOpenAddMoreImage, setIsOpenAddMoreImage] = useState(false);
	const [isOpenUpdateVariant, setIsOpenUpdateVariant] = useState(false);
	const [isOpenCreateVariant, setIsOpenCreateVariant] = useState(false);
	const [isOpenUpdateImage, setIsOpenUpdateImage] = useState(false);
	const [imageSelected, setImageSelected] = useState(null);
	const [variantSelected, setVariantSelected] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const [isOpenAddTax, setIsOpenAddTax] = useState(false);
	const [errors, setErrors] = useState([]);
	const [toastMessage, setToastMessage] = useState(null);
	const [toastType, setToastType] = useState("success");
	const navigate = useNavigate();

// Hàm hiển thị toast
	const showToast = (message, type = "success") => {
		setToastMessage(message);
		setToastType(type);
	};

	// Đóng toast
	const closeToast = () => {
		setToastMessage(null);
	};

	useEffect(() => {
		const fetchProduct = async () => {
			setLoading(true);
			try {
				const data = await getProductById(id);
				setProduct(data);
			} catch (error) {
				console.error("Error fetching product:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchProduct();
	}, [id]);

	useEffect(() => {
		if (!isLoading && product.name) {
			const correctSlug = toSlug(product.name);
			if (slug !== correctSlug) {
				navigate(`/manager/update-product/${id}/${correctSlug}`, { replace: true });
			}
		}
	}, [isLoading, product, slug, id, navigate]);

	// click open form update image
	const handleClickUpdateImage = (image) => {
		setImageSelected(image);
		setIsOpenUpdateImage(true);
	};

	// click open form update variant
	const handleClickUpdateVariant = (variant) => {
		setVariantSelected(variant);
		setIsOpenUpdateVariant(true);
	};

	const previewProduct = () => {
		const url = `/products/${product.slug}`;
		const popup = window.open(
			url,
			"ProductPreview",
			"width=600,height=700,left=300,top=100,toolbar=no,menubar=no,scrollbars=yes,resizable=yes"
		);
		if (popup) {
			popup.focus();
		}
	};

	// Kiểm tra product ở đây, sau khi tất cả Hook đã được gọi
	if (!product) return <div className="text-center mt-10">Loading...</div>;

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-lg overflow-hidden">
				<ErrorList errors={errors} />
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center">
					<h3 className="text-2xl font-bold text-white">Cập nhật sản phẩm</h3>
					<div className="flex space-x-3">
						<button
							onClick={() => setIsOpenAddTax(true)}
							className="flex items-center px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-all shadow-md"
						>
							<Tag size={18} className="mr-2" /> Cập nhật thuế
						</button>
						<button
							onClick={() => previewProduct()}
							className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-all shadow-md"
						>
							<Eye size={18} className="mr-2" /> Xem trước sản phẩm
						</button>
					</div>
				</div>
				{isLoading ? (
					<LoadingSkeleton />
				) : (
					<>
						{/* Product Information */}
						<div className="p-6">
							<div className="mb-6">
								<div className="flex items-center justify-between border-b border-gray-200 pb-3">
									<h4 className="text-lg font-semibold text-gray-800">Thông tin sản phẩm</h4>
									<button
										onClick={() => setIsOpenUpdateInformation(true)}
										className="flex items-center gap-2 text-blue-600 font-medium px-3 py-2 rounded-lg transition-all duration-200 bg-blue-100 active:bg-blue-200"
									>
										<Edit size={18} /> Cập nhật thông tin
									</button>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 pt-6 gap-y-4">
									<div className="flex items-center">
										<span className="text-gray-500 w-32">ID sản phẩm:</span>
										<span className="font-medium text-gray-800">{product.id}</span>
									</div>
									<div className="flex items-center">
										<span className="text-gray-500 w-32">Tên sản phẩm:</span>
										<span className="font-medium text-gray-800">{product.name}</span>
									</div>
									<div className="flex items-center">
										<span className="text-gray-500 w-32">Chất liệu:</span>
										<span className="font-medium text-gray-800">{product.material}</span>
									</div>
									<div className="flex items-center">
										<span className="text-gray-500 w-32">Xuất xứ:</span>
										<span className="font-medium text-gray-800">{product.origin}</span>
									</div>
									<div className="flex items-center">
										<span className="text-gray-500 w-32">Số lượng:</span>
										<span className="font-medium text-gray-800">{product.quantity}</span>
									</div>
									<div className="flex items-center">
										<span className="text-gray-500 w-32">Giá:</span>
										<span className="font-medium text-gray-800">{formatVND(product.price)}</span>
									</div>
									<div className="flex items-center">
										<span className="text-gray-500 w-32">Giảm giá:</span>
										<span className="font-medium text-gray-800">{product.discount}%</span>
									</div>
									<div className="flex items-center">
										<span className="text-gray-500 w-32">Trạng thái:</span>
										<span className={`font-medium ${product.status ? "text-green-600" : "text-red-600"} flex items-center`}>
                                            {product.status ? (
												<><CheckCircle size={16} className="mr-1" /> Đang bán</>
											) : (
												<><XCircle size={16} className="mr-1" /> Ngừng bán</>
											)}
                                        </span>
									</div>
									<div className="flex items-center">
										<span className="text-gray-500 w-32">Bảo hành:</span>
										<span className="font-medium text-gray-800">{product.guarantee} Tháng</span>
									</div>
									<div className="flex items-center">
										<span className="text-gray-500 w-32">Free Ship:</span>
										<span className={`font-medium ${product.status ? "text-green-600" : "text-red-600"} flex items-center`}>
                                            {product.freeShip ? (
												<CheckCircle size={16} className="mr-1" />
											) : (
												<XCircle size={16} className="mr-1" />
											)}
                                        </span>
									</div>
									<div className="flex items-center col-span-2">
										<span className="text-gray-500 w-32">Danh mục:</span>
										<span className="font-medium text-gray-800">{product.categoryName}</span>
									</div>
									<div className="col-span-2">
										<span className="text-gray-500 block mb-1">Mô tả:</span>
										<DisplayContent content={product.description} />
									</div>
									<div className="col-span-2">
										<span className="text-gray-500 block mb-1">Chứng nhận chất lượng:</span>
										<DisplayContent content={product.qualityCertificate} />
									</div>
									<div className="col-span-2">
										<span className="text-gray-500 block mb-1">Thuế: <span className="font-medium text-gray-800">{product.totalTax}%</span></span>
										{product && product.taxes && product.taxes.length > 0 ? (
											<div className="mt-2 bg-gray-50 p-3 rounded-lg">
												<ul className="space-y-1">
													{product.taxes.map((tax) => (
														<li key={tax.productTaxId} className="flex items-center text-gray-700">
															<Tag size={14} className="mr-2 text-blue-500" />
															{tax.taxName} - {tax.taxRate}%
														</li>
													))}
												</ul>
											</div>
										) : (
											<p className="text-gray-500 italic">Không có thuế</p>
										)}
									</div>
								</div>
							</div>

							{/* Product Images */}
							<div className="mb-6">
								<div className="flex items-center justify-between border-b border-gray-200 pb-3">
									<h4 className="flex text-lg font-semibold text-gray-800">
										<Image size={20} className="mr-2 text-blue-500" /> Hình ảnh sản phẩm
									</h4>
									<button
										onClick={(e) => setIsOpenAddMoreImage(true)}
										className="flex items-center gap-2 text-blue-600 font-medium px-3 py-2 rounded-lg transition-all duration-200 bg-purple-100 active:bg-blue-200"
									>
										<Image size={18} className="mr-2" /> Thêm ảnh
									</button>
								</div>

								<div className="pt-6">
									{product.productImages?.length > 0 ? (
										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
											{product.productImages.map((image, index) => (
												<div key={image.id} className="group relative">
													<div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-200 shadow-md">
														<img
															src={image.image}
															alt={`Product ${index}`}
															className="w-full h-full object-cover object-center transition-all duration-200 group-hover:opacity-75"
														/>
														{image.isPrimary && (
															<div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
																Chính
															</div>
														)}
													</div>

													<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-lg">
														<button
															onClick={() => handleClickUpdateImage(image)}
															className="bg-white p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
														>
															<Edit size={18} className="text-blue-600" />
														</button>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
											<div className="text-center">
												<FaRegFrown className="mx-auto text-gray-400 text-2xl mb-2" />
												<p className="text-gray-500">Không có hình ảnh nào.</p>
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Product Variants */}
							<div>
								<div className="flex items-center justify-between border-b border-gray-200 pb-3">
									<h4 className="flex items-center text-lg font-semibold text-gray-800">
										<Package size={20} className="mr-2 text-purple-500" /> Biến thể sản phẩm
									</h4>
									<button
										onClick={() => setIsOpenCreateVariant(true)}
										className="flex items-center gap-2 px-4 py-2 text-purple-600 font-medium rounded-lg shadow-sm transition-all duration-200 bg-purple-100 active:bg-purple-200"
									>
										<Package size={18} /> Thêm biến thể
									</button>
								</div>

								{product.productVariants?.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{product.productVariants.map((variant, index) => (
											<div
												key={index}
												className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer"
											>
												{/* Header */}
												<div className="flex justify-between items-center mb-3">
													<h5 className="font-semibold text-gray-800">Biến thể #{index + 1}</h5>
													<div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${variant.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
														{variant.status ? "Đang bán" : "Ngừng bán"}
													</div>
													<button
														onClick={() => handleClickUpdateVariant(variant)}
														className="text-gray-600 hover:text-blue-500 transition-colors"
													>
														<Edit size={18} />
													</button>
												</div>

												{/* Thông tin chi tiết */}
												<div className="space-y-2">
													<div className="grid grid-cols-2 gap-3">
														<div className="bg-gray-50 p-3 rounded">
															<span className="text-gray-500 text-sm">Kích thước:</span>
															<p className="font-medium">{variant.size}</p>
														</div>
														<div className="bg-gray-50 p-3 rounded">
															<span className="text-gray-500 text-sm">Màu sắc:</span>
															<p className="font-medium">{variant.color}</p>
														</div>
													</div>

													<div className="grid grid-cols-3 gap-3">
														<div className="bg-gray-50 p-3 rounded">
															<span className="text-gray-500 text-sm">Số lượng:</span>
															<p className="font-medium">{variant.quantity}</p>
														</div>
														<div className="bg-gray-50 p-3 rounded">
															<span className="text-gray-500 text-sm">Giá:</span>
															<p className="font-medium">
																{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(variant.price)}
															</p>
														</div>
														<div className="bg-gray-50 p-3 rounded">
															<span className="text-gray-500 text-sm">Giảm giá:</span>
															<p className="font-medium">{variant.discount}%</p>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
										<div className="text-center">
											<FaRegFrown className="mx-auto text-gray-400 text-2xl mb-2" />
											<p className="text-gray-500">Không có biến thể nào.</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</>
				)}
				{/* Modals */}
				<Modal
					onClose={() => setIsOpenUpdateInformation(false)}
					isOpen={isOpenUpdateInformation}
					title={"Cập nhật thông tin"}
					noFull={false}
				>
					<UpdateInformationProductForm
						product={product}
						categories={categories}
						onUpdate={updateProduct}
						setProduct={setProduct}
						setLoading={setLoading}
						setErrors={setErrors}
						close={() => setIsOpenUpdateInformation(false)}
						showToast={showToast}
					/>
				</Modal>

				<Modal
					onClose={() => setIsOpenAddMoreImage(false)}
					isOpen={isOpenAddMoreImage}
					title={"Thêm ảnh mới"}
				>
					<AddMoreImageForm
						product={product}
						uploadImage={uploadImage}
						setProduct={setProduct}
						close={() => { setIsOpenAddMoreImage(false) }}
						setLoading={setLoading}
						showToast={showToast}
					/>
				</Modal>

				<Modal
					onClose={() => setIsOpenUpdateVariant(false)}
					isOpen={isOpenUpdateVariant}
					title={"Cập nhật biến thể"}
				>
					<UpdateVariantForm
						variant={variantSelected}
						onSetProduct={setProduct}
						setLoading={setLoading}
						onUpdateVariant={updateVariant}
						onClose={() => setIsOpenUpdateVariant(false)}
						showToast={showToast}
					/>
				</Modal>

				<Modal
					onClose={() => setIsOpenCreateVariant(false)}
					isOpen={isOpenCreateVariant}
					title={"Thêm biến thể"}
				>
					<CreateVariantForm
						onClose={() => setIsOpenCreateVariant(false)}
						setLoading={setLoading}
						product={product}
						onSetProduct={setProduct}
						onCreateVariant={createVariant}
						showToast={showToast}
					/>
				</Modal>

				<Modal
					onClose={() => setIsOpenUpdateImage(false)}
					isOpen={isOpenUpdateImage}
					title={"Cập nhật ảnh"}
				>
					<UpdateImageForm
						image={imageSelected}
						onUpdateImage={updateImage}
						onSetProduct={setProduct}
						close={() => { setIsOpenUpdateImage(false) }}
						onDelete={deleteImage}
						setLoading={setLoading}
						showToast={showToast}
					/>
				</Modal>

				<Modal
					onClose={() => { setIsOpenAddTax(false) }}
					isOpen={isOpenAddTax}
					title={"Cập nhật thuế"}
				>
					<AddProductTaxForm
						setLoading={setLoading}
						onAddProductTax={addProductTax}
						close={() => { setIsOpenAddTax(false) }}
						taxes={taxes}
						product={product}
						setProduct={setProduct}
						onDeleteProductTax={deleteProductTax}
						showToast={showToast}
					/>
				</Modal>
			</div>
			{/* Hiển thị toast */}
			{toastMessage && (
				<ManagerToast message={toastMessage} onClose={closeToast} type={toastType} />
			)}
		</div>
	);

};

export default UpdateProduct;