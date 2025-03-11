import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ProductContext } from "../../../contexts/AdminProductContext";
import {useNavigate, useParams} from "react-router-dom";
import { Edit, Plus, Trash2, Image, Package, Tag, CheckCircle ,XCircle} from "lucide-react";
import { FaRegFrown } from "react-icons/fa";
import Modal from "../../../components/Modal/Modal";
import { isImageSizeValid, compressImageToTargetSize } from "../../../utils/imageUtils";
import {toSlug} from "../../../utils/SlugUtils";
import ErrorList from "../../../components/ErrorList/ErrorList";
import {motion} from "framer-motion";

const MAX_IMAGE_SIZE_MB = 0.5; // 2MB
const TARGET_IMAGE_SIZE_KB = 10; // 100KB
const LoadingSkeleton = () => {
	return (
		<div >
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
	const { id,slug } = useParams();
	const { getProductById, categories, updateProduct, uploadImage, updateImage, deleteImage, updateVariant, createVariant, addProductTax, taxes, deleteProductTax } = useContext(ProductContext);
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
		freeShip:false,
		guarantee :0,
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
	const navigate = useNavigate();
	const [errors, setErrors] = useState([]);
	useEffect(() => {
		const fetchProduct =async ()=>{
			setLoading(true);
			try {
				const data = await getProductById(id);
				setProduct(data);
			} catch (error) {
				console.error("Error fetching product:", error);
			}finally {
				setLoading(false);
			}
		}
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

	//click open form update variant
	const handleClickUpdateVariant = (variant) => {
		setVariantSelected(variant);
		setIsOpenUpdateVariant(true);
	}
	// get product by id

	if (!product) return <div className="text-center mt-10">Loading...</div>;

	return (
		<div
			className="space-y-6">
			<div className="bg-white rounded-lg shadow-lg overflow-hidden ">
				<ErrorList errors={errors}/>
				{/* Header */}
				<div className="bg-gradient-to-r  from-blue-600 to-indigo-700 p-6 flex justify-between items-center">
					<h3 className="text-2xl font-bold text-white">Cập nhật sản phẩm</h3>
					<div className="flex space-x-3">
						<button
							onClick={() => setIsOpenUpdateInformation(true)}
							className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-md"
						>
							<Edit size={18} className="mr-2" /> Cập nhật thông tin
						</button>
						<button
							onClick={(e) => setIsOpenAddMoreImage(true)}
							className="flex items-center px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-all shadow-md"
						>
							<Image size={18} className="mr-2" /> Thêm ảnh
						</button>
						<button
							onClick={(e) => setIsOpenCreateVariant(true)}
							className="flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all shadow-md"
						>
							<Package size={18} className="mr-2" /> Thêm biến thể
						</button>
						<button
							onClick={() => setIsOpenAddTax(true)}
							className="flex items-center px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-all shadow-md"
						>
							<Tag size={18} className="mr-2" /> Cập nhật thuế
						</button>
					</div>
				</div>
				{isLoading ?(
					<LoadingSkeleton/>
				):(
					<>
						{/* Product Information */}
						<div className="p-6">
							<div className="mb-6">
								<h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
									Thông tin sản phẩm
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
										<span className="font-medium text-gray-800">{Intl.NumberFormat("vi-VN").format(product.price)} VND</span>
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
										{product.description.split("\n").map((line, index) => (
											<p className="text-gray-800 bg-gray-50 rounded-lg" key={index}>{line}</p>
										))}
									</div>
									<div className="col-span-2">
										<span className="text-gray-500 block mb-1">Chứng nhận chất lượng:</span>
										<p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{product.qualityCertificate}</p>
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
								<h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
									<Image size={20} className="mr-2 text-blue-500" /> Hình ảnh sản phẩm
								</h4>
								{product.productImages?.length > 0 ? (
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
										{product.productImages.map((image, index) => (
											<div key={image.id} className="group relative">
												<div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 shadow-md">
													<img
														src={image.image}
														alt={`Product ${index}`}
														className="h-full w-full object-cover object-center group-hover:opacity-75 transition-all"
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

							{/* Product Variants */}
							<div>
								<h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
									<Package size={20} className="mr-2 text-purple-500" /> Biến thể sản phẩm
								</h4>
								{product.productVariants?.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{product.productVariants.map((variant, index) => (
											<div
												key={index}
												className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer"
												onClick={() => handleClickUpdateVariant(variant)}
											>
												<div className="flex justify-between items-center mb-2">
													<h5 className="font-semibold text-gray-800">Biến thể #{index + 1}</h5>
													<span className={`px-2 py-1 rounded-full text-xs ${variant.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
												{variant.status ? "Đang bán" : "Ngừng bán"}
											</span>
												</div>
												<div className="space-y-1">
													<div className="grid grid-cols-2 gap-2">
														<div className="bg-gray-50 p-2 rounded">
															<span className="text-gray-500 text-sm">Kích thước:</span>
															<p className="font-medium">{variant.size}</p>
														</div>
														<div className="bg-gray-50 p-2 rounded">
															<span className="text-gray-500 text-sm">Màu sắc:</span>
															<p className="font-medium">{variant.color}</p>
														</div>
													</div>
													<div className="grid grid-cols-3 gap-2">
														<div className="bg-gray-50 p-2 rounded">
															<span className="text-gray-500 text-sm">Số lượng:</span>
															<p className="font-medium">{variant.quantity}</p>
														</div>
														<div className="bg-gray-50 p-2 rounded">
															<span className="text-gray-500 text-sm">Giá:</span>
															<p className="font-medium">đ{variant.price}</p>
														</div>
														<div className="bg-gray-50 p-2 rounded">
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
				>
					<UpdateInformationProductForm
						product={product}
						categories={categories}
						onUpdate={updateProduct}
						setProduct={setProduct}
						setLoading={setLoading}
						setErrors={setErrors}
						close={() => setIsOpenUpdateInformation(false)}
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
					/>
				</Modal>

				<Modal
					onClose={() => setIsOpenUpdateVariant(false)}
					isOpen={isOpenUpdateVariant}
					title={"Cập nhât biến thể"}
				>
					<UpdateVariantForm
						variant={variantSelected}
						onSetProduct={setProduct}
						setLoading={setLoading}
						onUpdateVariant={updateVariant}
						onClose={()=> setIsOpenUpdateVariant(false)}
					/>
				</Modal>

				<Modal
					onClose={() => setIsOpenCreateVariant(false)}
					isOpen={isOpenCreateVariant}
					title={"Thêm biến thể"}
				>
					<CreateVariantForm
						setLoading={setLoading}
						product={product}
						onSetProduct={setProduct}
						onCreateVariant={createVariant}
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
					/>
				</Modal>
			</div>
		</div>

	);
};

// update information product
const UpdateInformationProductForm = ({ product, categories, onUpdate, setProduct, setLoading, close ,setErrors}) => {
	const [productUpdate, setProductUpdate] = useState({
		id: product?.id || "",
		name: product?.name || "",
		description: product?.description || "",
		material: product?.material || "",
		origin: product?.origin || "",
		quantity: product?.quantity || 0,
		price: product?.price || 0,
		discount: product?.discount || 0,
		categoryId: product?.categoryId || "",
		freeShip:product.freeShip || false,
		guarantee: product?.guarantee || 0,
		status: product?.status || false,
		qualityCertificate: product.qualityCertificate
	});

	const [productIsValid, setProductIsValid] = useState(true);

	const checkProduct = () => {
		if (!productUpdate.name.trim() || !productUpdate.description.trim()) {
			setProductIsValid(false);
			return false;
		}
		if (!productUpdate.categoryId) {
			setProductIsValid(false);
			return false;
		}
		if (productUpdate.quantity < 1 || productUpdate.price < 0.01 || productUpdate.discount < 0 || productUpdate.discount > 100) {
			setProductIsValid(false);
			return false;
		}
		setProductIsValid(true);
		return true;
	};

	const handleChange = (e) => {
		const { name, value, checked } = e.target;
		setProductUpdate((prev) => {
			let newValue = value;
			if (name === "status") {
				newValue = checked;
			}
			else if(name=== "freeShip") {
				newValue = checked;
			}
			else if (name === "price") {
				newValue = value ? parseInt(value.replace(/\D/g, ""), 10) || 0 : 0;
			}
			const updatedProduct = { ...prev, [name]: newValue };
			checkProduct(updatedProduct);
			return updatedProduct;
		});
	};


	useEffect(() => {
		checkProduct();
	}, [productUpdate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!productIsValid) return; // Không cho submit nếu dữ liệu không hợp lệ
		try {
			setLoading(true);
			const updatedProduct = await onUpdate(productUpdate);
			setProduct(updatedProduct);
			close();
		} catch (err) {
			if (err.errors) {
				let errorMessages = [];
				for (let field in err.errors) {
					if (Array.isArray(err.errors[field])) {
						err.errors[field].forEach((message) => {
							errorMessages.push(`${field}: ${message}`);
						});
					}
				}
				setErrors(errorMessages);
			}
		} finally {
			setLoading(false);
		}
	};
    const formatPrice = (value) => {
        return new Intl.NumberFormat("vi-VN").format(value);
    };
	return (
		<div className="p-6 overflow-y-auto max-h-[70vh]">
			<form onSubmit={handleSubmit} className="space-y-5">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm <span className="text-red-500">*</span></label>
					<input
						type="text"
						name="name"
						value={productUpdate.name}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Mô tả <span className="text-red-500">*</span></label>
					<textarea
						rows={5}
						name="description"
						value={productUpdate.description}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Chứng nhận <span className="text-red-500">*</span></label>
					<textarea
						rows={3}
						name="qualityCertificate"
						value={productUpdate.qualityCertificate}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						required
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Chất liệu <span className="text-red-500">*</span></label>
						<input
							type="text"
							name="material"
							value={productUpdate.material}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Xuất xứ <span className="text-red-500">*</span></label>
						<input
							type="text"
							name="origin"
							value={productUpdate.origin}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							required
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Số lượng <span className="text-red-500">*</span></label>
						<input
							type="number"
							name="quantity"
							value={productUpdate.quantity}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							min="1"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Giá (đ) <span className="text-red-500">*</span></label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<span className="text-gray-500">đ</span>
							</div>
							<input
								type="text"
								name="price"
								value={formatPrice(productUpdate.price)}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								step="0"
								min="1"
								required
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Giảm giá (%) <span className="text-red-500">*</span></label>
						<div className="relative">
							<input
								type="number"
								name="discount"
								value={productUpdate.discount}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								min="0"
								max="100"
								required
							/>
							<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
								<span className="text-gray-500">%</span>
							</div>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Bảo hành (Tháng)<span className="text-red-500">*</span></label>
						<input
							type="number"
							name="guarantee"
							value={productUpdate.guarantee}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							min="1"
							required
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
						<select
							name="categoryId"
							value={productUpdate.categoryId}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							required
						>
							<option value="">Chọn danh mục</option>
							{categories.map((cat) => (
								<option key={cat.categoryId} value={cat.categoryId}>
									{cat.categoryName}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-center">
						<label className="flex items-center cursor-pointer">
							<div className="relative">
								<input
									type="checkbox"
									name="status"
									checked={Boolean(productUpdate.status)}
									onChange={handleChange}
									className="sr-only"
								/>
								<div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
								<div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${productUpdate.status ? 'transform translate-x-6 bg-blue-700' : ''}`}></div>
							</div>
							<div className="ml-3 text-gray-700 font-medium">
								{productUpdate.status ? 'Đang bán' : 'Ngừng bán'}
							</div>
						</label>
					</div>
					<div className="flex items-center">
						<label className="flex items-center cursor-pointer">
							<div className="relative">
								<input
									type="checkbox"
									name="freeShip"
									checked={Boolean(productUpdate.freeShip)}
									onChange={handleChange}
									className="sr-only"
								/>
								<div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
								<div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${productUpdate.freeShip ? 'transform translate-x-6 bg-blue-700' : ''}`}></div>
							</div>
							<div className="ml-3 text-gray-700 font-medium">
								{productUpdate.freeShip ? 'Miễn ship' : 'Không miễn ship'}
							</div>
						</label>
					</div>
				</div>


				<div className="flex justify-end pt-4 border-t border-gray-200">
					<button
						type="button"
						onClick={close}
						className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50 transition-colors"
					>
						Hủy
					</button>
					<button
						disabled={!productIsValid}
						type="submit"
						className={`px-4 py-2 rounded-lg ${
							productIsValid
								? "bg-blue-600 hover:bg-blue-700 text-white"
								: "bg-gray-300 text-gray-500 cursor-not-allowed"
						} transition-colors`}
					>
						Cập nhật
					</button>
				</div>
			</form>
		</div>
	);
};

// add more image
const AddMoreImageForm = ({ product, uploadImage, setProduct, close, setLoading }) => {
	const [image, setImage] = useState({
		productId: product.id,
		description: "",
		isPrimary: false,
		file: null,
	});
	const [preview, setPreview] = useState(null);

	// Xử lý khi người dùng chọn ảnh
	const handleFileChange = async (event) => {
		const selectedFile = event.target.files[0];

		if (!selectedFile) return;

		// Kiểm tra kích thước ảnh trước khi xử lý
		if (!isImageSizeValid(selectedFile, MAX_IMAGE_SIZE_MB)) {
			alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
			return;
		}

		try {
			// Nén ảnh xuống dưới 500KB (nếu cần)
			const compressedFile = await compressImageToTargetSize(selectedFile, TARGET_IMAGE_SIZE_KB);
			setImage({ ...image, file: compressedFile });
			setPreview(URL.createObjectURL(compressedFile));
		} catch (error) {
			console.error("Lỗi khi nén ảnh:", error);
			alert("Không thể xử lý ảnh!");
		}
	};

	const clearImage = () => {
		setImage({
			productId: product.id,
			description: "",
			isPrimary: false,
			file: null,
		});
		setPreview(null);
	}

	// Xử lý khi nhập mô tả ảnh
	const handleDescriptionChange = (event) => {
		setImage({ ...image, description: event.target.value });
	};

	// Xử lý khi chọn ảnh chính (Primary)
	const handlePrimaryChange = (event) => {
		setImage({ ...image, isPrimary: event.target.checked });
	};

	// Gửi ảnh lên server
	const handleSubmit = async () => {
		if (!image.file) {
			alert("Vui lòng chọn ảnh trước khi lưu!");
			return;
		}

		try {
			setLoading(true);
			const formData = new FormData();
			formData.append("productId", image.productId);
			formData.append("description", image.description);
			formData.append("isPrimary", image.isPrimary);
			formData.append("file", image.file); // Ảnh được gửi dưới dạng file
			var result = await uploadImage(formData); // Gửi form-data lên server
			if (result) {
				clearImage();
				setProduct(result);
				close();
			}
		} catch (error) {
			console.error("Lỗi khi tải ảnh lên:", error);
			alert("Không thể tải ảnh lên. Vui lòng thử lại!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					{/* Nhập mô tả ảnh */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ảnh</label>
						<input
							type="text"
							value={image.description}
							onChange={handleDescriptionChange}
							placeholder="Nhập mô tả cho ảnh"
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						/>
					</div>

					{/* Checkbox chọn ảnh chính */}
					<div className="mb-4">
						<label className="flex items-center cursor-pointer">
							<div className="relative">
								<input
									type="checkbox"
									checked={image.isPrimary}
									onChange={handlePrimaryChange}
									className="sr-only"
								/>
								<div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
								<div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${image.isPrimary ? 'transform translate-x-6 bg-blue-500' : ''}`}></div>
							</div>
							<div className="ml-3 text-gray-700 font-medium">
								Đặt làm ảnh chính
							</div>
						</label>
					</div>

					{/* Input chọn ảnh */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">Chọn ảnh</label>
						<div className="flex items-center justify-center w-full">
							<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all">
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									<svg className="w-8 h-8 mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
									</svg>
									<p className="mb-2 text-sm text-blue-600"><span className="font-semibold">Click để tải ảnh</span></p>
									<p className="text-xs text-blue-500">PNG, JPG, GIF (Max: {MAX_IMAGE_SIZE_MB}MB)</p>
								</div>
								<input
									type="file"
									className="hidden"
									accept="image/*"
									onChange={handleFileChange}
								/>
							</label>
						</div>
					</div>
				</div>

				<div className="flex flex-col">
					<label className="block text-sm font-medium text-gray-700 mb-2">Xem trước</label>
					<div className="flex-1 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
						{preview ? (
							<img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
						) : (
							<div className="text-center p-6">
								<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
								</svg>
								<p className="mt-2 text-sm text-gray-500">Chưa có ảnh được chọn</p>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
				<button
					type="button"
					onClick={clearImage}
					className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50 transition-colors"
					disabled={!preview}
				>
					Xóa
				</button>
				<button
					type="button"
					onClick={close}
					className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50 transition-colors"
				>
					Hủy
				</button>
				<button
					onClick={handleSubmit}
					disabled={!image.file}
					className={`px-4 py-2 rounded-lg ${
						image.file
							? "bg-blue-600 hover:bg-blue-700 text-white"
							: "bg-gray-300 text-gray-500 cursor-not-allowed"
					} transition-colors`}
				>
					Lưu
				</button>
			</div>
		</div>
	);
};

// update variant
const UpdateVariantForm = ({ variant, onUpdateVariant, setLoading, onSetProduct,onClose }) => {
	const [variantUpdate, setVariantUpdate] = useState(variant);

	const handleVariantChange = (field, value) => {
		setVariantUpdate(prev => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			var result = await onUpdateVariant(variantUpdate);
			if (result) {
				onSetProduct(result);
				onClose();
			}
		} catch (error) {
			alert("Không thể cập nhật biến thể. Vui lòng thử lại!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6">
			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					{/* Size */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="size">
							Kích thước
						</label>
						<input
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							id="size"
							type="text"
							value={variantUpdate.size}
							onChange={(e) => handleVariantChange("size", e.target.value)}
						/>
					</div>

					{/* Color */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="color">
							Màu sắc
						</label>
						<input
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							id="color"
							type="text"
							value={variantUpdate.color}
							onChange={(e) => handleVariantChange("color", e.target.value)}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
					{/* Quantity */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">
							Số lượng
						</label>
						<input
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							id="quantity"
							type="number"
							min="0"
							value={variantUpdate.quantity}
							onChange={(e) => handleVariantChange("quantity", Number(e.target.value))}
						/>
					</div>

					{/* Price */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
							Giá ($)
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<span className="text-gray-500">$</span>
							</div>
							<input
								className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								id="price"
								type="number"
								step="0.01"
								min="0.01"
								value={variantUpdate.price}
								onChange={(e) => handleVariantChange("price", Number(e.target.value))}
							/>
						</div>
					</div>

					{/* Discount */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="discount">
							Giảm giá (%)
						</label>
						<div className="relative">
							<input
								className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								id="discount"
								type="number"
								min="0"
								max="100"
								value={variantUpdate.discount}
								onChange={(e) => handleVariantChange("discount", Number(e.target.value))}
							/>
							<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
								<span className="text-gray-500">%</span>
							</div>
						</div>
					</div>
				</div>

				{/* Status */}
				<div>
					<label className="flex items-center cursor-pointer">
						<div className="relative">
							<input
								type="checkbox"
								checked={variantUpdate.status}
								onChange={(e) => handleVariantChange("status", e.target.checked)}
								className="sr-only"
							/>
							<div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
							<div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${variantUpdate.status ? 'transform translate-x-6 bg-blue-500' : ''}`}></div>
						</div>
						<div className="ml-3 text-gray-700 font-medium">
							{variantUpdate.status ? 'Đang bán' : 'Ngừng bán'}
						</div>
					</label>
				</div>

				<div className="flex justify-end pt-4 border-t border-gray-200">
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
					>
						Cập nhật
					</button>
				</div>
			</form>
		</div>
	);
};

// create new variant
const CreateVariantForm = ({ setLoading, onSetProduct, onCreateVariant, product }) => {
	const [newVariant, setNewVariant] = useState({
		productId: product.id,
		size: "",
		color: "",
		quantity: 0,
		price: product.price,
		discount: 0,
		status: true,
	});

	const [isVariantValid, setIsVariantValid] = useState(false);

	// Kiểm tra tính hợp lệ của biến thể
	const checkVariant = () => {
		if (newVariant.quantity < 0 || newVariant.price < 0 || newVariant.discount < 0) return false;
		if (!newVariant.size.trim() || !newVariant.color.trim()) return false;
		if (newVariant.price === 0) return false;
		return true;
	};

	// Cập nhật dữ liệu khi nhập input
	const handleVariantChange = (field, value) => {
		setNewVariant(prev => ({
			...prev,
			[field]: field === "price" || field === "quantity" || field === "discount"
				? Math.max(0, Number(value)) // Chặn nhập số âm
				: value,
		}));
	};

	// Cập nhật trạng thái hợp lệ của variant
	useEffect(() => {
		setIsVariantValid(checkVariant());
	}, [newVariant]);

	// Xử lý submit
	const handleSubmit = async (e) => {
		e.preventDefault(); // Ngăn chặn load lại trang
		if (!isVariantValid) return;

		try {
			setLoading(true);
			const result = await onCreateVariant(newVariant);
			if (result) await onSetProduct(result);
		} catch (error) {
			console.error("Error creating variant:", error);
			alert("Không thể tạo biến thể. Vui lòng thử lại!");
		} finally {
			setTimeout(() => setLoading(false), 1000);
		}
	};

	return (
		<div className="p-6">
			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					{/* Size */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="size">
							Kích thước <span className="text-red-500">*</span>
						</label>
						<input
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							id="size"
							type="text"
							placeholder="S, M, L, XL, etc."
							value={newVariant.size}
							onChange={(e) => handleVariantChange("size", e.target.value)}
							required
						/>
					</div>

					{/* Color */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="color">
							Màu sắc <span className="text-red-500">*</span>
						</label>
						<input
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							id="color"
							type="text"
							placeholder="Đỏ, Xanh, Vàng, etc."
							value={newVariant.color}
							onChange={(e) => handleVariantChange("color", e.target.value)}
							required
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
					{/* Quantity */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">
							Số lượng <span className="text-red-500">*</span>
						</label>
						<input
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
							id="quantity"
							type="number"
							min="0"
							placeholder="0"
							value={newVariant.quantity}
							onChange={(e) => handleVariantChange("quantity", e.target.value)}
							required
						/>
					</div>

					{/* Price */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
							Giá ($) <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<span className="text-gray-500">$</span>
							</div>
							<input
								className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								id="price"
								type="number"
								step="0.01"
								min="0.01"
								placeholder="0.00"
								value={newVariant.price}
								onChange={(e) => handleVariantChange("price", e.target.value)}
								required
							/>
						</div>
					</div>

					{/* Discount */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="discount">
							Giảm giá (%)
						</label>
						<div className="relative">
							<input
								className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
								id="discount"
								type="number"
								min="0"
								max="100"
								placeholder="0"
								value={newVariant.discount}
								onChange={(e) => handleVariantChange("discount", e.target.value)}
							/>
							<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
								<span className="text-gray-500">%</span>
							</div>
						</div>
					</div>
				</div>

				{/* Status */}
				<div>
					<label className="flex items-center cursor-pointer">
						<div className="relative">
							<input
								type="checkbox"
								checked={newVariant.status}
								onChange={(e) => handleVariantChange("status", e.target.checked)}
								className="sr-only"
							/>
							<div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
							<div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${newVariant.status ? 'transform translate-x-6 bg-blue-500' : ''}`}></div>
						</div>
						<div className="ml-3 text-gray-700 font-medium">
							{newVariant.status ? 'Đang bán' : 'Ngừng bán'}
						</div>
					</label>
				</div>

				<div className="flex justify-end pt-4 border-t border-gray-200">
					<button
						type="submit"
						disabled={!isVariantValid}
						className={`px-4 py-2 rounded-lg ${
							isVariantValid
								? "bg-blue-600 hover:bg-blue-700 text-white"
								: "bg-gray-300 text-gray-500 cursor-not-allowed"
						} transition-colors`}
					>
						Tạo biến thể
					</button>
				</div>
			</form>
		</div>
	);
};

// update image
const UpdateImageForm = ({ image, onUpdateImage, onSetProduct, close, onDelete, setLoading }) => {
	const [preview, setPreview] = useState(image.image || null);
	const [newImage, setNewImage] = useState({
		productImageId: image.id,
		description: image.description,
		isPrimary: image.isPrimary,
		file: null,
	});

	// Khi người dùng chọn ảnh mới
	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Kiểm tra dung lượng ảnh trước khi upload
		if (!isImageSizeValid(file, MAX_IMAGE_SIZE_MB)) {
			alert("Ảnh vượt quá 0.5MB! Hệ thống sẽ tự động nén ảnh...");
			try {
				const compressedFile = await compressImageToTargetSize(file, TARGET_IMAGE_SIZE_KB);
				setPreview(URL.createObjectURL(compressedFile));
				setNewImage((prev) => ({ ...prev, file: compressedFile }));
			} catch (error) {
				console.error("Lỗi khi nén ảnh:", error);
				alert("Không thể nén ảnh, vui lòng chọn ảnh khác.");
			}
		} else {
			setPreview(URL.createObjectURL(file));
			setNewImage((prev) => ({ ...prev, file }));
		}
	};

	// Khi người dùng chỉnh sửa mô tả
	const handleDescriptionChange = (e) => {
		setNewImage((prev) => ({ ...prev, description: e.target.value }));
	};

	// Khi chọn ảnh chính
	const handlePrimaryChange = () => {
		setNewImage((prev) => ({ ...prev, isPrimary: !prev.isPrimary }));
	};
	const handleDrop = async (e) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];  // Lấy file từ event

		if (!file) return;
		if (!isImageSizeValid(file, MAX_IMAGE_SIZE_MB)) {
			alert("Ảnh vượt quá 0.5MB! Hệ thống sẽ tự động nén ảnh...");
			try {
				const compressedFile = await compressImageToTargetSize(file, TARGET_IMAGE_SIZE_KB);
				setPreview(URL.createObjectURL(compressedFile));
				setNewImage((prev) => ({ ...prev, file: compressedFile }));
			} catch (error) {
				console.error("Lỗi khi nén ảnh:", error);
				alert("Không thể nén ảnh, vui lòng chọn ảnh khác.");
			}
		} else {
			setPreview(URL.createObjectURL(file));
			setNewImage((prev) => ({ ...prev, file }));
		}
	};

	// Gửi ảnh lên server
	const handleSubmit = async () => {
		if (!newImage.file) {
			alert("Vui lòng chọn ảnh mới!");
			return;
		}

		setLoading(true);

		const formData = new FormData();
		formData.append("productImageId", newImage.productImageId);
		formData.append("description", newImage.description);
		formData.append("isPrimary", newImage.isPrimary);
		formData.append("file", newImage.file);

		try {
			var result = await onUpdateImage(formData);
			if (result) {
				onSetProduct(result);
				close();
			} else {
				alert("Cập nhật thất bại!");
			}
		} catch (error) {
			console.log(error.message);
			alert("Không thể cập nhật ảnh. Vui lòng thử lại!");
		} finally {
			setLoading(false);
		}
	};

	// Xóa ảnh
	const handleDelete = async () => {
		const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa ảnh này?");
		if (!confirmDelete) return;

		setLoading(true);
		try {
		    var result =	await onDelete(image.id);
			onSetProduct(result);
			close();
		} catch (error) {
			console.error("Lỗi khi xóa ảnh:", error);
			alert("Không thể xóa ảnh. Vui lòng thử lại!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					{/* Nhập mô tả ảnh */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ảnh</label>
						<input
							type="text"
							value={newImage.description}
							onChange={handleDescriptionChange}
							placeholder="Nhập mô tả cho ảnh"
							className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						/>
					</div>

					{/* Checkbox chọn ảnh chính */}
					<div className="mb-4">
						<label className="flex items-center cursor-pointer">
							<div className="relative">
								<input
									type="checkbox"
									checked={newImage.isPrimary}
									onChange={handlePrimaryChange}
									className="sr-only"
								/>
								<div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
								<div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${newImage.isPrimary ? 'transform translate-x-6 bg-blue-500' : ''}`}></div>
							</div>
							<div className="ml-3 text-gray-700 font-medium">
								Đặt làm ảnh chính
							</div>
						</label>
					</div>

					{/* Input chọn ảnh */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">Chọn ảnh mới</label>
						<div className="flex items-center justify-center w-full">
							<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all"

								   onDragOver={(e) => e.preventDefault()}  // Cho phép kéo thả
								   onDrop={handleDrop}>
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									<svg className="w-8 h-8 mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
									</svg>
									<p className="mb-2 text-sm text-blue-600"><span className="font-semibold">Click để tải ảnh</span></p>
									<p className="text-xs text-blue-500">PNG, JPG, GIF (Max: {MAX_IMAGE_SIZE_MB}MB)</p>
								</div>
								<input
									type="file"
									className="hidden"
									accept="image/*"
									onChange={handleFileChange}
								/>
							</label>
						</div>
					</div>
				</div>

				<div className="flex flex-col">
					<label className="block text-sm font-medium text-gray-700 mb-2">Xem trước</label>
					<div className="flex-1 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
						{preview ? (
							<img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
						) : (
							<div className="text-center p-6">
								<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
								</svg>
								<p className="mt-2 text-sm text-gray-500">Chưa có ảnh được chọn</p>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
				<button
					onClick={handleDelete}
					className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
				>
					<Trash2 size={16} className="mr-2" /> Xóa ảnh
				</button>

				<div>
					<button
						type="button"
						onClick={close}
						className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-50 transition-colors"
					>
						Hủy
					</button>
					<button
						onClick={handleSubmit}
						disabled={!newImage.file}
						className={`px-4 py-2 rounded-lg ${
							newImage.file
								? "bg-blue-600 hover:bg-blue-700 text-white"
								: "bg-gray-300 text-gray-500 cursor-not-allowed"
						} transition-colors`}
					>
						Cập nhật
					</button>
				</div>
			</div>
		</div>
	);
};

const AddProductTaxForm = ({ setLoading, onAddProductTax, onDeleteProductTax, close, taxes, product, setProduct }) => {
	const [productTaxes, setProductTaxes] = useState(product.taxes || []);
	const [taxMap, setTaxMap] = useState([]);

	useEffect(() => {
		const updatedTaxMap = (taxes || []).map(tax => {
			// Tìm kiếm productTaxId trong productTaxes
			const relatedProductTax = productTaxes.find(productTax => productTax.taxId === tax.taxId);
			return {
				...tax,
				productTaxId: relatedProductTax ? relatedProductTax.productTaxId : null, // Nếu có productTax thì lấy productTaxId, nếu không có thì gán null
				added: productTaxes.some(productTax => productTax.taxId === tax.taxId) // Kiểm tra xem thuế đã được thêm chưa
			};
		});
		setTaxMap(updatedTaxMap); // Cập nhật lại taxMap
	}, [taxes, productTaxes]);

	const addTax = async (tax) => {
		setLoading(true);
		try {
			const result = await onAddProductTax(product.id, tax.taxId);
			setProduct(result);
			close();
		} catch (error) {
			console.log(error);
			alert("Không thể thêm thuế. Vui lòng thử lại!");
		} finally {
			setLoading(false);
		}
	}

	const removeTax = async (tax) => {
		setLoading(true);
		try {
			const result = await onDeleteProductTax(tax.productTaxId);
			setProduct(result);
			close();
		} catch (error) {
			console.log(error);
			alert("Không thể xóa thuế. Vui lòng thử lại!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6">
			<div className="mb-4">
				<h3 className="text-lg font-medium text-gray-800 mb-4">Danh sách thuế</h3>

				{taxMap.length > 0 ? (
					<div className="overflow-hidden border border-gray-200 rounded-lg">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
							<tr>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tên Thuế
								</th>
								<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tỷ Lệ (%)
								</th>
								<th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Thao tác
								</th>
							</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
							{taxMap.map((tax) => (
								<tr key={tax.taxId} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{tax.taxName}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{tax.taxRate}%
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										{!tax.added ? (
											<button
												onClick={() => addTax(tax)}
												className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
											>
												<Plus size={14} className="mr-1" /> Thêm
											</button>
										) : (
											<button
												onClick={() => removeTax(tax)}
												className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
											>
												<Trash2 size={14} className="mr-1" /> Xóa
											</button>
										)}
									</td>
								</tr>
							))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
						<Tag className="mx-auto h-12 w-12 text-gray-400" />
						<h3 className="mt-2 text-sm font-medium text-gray-900">Không có thuế</h3>
						<p className="mt-1 text-sm text-gray-500">Chưa có thuế nào được thiết lập.</p>
					</div>
				)}
			</div>

			<div className="flex justify-end pt-4 border-t border-gray-200">
				<button
					onClick={close}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
				>
					Đóng
				</button>
			</div>
		</div>
	);
};

export default UpdateProduct;