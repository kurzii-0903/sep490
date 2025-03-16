import React, {useEffect, useState} from "react";
import {formatPrice, parseVND} from "../../../../utils/format";

export default function UpdateInformationProductForm  ({ product, categories, onUpdate, setProduct, setLoading, close ,setErrors}) {
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
                newValue = value ? parseVND(value) : 0;
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
                            min="0"
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
