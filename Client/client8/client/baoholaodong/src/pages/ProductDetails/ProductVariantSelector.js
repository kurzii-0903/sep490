import {useEffect, useState} from "react";

export default function  ProductVariantSelector ({ product, setSelectedVariant }) {
    const [selectedColor, setSelectedColor] = useState(null)
    const [selectedSize, setSelectedSize] = useState(null)

    const colors = [...new Set(product.productVariants.map((v) => v.color))]
    const sizes = [...new Set(product.productVariants.map((v) => v.size))]

    const handleSelect = (color, size) => {
        const variant = product.productVariants.find((v) => v.color === color && v.size === size)
        setSelectedVariant(variant || null)
    }

    useEffect(() => {
        if (selectedColor && selectedSize) {
            handleSelect(selectedColor, selectedSize)
        }
    }, [selectedColor, selectedSize])

    return (
        <div className="p-4 rounded-lg mb-4">
            <div className="mb-4">
                <p className="font-semibold mb-2">Màu sắc:</p>
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <button
                            key={color}
                            className={`px-3 py-1 border rounded ${selectedColor === color ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => setSelectedColor(color)}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <p className="font-semibold mb-2">Kích thước:</p>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            className={`px-3 py-1 border rounded ${selectedSize === size ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => setSelectedSize(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}