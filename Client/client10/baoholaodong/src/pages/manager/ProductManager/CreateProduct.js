"use client"

import {useContext, useEffect, useState} from "react"
import { ProductContext } from "../../../contexts/AdminProductContext"
import { useNavigate } from "react-router-dom"
import Loading from "../../../components/Loading/Loading"
import { isImageSizeValid, compressImageToTargetSize } from "../../../utils/imageUtils"
import ErrorList from "../../../components/ErrorList/ErrorList"
import ProductPreview from "./ProductPreview"
import {TextEditor, TextEditor2} from "../../../components/TextEditor";
import ManagerToast from "../../../components/managerToast/ManagerToast";


const MAX_IMAGE_SIZE_MB = 0.2
const TARGET_IMAGE_SIZE_KB = 0.1 * 1024

const CreateProduct = () => {
	const navigate = useNavigate()
	const { categories, createProduct } = useContext(ProductContext)
	const [product, setProduct] = useState({
		name: "",
		category: "",
		description: "",
		material: "",
		origin: "",
		quantity: 1,
		price: 0,
		discount: 0,
		freeShip: false,
		guarantee: 0,
		status: true,
		qualityCertificate: "",
		productVariants: [],
		files: [],
	})
	const [images, setImages] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [currentStep, setCurrentStep] = useState(1)
	const totalSteps = 4
	const [errors, setErrors] = useState([])
	const [showProductPreview, setShowProductPreview] = useState(false)
	const [toastMessage, setToastMessage] = useState("");
	const [toastType, setToastType] = useState("success"); // Thêm state cho type
	const [showToast, setShowToast] = useState(false);

	const handleChange = (e) => {
		const { id, value, checked } = e.target
		let newValue = value

		if (id === "price") {
			newValue = Number.parseInt(value.replace(/\D/g, ""), 10) || 0
		} else if (id === "freeShip") {
			newValue = checked
		}
		setProduct((prev) => ({
			...prev,
			[id]: newValue,
		}))
	}

	const addVariant = () => {
		setProduct((prev) => ({
			...prev,
			productVariants: [
				...prev.productVariants,
				{
					productId: 0,
					size: "",
					color: "",
					quantity: 1,
					price: product.price,
					discount: 0,
					status: true,
				},
			],
		}))
	}

	// Xử lý thay đổi biến thể
	const handleVariantChange = (index, e) => {
		const { id, value } = e.target
		setProduct((prev) => {
			const updatedVariants = [...prev.productVariants]
			updatedVariants[index][id] = id === "price" ? Number.parseInt(value.replace(/\D/g, ""), 10) || 0 : value
			return { ...prev, productVariants: updatedVariants }
		})
	}
	// Xóa biến thể sản phẩm
	const removeVariant = (index) => {
		setProduct((prev) => ({
			...prev,
			productVariants: prev.productVariants.filter((_, i) => i !== index),
		}))
	}

	// Xử lý chọn ảnh
	const handleImageChange = async (e) => {
		const selectedFiles = Array.from(e.target.files)
		const validImages = await Promise.all(
			selectedFiles.map(async (file) => {
				if (!isImageSizeValid(file, MAX_IMAGE_SIZE_MB)) {
					alert("File quá lớn! Chỉ chấp nhận ảnh dưới " + MAX_IMAGE_SIZE_MB + "MB")
					return null
				}
				return await compressImageToTargetSize(file, TARGET_IMAGE_SIZE_KB)
			}),
		)

		setImages((prevImages) => [...prevImages, ...validImages.filter((img) => img !== null)])
	}

	// Xóa ảnh đã chọn
	const removeImage = (index) => {
		setImages((prevImages) => prevImages.filter((_, i) => i !== index))
	}

	// Insert Markdown syntax for description
	const insertDescriptionMarkdown = (syntax, placeholder = "") => {
		const textarea = document.querySelector("textarea#description")
		if (!textarea) return

		const start = textarea.selectionStart
		const end = textarea.selectionEnd
		const text = textarea.value
		const before = text.substring(0, start)
		const selection = text.substring(start, end) || placeholder
		const after = text.substring(end)

		let insertText
		switch (syntax) {
			case "bold":
				insertText = `**${selection}**`
				break
			case "italic":
				insertText = `*${selection}*`
				break
			case "heading":
				insertText = `## ${selection}`
				break
			case "list":
				insertText = `- ${selection}\n- Item 2\n- Item 3`
				break
			case "link":
				insertText = `[${selection || "Link text"}](https://example.com)`
				break
			default:
				insertText = selection
		}

		setProduct((prev) => ({
			...prev,
			description: before + insertText + after,
		}))

		// Set cursor position after update
		setTimeout(() => {
			textarea.focus()
			const newCursorPos = start + insertText.length
			textarea.setSelectionRange(newCursorPos, newCursorPos)
		}, 0)
	}

	// Insert Markdown syntax for certificate
	const insertCertificateMarkdown = (syntax, placeholder = "") => {
		const textarea = document.querySelector("textarea#qualityCertificate")
		if (!textarea) return

		const start = textarea.selectionStart
		const end = textarea.selectionEnd
		const text = textarea.value
		const before = text.substring(0, start)
		const selection = text.substring(start, end) || placeholder
		const after = text.substring(end)

		let insertText
		switch (syntax) {
			case "bold":
				insertText = `**${selection}**`
				break
			case "italic":
				insertText = `*${selection}*`
				break
			case "heading":
				insertText = `## ${selection}`
				break
			case "list":
				insertText = `- ${selection}\n- Item 2\n- Item 3`
				break
			case "link":
				insertText = `[${selection || "Link text"}](https://example.com)`
				break
			default:
				insertText = selection
		}

		setProduct((prev) => ({
			...prev,
			qualityCertificate: before + insertText + after,
		}))

		// Set cursor position after update
		setTimeout(() => {
			textarea.focus()
			const newCursorPos = start + insertText.length
			textarea.setSelectionRange(newCursorPos, newCursorPos)
		}, 0)
	}

	// Gửi dữ liệu lên server
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			const formData = new FormData();
			formData.append("name", product.name);
			formData.append("category", product.category);
			formData.append("description", product.description);
			formData.append("material", product.material);
			formData.append("origin", product.origin);
			formData.append("quantity", product.quantity);
			formData.append("price", product.price);
			formData.append("freeShip", product.freeShip);
			formData.append("guarantee", product.guarantee);
			formData.append("discount", product.discount);
			formData.append("status", product.status);
			formData.append("qualityCertificate", product.qualityCertificate);
			product.productVariants.forEach((variant, index) => {
				formData.append(`productVariants[${index}].size`, variant.size);
				formData.append(`productVariants[${index}].color`, variant.color);
				formData.append(`productVariants[${index}].quantity`, variant.quantity);
				formData.append(`productVariants[${index}].price`, variant.price);
				formData.append(`productVariants[${index}].discount`, variant.discount);
				formData.append(`productVariants[${index}].status`, variant.status);
			});
			images.forEach((image) => {
				formData.append("files", image);
			});
			await createProduct(formData);
			navigate("/manager/products", { state: { toastMessage: "Thêm sản phẩm thành công!", toastType: "success" } });
		} catch (err) {
			setToastMessage("Không tạo được sản phẩm!");
			setToastType("error"); // Thêm type error
			setShowToast(true);
			if (err.errors) {
				const errorMessages = [];
				for (const field in err.errors) {
					if (Array.isArray(err.errors[field])) {
						err.errors[field].forEach((message) => {
							errorMessages.push(`${field}: ${message}`);
						});
					}
				}
				setErrors(errorMessages);
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Chuyển đến bước tiếp theo
	const nextStep = () => {
		setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
	}

	// Quay lại bước trước
	const prevStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1))
	}
	const formatPrice = (value) => {
		return new Intl.NumberFormat("vi-VN").format(value)
	}
	// Kiểm tra xem có thể chuyển đến bước tiếp theo không
	const canProceedToNextStep = () => {
		switch (currentStep) {
			case 1: // Basic Information
				return (
					product.name &&
					product.category &&
					product.description &&
					product.material &&
					product.origin &&
					product.qualityCertificate
				)
			case 2: // Pricing & Inventory
				return product.price > 0 && product.quantity > 0
			case 3: // Product Images
				return images.length > 0
			case 4: // Product Variants
				return true // Variants are optional
			default:
				return false
		}
	}

	// Check if we can show the preview (need minimum required fields)
	const canShowPreview = () => {
		return product.name && product.description && product.material && product.origin && product.price > 0
	}

	return (
		<div className="space-y-6">
			<Loading isLoading={isLoading} />
			<ErrorList errors={errors} />
			<div className="max-w-[100%] mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
				<div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8 flex justify-between items-center">
					<h2 className="text-3xl font-extrabold text-white">Create New Product</h2>

					{/* Preview button */}
					<button
						type="button"
						onClick={() => setShowProductPreview(true)}
						disabled={!canShowPreview()}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							canShowPreview()
								? "bg-white text-blue-600 hover:bg-blue-50"
								: "bg-gray-300 text-gray-500 cursor-not-allowed"
						}`}
					>
						Preview Product
					</button>
				</div>

				{/* Progress Bar */}
				<div className="px-8 pt-6">
					<div className="relative">
						<div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
							<div
								style={{ width: `${(currentStep / totalSteps) * 100}%` }}
								className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
							></div>
						</div>
						<div className="flex justify-between">
							{[1, 2, 3, 4].map((step) => (
								<div
									onClick={() => {
										if (currentStep > step) {
											setCurrentStep(step)
										}
									}}
									key={step}
									className={`flex flex-col items-center ${step <= currentStep ? "text-blue-600" : "text-gray-400"}`}
								>
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
											step < currentStep
												? "bg-blue-600 text-white"
												: step === currentStep
													? "border-2 border-blue-600 text-blue-600"
													: "border-2 border-gray-300 text-gray-400"
										}`}
									>
										{step < currentStep ? (
											<svg
												className="w-6 h-6"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
											</svg>
										) : (
											step
										)}
									</div>
									<span className="text-xs font-medium">
                    {step === 1 && "Basic Info"}
										{step === 2 && "Pricing"}
										{step === 3 && "Images"}
										{step === 4 && "Variants"}
                  </span>
								</div>
							))}
						</div>
					</div>
				</div>

				<form className="p-8 pt-4">
					{/* Step 1: Basic Information */}
					{currentStep === 1 && (
						<div className="transition-all duration-300">
							<h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Basic Information</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/*name*/}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
										Tên Sản Phẩm<span className="text-red-500">*</span>
									</label>
									<input
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
										id="name"
										type="text"
										placeholder="Enter product name"
										value={product.name}
										onChange={handleChange}
										required
									/>
								</div>
								{/*category*/}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="category">
										Danh mục sản phẩm <span className="text-red-500">*</span>
									</label>
									<select
										id="category"
										value={product.category}
										onChange={handleChange}
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

								{/* Description with TextEditor */}
								<div className="md:col-span-2 space-y-2">
									<div className="flex justify-between items-center">
										<label className="block text-sm font-medium text-gray-700" htmlFor="description">
											Mô Tả sản phẩm <span className="text-red-500">*</span>
										</label>
									</div>
									<div className="h-[250px] overflow-hidden">
										<TextEditor2
											height="200px"
											value={product.description}
											maxLength={1200}
											setValue={(newValue) => setProduct((prev) => ({ ...prev, description: newValue }))}
										/>
									</div>
								</div>
								{/* Quality Certificate with TextEditor */}
								<div className="md:col-span-2 space-y-2">
									<div className="flex justify-between items-center">
										<label className="block text-sm font-medium text-gray-700" htmlFor="qualityCertificate">
											Chứng nhận sản phẩm(CO,CQ) <span className="text-red-500">*</span>
										</label>
									</div>
									<div className="h-[250px] overflow-hidden">
										<TextEditor2
											value={product.qualityCertificate}
											height={'100px'}
											setValue={(newValue) => setProduct((prev) => ({ ...prev, qualityCertificate: newValue }))}
										/>
									</div>
								</div>

								{/*material*/}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="material">
										Chất liệu sản phẩm <span className="text-red-500">*</span>
									</label>
									<input
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
										id="material"
										type="text"
										placeholder="Product material"
										value={product.material}
										onChange={handleChange}
										required
									/>
								</div>
								{/*origin*/}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="origin">
										Xuất xứ <span className="text-red-500">*</span>
									</label>
									<input
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
										id="origin"
										type="text"
										placeholder="Country of origin"
										value={product.origin}
										onChange={handleChange}
										required
									/>
								</div>
							</div>
						</div>
					)}

					{/* Step 2: Pricing & Inventory */}
					{currentStep === 2 && (
						<div className="transition-all duration-300">
							<h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
								Pricing & Inventory
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="price">
										Giá (đ) <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<span className="text-gray-500">đ</span>
										</div>
										<input
											className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
											id="price"
											type="text"
											step="1000"
											min="1"
											placeholder="1000"
											value={formatPrice(product.price)}
											onChange={handleChange}
											required
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="discount">
										Giảm giá (%) <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<input
											className="w-full pr-8 pl-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
											id="discount"
											type="number"
											min="0"
											max="100"
											placeholder="0"
											value={product.discount}
											onChange={handleChange}
											required
										/>
										<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
											<span className="text-gray-500">%</span>
										</div>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="quantity">
										Số lượng <span className="text-red-500">*</span>
									</label>
									<input
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
										id="quantity"
										type="number"
										min="1"
										placeholder="1"
										value={product.quantity}
										onChange={handleChange}
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="guarantee">
										Bảo hành (Tháng) <span className="text-red-500"></span>
									</label>
									<input
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
										id="guarantee"
										type="number"
										min="0"
										placeholder="0"
										value={product.guarantee}
										onChange={handleChange}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="freeShip">
										Miễn ship <span className="text-red-500"></span>
									</label>
									<div className="flex items-center">
										<label className="flex items-center cursor-pointer">
											<div className="relative">
												<input
													id="freeShip"
													type="checkbox"
													name="freeShip"
													checked={Boolean(product.freeShip)}
													onChange={handleChange}
													className="sr-only"
												/>
												<div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
												<div
													className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${product.freeShip ? "transform translate-x-6 bg-blue-700" : ""}`}
												></div>
											</div>
										</label>
									</div>
								</div>
							</div>

							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<div className="flex items-start">
									<div className="flex-shrink-0">
										<svg
											className="h-5 w-5 text-blue-400"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="ml-3">
										<h3 className="text-sm font-medium text-blue-800">Pricing Information</h3>
										<div className="mt-2 text-sm text-blue-700">
											<p>
												The base price is the standard price for this product. You can set different prices for each
												variant in the variants section.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Step 3: Product Images */}
					{currentStep === 3 && (
						<div className="transition-all duration-300">
							<h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Product Images</h3>

							<div className="mb-4">
								<div className="flex items-center justify-center w-full">
									<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all">
										<div className="flex flex-col items-center justify-center pt-5 pb-6">
											<svg
												className="w-10 h-10 mb-3 text-blue-500"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
												></path>
											</svg>
											<p className="mb-2 text-sm text-blue-600">
												<span className="font-semibold">Click to upload</span> or drag and drop
											</p>
											<p className="text-xs text-blue-500">PNG, JPG, GIF up to {MAX_IMAGE_SIZE_MB * 1024}MB</p>
										</div>
										<input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
									</label>
								</div>
							</div>

							{images.length > 0 ? (
								<div className="mt-6">
									<h4 className="text-sm font-medium text-gray-700 mb-3">Selected Images ({images.length})</h4>
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
										{images.map((image, index) => (
											<div key={index} className="relative group">
												<div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
													<img
														src={URL.createObjectURL(image) || "/placeholder.svg"}
														alt={`Preview ${index + 1}`}
														className="h-full w-full object-cover object-center"
													/>
												</div>
												<button
													type="button"
													onClick={() => removeImage(index)}
													className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md opacity-90 hover:opacity-100 transition-opacity"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M6 18L18 6M6 6l12 12"
														/>
													</svg>
												</button>
											</div>
										))}
									</div>
								</div>
							) : (
								<div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
									<div className="flex items-start">
										<div className="flex-shrink-0">
											<svg
												className="h-5 w-5 text-yellow-400"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
										<div className="ml-3">
											<h3 className="text-sm font-medium text-yellow-800">No images selected</h3>
											<div className="mt-2 text-sm text-yellow-700">
												<p>
													Please upload at least one image for your product. High-quality images help customers make
													purchase decisions.
												</p>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Step 4: Product Variants */}
					{currentStep === 4 && (
						<div className="transition-all duration-300">
							<div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
								<h3 className="text-xl font-bold text-gray-800">Product Variants</h3>
								<button
									type="button"
									onClick={addVariant}
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
											clipRule="evenodd"
										/>
									</svg>
									Add Variant
								</button>
							</div>

							{product.productVariants.length === 0 ? (
								<div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
									<svg
										className="mx-auto h-12 w-12 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
										></path>
									</svg>
									<h3 className="mt-2 text-sm font-medium text-gray-900">No variants</h3>
									<p className="mt-1 text-sm text-gray-500">Get started by adding a new product variant.</p>
									<div className="mt-6">
										<button
											type="button"
											onClick={addVariant}
											className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
										>
											<svg
												className="-ml-1 mr-2 h-5 w-5"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
													clipRule="evenodd"
												/>
											</svg>
											Add your first variant
										</button>
									</div>
								</div>
							) : (
								<div className="space-y-6">
									{product.productVariants.map((variant, index) => (
										<div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
											<div className="flex justify-between items-center mb-4">
												<h4 className="text-lg font-medium text-gray-900">Variant #{index + 1}</h4>
												<button
													type="button"
													onClick={() => removeVariant(index)}
													className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4 mr-1"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path
															fillRule="evenodd"
															d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
															clipRule="evenodd"
														/>
													</svg>
													Remove
												</button>
											</div>

											<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`size-${index}`}>
														Size
													</label>
													<input
														className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
														id="size"
														type="text"
														placeholder="S, M, L, XL, etc."
														value={variant.size}
														onChange={(e) => handleVariantChange(index, e)}
													/>
												</div>

												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`color-${index}`}>
														Color
													</label>
													<input
														className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
														id="color"
														type="text"
														placeholder="Red, Blue, etc."
														value={variant.color}
														onChange={(e) => handleVariantChange(index, e)}
													/>
												</div>

												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`quantity-${index}`}>
														Quantity
													</label>
													<input
														className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
														id="quantity"
														type="number"
														min="1"
														placeholder="1"
														value={variant.quantity}
														onChange={(e) => handleVariantChange(index, e)}
													/>
												</div>

												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`price-${index}`}>
														Price (đ)
													</label>
													<div className="relative">
														<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
															<span className="text-gray-500">đ</span>
														</div>
														<input
															className="w-full pl-7 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
															id="price"
															type="text"
															placeholder="0.00"
															value={formatPrice(variant.price)}
															onChange={(e) => handleVariantChange(index, e)}
														/>
													</div>
												</div>

												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`discount-${index}`}>
														Discount (%)
													</label>
													<div className="relative">
														<input
															className="w-full pr-7 pl-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
															id="discount"
															type="number"
															min="0"
															max="100"
															placeholder="0"
															value={variant.discount}
															onChange={(e) => handleVariantChange(index, e)}
														/>
														<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
															<span className="text-gray-500">%</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}

							<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<div className="flex items-start">
									<div className="flex-shrink-0">
										<svg
											className="h-5 w-5 text-blue-400"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="ml-3">
										<h3 className="text-sm font-medium text-blue-800">About Variants</h3>
										<div className="mt-2 text-sm text-blue-700">
											<p>
												Variants allow you to offer different versions of the same product (e.g., different sizes,
												colors). If your product doesn't have variants, you can skip this step.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Navigation Buttons */}
					<div className="flex justify-between pt-6 mt-8 border-t border-gray-200">
						<button
							type="button"
							onClick={currentStep === 1 ? () => navigate("/manager/products") : prevStep}
							className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							{currentStep === 1 ? "Cancel" : "Previous"}
						</button>

						{currentStep < totalSteps ? (
							<button
								type="button"
								onClick={nextStep}
								disabled={!canProceedToNextStep()}
								className={`px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
									canProceedToNextStep() ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"
								}`}
							>
								Next
							</button>
						) : (
							<button
								type="button"
								onClick={(e) => handleSubmit(e)}
								className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
							>
								Create Product
							</button>
						)}
					</div>
				</form>
			</div>

			{/* Product Preview Modal */}
			{showProductPreview && (
				<ProductPreview product={product} images={images} onClose={() => setShowProductPreview(false)} />
			)}
			{showToast && (
				<ManagerToast message={toastMessage} onClose={() => setShowToast(false)} type={toastType} />
			)}
		</div>
	)
}

export default CreateProduct

