"use client"

import { useEffect, useState } from "react"
import { formatPrice, parseVND } from "../../../../utils/format"
import { Markdown } from "../../../../components/Markdown/markdown-editor"

export default function UpdateInformationProductForm({product, categories, onUpdate, setProduct, setLoading, close, setErrors,}) {
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
        freeShip: product?.freeShip || false,
        guarantee: product?.guarantee || 0,
        status: product?.status || false,
        qualityCertificate: product?.qualityCertificate || "",
    })

    const [productIsValid, setProductIsValid] = useState(true)
    const [showMarkdownHelp, setShowMarkdownHelp] = useState(false)
    const [previewMode, setPreviewMode] = useState(false)
    const [previewCertificate, setPreviewCertificate] = useState(false)

    const checkProduct = () => {
        if (!productUpdate.name.trim() || !productUpdate.description.trim()) {
            setProductIsValid(false)
            return false
        }
        if (!productUpdate.categoryId) {
            setProductIsValid(false)
            return false
        }
        if (
            productUpdate.quantity < 1 ||
            productUpdate.price < 0.01 ||
            productUpdate.discount < 0 ||
            productUpdate.discount > 100
        ) {
            setProductIsValid(false)
            return false
        }
        setProductIsValid(true)
        return true
    }

    const handleChange = (e) => {
        const { name, value, checked } = e.target
        setProductUpdate((prev) => {
            let newValue = value
            if (name === "status") {
                newValue = checked
            } else if (name === "freeShip") {
                newValue = checked
            } else if (name === "price") {
                newValue = value ? parseVND(value) : 0
            }
            const updatedProduct = { ...prev, [name]: newValue }
            checkProduct(updatedProduct)
            return updatedProduct
        })
    }

    useEffect(() => {
        checkProduct()
    }, [productUpdate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!productIsValid) return // Không cho submit nếu dữ liệu không hợp lệ
        try {
            setLoading(true)
            const updatedProduct = await onUpdate(productUpdate)
            setProduct(updatedProduct)
            close()
        } catch (err) {
            if (err.errors) {
                const errorMessages = []
                for (const field in err.errors) {
                    if (Array.isArray(err.errors[field])) {
                        err.errors[field].forEach((message) => {
                            errorMessages.push(`${field}: ${message}`)
                        })
                    }
                }
                setErrors(errorMessages)
            }
        } finally {
            setLoading(false)
        }
    }

    const insertMarkdownSyntax = (syntax, placeholder = "") => {
        const textarea = document.querySelector('textarea[name="description"]')
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

        setProductUpdate((prev) => ({
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

    const insertCertificateSyntax = (syntax, placeholder = "") => {
        const textarea = document.querySelector('textarea[name="qualityCertificate"]')
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

        setProductUpdate((prev) => ({
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

    return (
        <div className="p-6 overflow-y-auto max-h-[80vh]">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={productUpdate.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowMarkdownHelp(!showMarkdownHelp)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                {showMarkdownHelp ? "Ẩn hướng dẫn" : "Xem hướng dẫn định dạng"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewMode(!previewMode)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                {previewMode ? "Chỉnh sửa" : "Xem trước"}
                            </button>
                        </div>
                    </div>

                    {showMarkdownHelp && (
                        <div className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 mb-2">
                            <h4 className="font-medium mb-2">Hướng dẫn định dạng:</h4>
                            <ul className="space-y-1 text-gray-600">
                                <li>
                                    <code className="bg-gray-100 px-1">**Chữ đậm**</code> - <strong>Chữ đậm</strong>
                                </li>
                                <li>
                                    <code className="bg-gray-100 px-1">*Chữ nghiêng*</code> - <em>Chữ nghiêng</em>
                                </li>
                                <li>
                                    <code className="bg-gray-100 px-1">## Tiêu đề</code> -{" "}
                                    <span className="font-semibold text-lg">Tiêu đề</span>
                                </li>
                                <li>
                                    <code className="bg-gray-100 px-1">- Danh sách</code> - Danh sách có dấu đầu dòng
                                </li>
                                <li>
                                    <code className="bg-gray-100 px-1">[Liên kết](url)</code> -{" "}
                                    <a href="#" className="text-blue-600 underline">
                                        Liên kết
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}

                    {!previewMode ? (
                        <div className="relative">
                            <div className="absolute top-2 right-2 flex space-x-1 bg-white rounded-md border border-gray-200 shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => insertMarkdownSyntax("bold", "Chữ đậm")}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title="Chữ đậm"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                    >
                                        <path d="M8 11h4.5a2.5 2.5 0 0 0 0-5H8v5Zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 0 0 1 3.256 7.613A4.5 4.5 0 0 1 18 15.5ZM8 13v5h5.5a2.5 2.5 0 0 0 0-5H8Z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertMarkdownSyntax("italic", "Chữ nghiêng")}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title="Chữ nghiêng"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                    >
                                        <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15v2Z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertMarkdownSyntax("heading", "Tiêu đề")}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title="Tiêu đề"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                    >
                                        <path d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16Zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21Z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertMarkdownSyntax("list", "Mục danh sách")}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title="Danh sách"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                    >
                                        <path d="M8 4h13v2H8V4ZM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM8 11h13v2H8v-2Zm0 7h13v2H8v-2Z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertMarkdownSyntax("link", "Văn bản liên kết")}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title="Liên kết"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                    >
                                        <path d="M18.364 15.536 16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414Zm-2.828 2.828-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414Zm-.708-10.607 1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07Z" />
                                    </svg>
                                </button>
                            </div>
                            <textarea
                                rows={8}
                                name="description"
                                value={productUpdate.description}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm"
                                required
                                placeholder="Nhập mô tả sản phẩm... (Hỗ trợ định dạng Markdown)"
                            />
                        </div>
                    ) : (
                        <div className="border border-gray-300 rounded-lg p-4 bg-white min-h-[200px] markdown-preview">
                            <Markdown content={productUpdate.description} />
                        </div>
                    )}
                    <p className="text-xs text-gray-500">
                        Hỗ trợ định dạng Markdown. Sử dụng các ký hiệu đặc biệt để định dạng văn bản.
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">
                            Chứng nhận <span className="text-red-500">*</span>
                        </label>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => setPreviewCertificate(!previewCertificate)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                {previewCertificate ? "Chỉnh sửa" : "Xem trước"}
                            </button>
                        </div>
                    </div>

                    {!previewCertificate ? (
                        <div className="relative">
                            <div className="absolute top-2 right-2 flex space-x-1 bg-white rounded-md border border-gray-200 shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => insertCertificateSyntax("bold", "Chữ đậm")}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title="Chữ đậm"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                    >
                                        <path d="M8 11h4.5a2.5 2.5 0 0 0 0-5H8v5Zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 0 0 1 3.256 7.613A4.5 4.5 0 0 1 18 15.5ZM8 13v5h5.5a2.5 2.5 0 0 0 0-5H8Z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertCertificateSyntax("italic", "Chữ nghiêng")}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title="Chữ nghiêng"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                    >
                                        <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15v2Z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertCertificateSyntax("heading", "Tiêu đề")}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title="Tiêu đề"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                    >
                                        <path d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16Zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21Z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertCertificateSyntax("list", "Mục danh sách")}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title="Danh sách"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                    >
                                        <path d="M8 4h13v2H8V4ZM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM8 11h13v2H8v-2Zm0 7h13v2H8v-2Z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertCertificateSyntax("link", "Văn bản liên kết")}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title="Liên kết"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                    >
                                        <path d="M18.364 15.536 16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414Zm-2.828 2.828-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414Zm-.708-10.607 1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07Z" />
                                    </svg>
                                </button>
                            </div>
                            <textarea
                                rows={4}
                                name="qualityCertificate"
                                value={productUpdate.qualityCertificate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-sm"
                                required
                                placeholder="Nhập thông tin chứng nhận chất lượng... (Hỗ trợ định dạng Markdown)"
                            />
                        </div>
                    ) : (
                        <div className="border border-gray-300 rounded-lg p-4 bg-white min-h-[160px] markdown-preview">
                            <Markdown content={productUpdate.qualityCertificate} />
                        </div>
                    )}
                    <p className="text-xs text-gray-500">
                        Hỗ trợ định dạng Markdown. Sử dụng các ký hiệu đặc biệt để định dạng văn bản.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chất liệu <span className="text-red-500">*</span>
                        </label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Xuất xứ <span className="text-red-500">*</span>
                        </label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số lượng <span className="text-red-500">*</span>
                        </label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giá (đ) <span className="text-red-500">*</span>
                        </label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giảm giá (%) <span className="text-red-500">*</span>
                        </label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bảo hành (Tháng)<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="guarantee"
                            value={productUpdate.guarantee}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            min="0"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Danh mục <span className="text-red-500">*</span>
                        </label>
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
                                <div
                                    className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${productUpdate.status ? "transform translate-x-6 bg-blue-700" : ""}`}
                                ></div>
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">{productUpdate.status ? "Đang bán" : "Ngừng bán"}</div>
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
                                <div
                                    className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${productUpdate.freeShip ? "transform translate-x-6 bg-blue-700" : ""}`}
                                ></div>
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">
                                {productUpdate.freeShip ? "Miễn ship" : "Không miễn ship"}
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
    )
}

