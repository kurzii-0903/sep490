import React, { useState } from "react";

export default function UpdateVariantForm({ variant, onUpdateVariant, setLoading, onSetProduct, onClose, showToast }) {
    const [variantUpdate, setVariantUpdate] = useState(variant);

    const handleVariantChange = (field, value) => {
        let newValue;
        if (field === "price") {
            newValue = parseFloat(value.replace(/\D/g, "")) || 0;
        } else if (field === "quantity" || field === "discount") {
            newValue = Number(value);
        } else {
            newValue = value;
        }
        setVariantUpdate(prev => ({
            ...prev,
            [field]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            var result = await onUpdateVariant(variantUpdate);
            if (result) {
                await onSetProduct(result);
                showToast("Cập nhật biến thể thành công!", "success");
                onClose();
            }
        } catch (error) {
            showToast("Không thể cập nhật biến thể. Vui lòng thử lại!", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="size">Kích thước</label>
                        <input
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            id="size"
                            type="text"
                            value={variantUpdate.size}
                            onChange={(e) => handleVariantChange("size", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="color">Màu sắc</label>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">Số lượng</label>
                        <input
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            id="quantity"
                            type="number"
                            min="0"
                            value={variantUpdate.quantity}
                            onChange={(e) => handleVariantChange("quantity", Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">Giá (đ)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">đ</span>
                            </div>
                            <input
                                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                id="price"
                                type="text"
                                min="1"
                                value={variantUpdate.price.toLocaleString()}
                                onChange={(e) => handleVariantChange("price", e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="discount">Giảm giá (%)</label>
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
                        <div className="ml-3 text-gray-700 font-medium">{variantUpdate.status ? 'Đang bán' : 'Ngừng bán'}</div>
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