"use client"

import { useEffect, useState } from "react"

export default function ProductVariantSelector({ product, setSelectedVariant, initialVariant }) {
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    // Chuẩn hóa chuỗi
    const normalizeString = (str) => str.trim().toLowerCase();

    // Tạo mảng màu sắc và kích thước không trùng lặp
    const getUniqueColors = () => {
        const colorMap = new Map();
        product.productVariants.forEach((variant) => {
            const normalizedColor = normalizeString(variant.color);
            if (!colorMap.has(normalizedColor)) {
                colorMap.set(normalizedColor, variant.color);
            }
        });
        return Array.from(colorMap.values());
    };

    const getUniqueSizes = () => {
        const sizeMap = new Map();
        product.productVariants.forEach((variant) => {
            const normalizedSize = normalizeString(variant.size);
            if (!sizeMap.has(normalizedSize)) {
                sizeMap.set(normalizedSize, variant.size);
            }
        });
        return Array.from(sizeMap.values());
    };

    const allColors = getUniqueColors();
    const allSizes = getUniqueSizes();

    // Đồng bộ với initialVariant khi component mount
    useEffect(() => {
        if (initialVariant && !selectedColor && !selectedSize) {
            setSelectedColor(initialVariant.color);
            setSelectedSize(initialVariant.size);
            setSelectedVariant(initialVariant);
        }
    }, [initialVariant, selectedColor, selectedSize, setSelectedVariant]);

    // Cập nhật selectedVariant khi color/size thay đổi
    useEffect(() => {
        if (selectedColor && selectedSize) {
            const variant = product.productVariants.find(
                (v) =>
                    normalizeString(v.color) === normalizeString(selectedColor) &&
                    normalizeString(v.size) === normalizeString(selectedSize)
            );
            setSelectedVariant(variant || null);
        } else if (!selectedColor || !selectedSize) {
            setSelectedVariant(null);
        }
    }, [selectedColor, selectedSize, product.productVariants, setSelectedVariant]);

    const availableSizes = selectedColor
        ? [...new Set(
            product.productVariants
                .filter((v) => normalizeString(v.color) === normalizeString(selectedColor))
                .map((v) => v.size)
        )]
        : allSizes;

    const availableColors = selectedSize
        ? [...new Set(
            product.productVariants
                .filter((v) => normalizeString(v.size) === normalizeString(selectedSize))
                .map((v) => v.color)
        )]
        : allColors;

    const handleColorSelect = (color) => {
        if (selectedColor && normalizeString(selectedColor) === normalizeString(color)) {
            setSelectedColor(null);
        } else {
            setSelectedColor(color);
            if (
                selectedSize &&
                !product.productVariants.some(
                    (v) =>
                        normalizeString(v.color) === normalizeString(color) &&
                        normalizeString(v.size) === normalizeString(selectedSize)
                )
            ) {
                setSelectedSize(null);
            }
        }
    };

    const handleSizeSelect = (size) => {
        if (selectedSize && normalizeString(selectedSize) === normalizeString(size)) {
            setSelectedSize(null);
        } else {
            setSelectedSize(size);
            if (
                selectedColor &&
                !product.productVariants.some(
                    (v) =>
                        normalizeString(v.size) === normalizeString(size) &&
                        normalizeString(v.color) === normalizeString(selectedColor)
                )
            ) {
                setSelectedColor(null);
            }
        }
    };

    const isVariantAvailable = (color, size) => {
        return product.productVariants.some(
            (v) => normalizeString(v.color) === normalizeString(color) && normalizeString(v.size) === normalizeString(size)
        );
    };

    return (
        <div className="pt-3 rounded-lg mb-4">
            <div className="mb-4">
                <p className="font-semibold mb-2">Màu sắc:</p>
                <div className="flex flex-wrap gap-2">
                    {allColors.map((color) => {
                        const isAvailable = selectedSize
                            ? availableColors.some((c) => normalizeString(c) === normalizeString(color))
                            : true;
                        return (
                            <button
                                key={color}
                                className={`px-3 py-1 border rounded transition-all ${
                                    selectedColor && normalizeString(selectedColor) === normalizeString(color)
                                        ? "bg-blue-500 text-white"
                                        : isAvailable
                                            ? "bg-gray-200 hover:bg-gray-300"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                                }`}
                                onClick={() => isAvailable && handleColorSelect(color)}
                                disabled={!isAvailable}
                                title={
                                    selectedColor && normalizeString(selectedColor) === normalizeString(color)
                                        ? "Nhấp để bỏ chọn"
                                        : ""
                                }
                            >
                                {color}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <p className="font-semibold mb-2">Kích thước:</p>
                <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => {
                        const isAvailable = selectedColor
                            ? availableSizes.some((s) => normalizeString(s) === normalizeString(size))
                            : true;
                        return (
                            <button
                                key={size}
                                className={`px-3 py-1 border rounded transition-all ${
                                    selectedSize && normalizeString(selectedSize) === normalizeString(size)
                                        ? "bg-blue-500 text-white"
                                        : isAvailable
                                            ? "bg-gray-200 hover:bg-gray-300"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                                }`}
                                onClick={() => isAvailable && handleSizeSelect(size)}
                                disabled={!isAvailable}
                                title={
                                    selectedSize && normalizeString(selectedSize) === normalizeString(size)
                                        ? "Nhấp để bỏ chọn"
                                        : ""
                                }
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </div>

            {selectedColor && selectedSize && !isVariantAvailable(selectedColor, selectedSize) && (
                <div className="mt-3 text-red-500 text-sm">Biến thể sản phẩm này không có sẵn.</div>
            )}
        </div>
    );
}