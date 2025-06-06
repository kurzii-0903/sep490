﻿"use client"

import { useEffect, useState } from "react"

export default function ProductVariantSelector({ product, setSelectedVariant }) {
    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)

    // Chuẩn hóa màu sắc và kích thước để tránh trùng lặp do khác biệt nhỏ
    const normalizeString = (str) => {
        return str.trim().toLowerCase()
    }

    // Tạo mảng màu sắc và kích thước không trùng lặp
    const getUniqueColors = () => {
        const colorMap = new Map()

        product.productVariants.forEach((variant) => {
            const normalizedColor = normalizeString(variant.color)
            if (!colorMap.has(normalizedColor)) {
                colorMap.set(normalizedColor, variant.color) // Lưu phiên bản gốc của màu
            }
        })

        return Array.from(colorMap.values())
    }

    const getUniqueSizes = () => {
        const sizeMap = new Map()

        product.productVariants.forEach((variant) => {
            const normalizedSize = normalizeString(variant.size)
            if (!sizeMap.has(normalizedSize)) {
                sizeMap.set(normalizedSize, variant.size) // Lưu phiên bản gốc của kích thước
            }
        })

        return Array.from(sizeMap.values())
    }

    // Lấy tất cả các màu và kích thước có sẵn (đã chuẩn hóa)
    const allColors = getUniqueColors()
    const allSizes = getUniqueSizes()

    // Lọc các kích thước có sẵn dựa trên màu đã chọn
    const availableSizes = selectedColor
        ? [
            ...new Set(
                product.productVariants
                    .filter((v) => normalizeString(v.color) === normalizeString(selectedColor))
                    .map((v) => v.size),
            ),
        ]
        : allSizes

    // Lọc các màu có sẵn dựa trên kích thước đã chọn
    const availableColors = selectedSize
        ? [
            ...new Set(
                product.productVariants
                    .filter((v) => normalizeString(v.size) === normalizeString(selectedSize))
                    .map((v) => v.color),
            ),
        ]
        : allColors

    const handleColorSelect = (color) => {
        setSelectedColor(color)

        // Nếu kích thước hiện tại không khả dụng với màu mới, reset kích thước
        if (
            selectedSize &&
            !product.productVariants.some(
                (v) =>
                    normalizeString(v.color) === normalizeString(color) &&
                    normalizeString(v.size) === normalizeString(selectedSize),
            )
        ) {
            setSelectedSize(null)
        }
    }

    const handleSizeSelect = (size) => {
        setSelectedSize(size)

        // Nếu màu hiện tại không khả dụng với kích thước mới, reset màu
        if (
            selectedColor &&
            !product.productVariants.some(
                (v) =>
                    normalizeString(v.size) === normalizeString(size) &&
                    normalizeString(v.color) === normalizeString(selectedColor),
            )
        ) {
            setSelectedColor(null)
        }
    }

    useEffect(() => {
        if (selectedColor && selectedSize) {
            const variant = product.productVariants.find(
                (v) =>
                    normalizeString(v.color) === normalizeString(selectedColor) &&
                    normalizeString(v.size) === normalizeString(selectedSize),
            )
            setSelectedVariant(variant || null)
            console.log(variant);
        } else {
            setSelectedVariant(null)
        }
    }, [selectedColor, selectedSize, product.productVariants, setSelectedVariant])

    // Kiểm tra xem biến thể có tồn tại không
    const isVariantAvailable = (color, size) => {
        return product.productVariants.some(
            (v) => normalizeString(v.color) === normalizeString(color) && normalizeString(v.size) === normalizeString(size),
        )
    }

    return (
        <div className="p-4 rounded-lg mb-4">
            <div className="mb-4">
                <p className="font-semibold mb-2">Màu sắc:</p>
                <div className="flex flex-wrap gap-2">
                    {allColors.map((color) => {
                        const isAvailable = selectedSize
                            ? availableColors.some((c) => normalizeString(c) === normalizeString(color))
                            : true

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
                            >
                                {color}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div>
                <p className="font-semibold mb-2">Kích thước:</p>
                <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => {
                        const isAvailable = selectedColor
                            ? availableSizes.some((s) => normalizeString(s) === normalizeString(size))
                            : true

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
                            >
                                {size}
                            </button>
                        )
                    })}
                </div>
            </div>

            {selectedColor && selectedSize && !isVariantAvailable(selectedColor, selectedSize) && (
                <div className="mt-3 text-red-500 text-sm">Biến thể sản phẩm này không có sẵn.</div>
            )}
        </div>
    )
}

