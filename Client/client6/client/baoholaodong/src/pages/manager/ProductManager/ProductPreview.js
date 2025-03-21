"use client"

import React from "react"
import { Star, StarHalf, ShoppingCart, Truck, Package, Shield, X } from "lucide-react"
import { Markdown } from "../../../components/Markdown/markdown-editor"
import noImage from "../../../images/no-image-product.jpg"

const ProductPreview = ({ product, images, onClose }) => {
    const [imageIndex, setImageIndex] = React.useState(0)

    // Calculate discounted price
    const discountedPrice = product.price - product.price * (product.discount / 100)

    // Render stars for rating (default to 5 stars for preview)
    const renderStars = (rating = 5) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
        }
        if (hasHalfStar) {
            stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
        }
        const remainingStars = 5 - stars.length
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
        }
        return stars
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Product Preview</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-[400px] flex items-center justify-center">
                                {images.length > 0 ? (
                                    <img
                                        src={URL.createObjectURL(images[imageIndex]) || "/placeholder.svg"}
                                        alt={product.name}
                                        className="object-contain max-h-full max-w-full"
                                    />
                                ) : (
                                    <img
                                        src={noImage || "/placeholder.svg"}
                                        alt="No image available"
                                        className="object-contain max-h-full max-w-full opacity-50"
                                    />
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {images.map((image, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setImageIndex(index)}
                                            className={`w-16 h-16 border rounded-md overflow-hidden cursor-pointer ${
                                                index === imageIndex ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-200"
                                            }`}
                                        >
                                            <img
                                                src={URL.createObjectURL(image) || "/placeholder.svg"}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <h1 className="text-2xl font-bold text-gray-900">{product.name || "Product Name"}</h1>

                            <div className="flex items-center space-x-2">
                                <div className="flex">{renderStars()}</div>
                                <span className="text-sm text-gray-500">(0 reviews)</span>
                            </div>

                            <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-red-600">
                  {new Intl.NumberFormat("vi-VN").format(discountedPrice)}₫
                </span>
                                {product.discount > 0 && (
                                    <>
                    <span className="text-lg text-gray-500 line-through">
                      {new Intl.NumberFormat("vi-VN").format(product.price)}₫
                    </span>
                                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-medium">
                      -{product.discount}%
                    </span>
                                    </>
                                )}
                            </div>

                            {/* Variants */}
                            {product.productVariants.length > 0 && (
                                <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    {/* Sizes */}
                                    {[...new Set(product.productVariants.map((v) => v.size))].length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">Size:</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {[...new Set(product.productVariants.map((v) => v.size))].map((size, i) => (
                                                    <div key={i} className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white">
                                                        {size}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Colors */}
                                    {[...new Set(product.productVariants.map((v) => v.color))].length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">Color:</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {[...new Set(product.productVariants.map((v) => v.color))].map((color, i) => (
                                                    <div key={i} className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white">
                                                        {color}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Add to cart button */}
                            <div className="flex space-x-3">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Add to Cart</span>
                                </button>
                                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors">
                                    Buy Now
                                </button>
                            </div>

                            {/* Product features */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                {product.freeShip && (
                                    <div className="flex items-center space-x-2">
                                        <Truck className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm">Free Shipping</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm">30-Day Returns</span>
                                </div>
                                {product.guarantee > 0 && (
                                    <div className="flex items-center space-x-2">
                                        <Shield className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm">{product.guarantee} Month Warranty</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product details tabs */}
                    <div className="mt-10">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                    Description
                                </button>
                                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                    Specifications
                                </button>
                                <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                                    Reviews
                                </button>
                            </nav>
                        </div>

                        <div className="py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Product Description</h3>
                                    <div className="prose prose-sm max-w-none">
                                        <Markdown content={product.description || "No description provided."} />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Material</h3>
                                        <p className="text-gray-700">{product.material || "Not specified"}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Origin</h3>
                                        <p className="text-gray-700">{product.origin || "Not specified"}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quality Certificate</h3>
                                        <div className="prose prose-sm max-w-none">
                                            <Markdown content={product.qualityCertificate || "No certificate information provided."} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Close preview button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductPreview

