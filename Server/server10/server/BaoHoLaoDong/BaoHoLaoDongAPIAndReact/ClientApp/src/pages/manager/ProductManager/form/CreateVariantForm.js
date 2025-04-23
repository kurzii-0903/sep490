import React, { useEffect, useState } from "react";

export default function CreateVariantForm({ setLoading, onSetProduct, onCreateVariant, product, onClose, showToast }) {
    const [newVariant, setNewVariant] = useState({
        productId: product.id,
        size: "",
        color: "",
        quantity: product.quantity || 0,
        price: product.price,
        discount: product.discount || 0,
        status: true,
    });

    const [isVariantValid, setIsVariantValid] = useState(false);

    const checkVariant = () => {
        if (newVariant.quantity < 0 || newVariant.price < 0 || newVariant.discount < 0) return false;
        if (!newVariant.size.trim() || !newVariant.color.trim()) return false;
        if (newVariant.price === 0) return false;
        return true;
    };

    const handleVariantChange = (field, value) => {
        setNewVariant(prev => ({
            ...prev,
            [field]: field === "price" || field === "quantity" || field === "discount" ? Math.max(0, Number(value)) : value,
        }));
    };

    useEffect(() => {
        setIsVariantValid(checkVariant());
    }, [newVariant]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isVariantValid) return;

        try {
            setLoading(true);
            const result = await onCreateVariant(newVariant);
            if (result) {
                await onSetProduct(result);
                showToast("Thêm biến thể thành công!", "success");
                onClose();
            }
        } catch (error) {
            console.error("Error creating variant:", error);
            showToast("Không thể tạo biến thể. Vui lòng thử lại!", "error");
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    return (
        <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="size">Kích thước <span className="text-red-500">*</span></label>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="color">Màu sắc <span className="text-red-500">*</span></label>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">Số lượng <span className="text-red-500">*</span></label>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">Giá ($) <span className="text-red-500">*</span></label>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="discount">Giảm giá (%)</label>
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
                        <div className="ml-3 text-gray-700 font-medium">{newVariant.status ? 'Đang bán' : 'Ngừng bán'}</div>
                    </label>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={!isVariantValid}
                        className={`px-4 py-2 rounded-lg ${isVariantValid ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"} transition-colors`}
                    >
                        Tạo biến thể
                    </button>
                </div>
            </form>
        </div>
    );
};