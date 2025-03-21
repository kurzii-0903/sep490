"use client"

import { useContext, useEffect, useState } from "react"
import {
    Star,
    StarHalf,
    ThumbsUp,
    MessageCircle,
    Share2,
    ShoppingCart,
    Truck,
    Package,
    Shield,
    ArrowRight,
    Heart,
    ChevronRight,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import * as signalR from "@microsoft/signalr"
import noImage from "../../images/no-image-product.jpg"
import { CartContext } from "../../contexts/CartContext"
import { toSlug } from "../../utils/SlugUtils"
import "./style.css"
import axios from "axios"
import { Markdown } from "../../components/Markdown/markdown-editor"
import ProductVariantSelector from "./ProductVariantSelector";
const BASE_URL = process.env.REACT_APP_BASE_URL_API

function ProductDetail() {
    const { slug } = useParams()
    const { addToCart } = useContext(CartContext)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [imageIndex, setImageIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [hubConnection, setHubConnection] = useState(null)
    const [activeTab, setActiveTab] = useState("description")
    const navigate = useNavigate()
    const [relatedProducts, setRelatedProducts] = useState([])
    const [topSaleProducts, setTopSaleProducts] = useState([])

    const [review, setReview] = useState({
        totalStar: 0,
        star1: 0,
        star2: 0,
        star3: 0,
        star4: 0,
        star5: 0,
        productReviews: [
            {
                reviewId: 0,
                productId: 0,
                customerId: 0,
                rating: 0,
                comment: "",
                createdAt: "",
                updatedAt: null,
                customerName: "",
                customerImage: "",
            },
        ],
    })

    const renderStars = (rating) => {
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

    const LoadingSkeleton = () => (
        <div>
            <div className="animate-pulse">
                <div className="pd-grid">
                    <div className="pd-images">
                        <div className="pd-main-image bg-gray-200" style={{ minHeight: "560px" }}></div>
                        <div className="pd-thumbnails">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="pd-thumbnail bg-gray-200" style={{ minHeight: "128px" }}></div>
                            ))}
                        </div>
                    </div>

                    <div className="pd-info" style={{ minHeight: "600px" }}>
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>

                        <div className="h-10 bg-gray-200 rounded w-1/2 mb-6"></div>

                        <div className="space-y-6">
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-10 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-12 bg-gray-200 rounded w-1/3 my-6"></div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="h-12 bg-gray-200 rounded"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-6 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const [product, setProduct] = useState({
        id: 0,
        name: "",
        description: "",
        material: "",
        origin: "",
        categoryId: 1,
        categoryName: "",
        quantity: 0,
        price: 0,
        priceDiscount: 0,
        freeShip: false,
        totalSale: 0,
        guarantee: 0,
        image: null,
        discount: 0,
        createdAt: "2025-02-11T18:30:25.43",
        updatedAt: "2025-02-14T22:16:08.1",
        status: true,
        averageRating: 0,
        qualityCertificate: "",
        productImages: [
            {
                id: 0,
                fileName: "",
                image: "",
                description: null,
                isPrimary: true,
            },
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
                status: true,
            },
        ],
    })

    const fetchTopSaleProducts = async (sizeTopSale) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/Product/top-sale-product`, {
                params: {
                    size: sizeTopSale,
                },
            })
            console.log(response.data.length)
            setTopSaleProducts(response.data || [])
        } catch (error) {
            return []
        }
    }

    const getProductBySlug = async (slug) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/Product/get-product-by-slug/${slug}`)
            setProduct(response.data)
        } catch (error) {
            console.error("Lỗi khi lấy thông tin sản phẩm:", error.response?.data || error.message)
        }
    }

    const fetchRelatedProducts = async (id, size) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/Product/related`, {
                params: {
                    size: size,
                    id: id,
                },
            })
            setRelatedProducts(response.data)
        } catch (error) {
            return []
        }
    }

    const fetchReviewProduct = async (id, size) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/Product/reviews`, {
                params: {
                    size: size,
                    id: id,
                },
            })
            setReview(response.data)
        } catch (error) {
            return null
        }
    }

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${BASE_URL}/productHub`)
            .withAutomaticReconnect()
            .build()

        connection
            .start()
            .then(() => {
                console.log("Connected to SignalR")
                setHubConnection(connection)
            })
            .catch((err) => console.error("Lỗi khi kết nối SignalR:", err))

        return () => {
            if (connection.state === signalR.HubConnectionState.Connected) {
                connection.stop()
            }
        }
    }, [])

    useEffect(() => {
        if (!hubConnection || hubConnection.state !== signalR.HubConnectionState.Connected) return

        const handleProductChange = (updatedProduct) => {
            console.log(`Received update for product ID: ${updatedProduct}`)
            if (updatedProduct.slug === slug) {
                setProduct(updatedProduct)
            }
        }
        hubConnection.on("ProductUpdated", handleProductChange)
        return () => {
            if (hubConnection.state === signalR.HubConnectionState.Connected) {
                hubConnection.off("ProductUpdated", handleProductChange)
            }
        }
    }, [hubConnection, slug])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                await getProductBySlug(slug)
            } catch (error) {
                console.error("Error fetching product:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [slug])

    useEffect(() => {
        fetchRelatedProducts(Number.parseInt(product.id), 10)
        fetchReviewProduct(Number.parseInt(product.id), 10)
        fetchTopSaleProducts(10)
    }, [product])

    useEffect(() => {
        if (!isLoading) {
            const elements = document.querySelectorAll(".content-loaded")
            elements.forEach((el) => {
                el.classList.remove("content-loaded")
                void el.offsetWidth // Force reflow
                el.classList.add("content-loaded")
            })
        }
    }, [isLoading])

    const handleAddToCart = () => {
        if (selectedVariant) {
            addToCart({
                ...product,
                product:product,
                variant: selectedVariant,
                quantity,
            })
        } else {
            alert("Vui lòng chọn kích thước và màu sắc")
        }
    }

    return (
        <div className="pd-container">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
                <a href="/" className="hover:text-red-600">
                    Trang chủ
                </a>
                <ChevronRight className="w-4 h-4 mx-1" />
                <a href="/products" className="hover:text-red-600">
                    Sản phẩm
                </a>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="text-gray-700 font-medium">{product.name}</span>
            </div>

            {/* Main Product Card */}
            <div className="pd-card">
                {isLoading ? (
                    <LoadingSkeleton />
                ) : (
                    <div className="pd-grid content-loaded">
                        {/* Product Images */}
                        <div className="pd-images">
                            <div className="pd-main-image">
                                <img
                                    src={product.productImages.length > 0 ? product.productImages[imageIndex].image : noImage}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = noImage
                                    }}
                                />
                            </div>
                            <div className="pd-thumbnails">
                                {product.productImages.length > 0
                                    ? product.productImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`pd-thumbnail ${imageIndex === index ? "active" : ""}`}
                                            onClick={() => setImageIndex(index)}
                                        >
                                            <img
                                                src={img.image || "/placeholder.svg"}
                                                alt={`Ảnh ${index + 1}`}
                                                onError={(e) => {
                                                    e.target.onerror = null
                                                    e.target.src = noImage
                                                }}
                                            />
                                        </div>
                                    ))
                                    : null}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="pd-info">
                            <h1 className="pd-title">{product.name}</h1>
                            <div className="pd-rating">
                                <div className="flex">{renderStars(product.averageRating)}</div>
                                <span className="pd-review-count">({review.totalStar || 0} đánh giá)</span>
                                <span className="text-gray-500">|</span>
                                <span className="text-green-600 font-medium">Đã bán {product.totalSale}</span>
                            </div>

                            <div className="pd-price-section">
                                <span className="pd-price">{product.priceDiscount.toLocaleString("vi-vn")}₫</span>
                                <span className="pd-original-price">{product.price.toLocaleString("vi-vn")}₫</span>
                                {product.discount > 0 && <span className="pd-discount">-{product.discount}%</span>}
                            </div>

                            <ProductVariantSelector product={product} setSelectedVariant={setSelectedVariant} />

                            <div className="pd-quantity-cart">
                                <div className="pd-quantity">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="pd-quantity-btn">
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                                        className="pd-quantity-input"
                                    />
                                    <button onClick={() => setQuantity(quantity + 1)} className="pd-quantity-btn">
                                        +
                                    </button>
                                    <span className="pd-stock">
                    Còn {selectedVariant ? selectedVariant.quantity : product.quantity} sản phẩm
                  </span>
                                </div>

                                <div className="pd-cart-buttons">
                                    <button className="pd-cart-btn" onClick={handleAddToCart}>
                                        <ShoppingCart className="pd-icon" />
                                        <span>Thêm vào giỏ</span>
                                    </button>
                                    <button className="pd-buy-btn">
                                        <span>Mua ngay</span>
                                    </button>
                                </div>

                                <button className="flex items-center mt-4 text-gray-600 hover:text-red-500 transition-colors">
                                    <Heart className="w-5 h-5 mr-2" />
                                    Thêm vào yêu thích
                                </button>
                            </div>

                            <div className="pd-addinfo">
                                {product.freeShip && (
                                    <div>
                                        <Truck className="pd-icon-small" />
                                        <span>Miễn phí vận chuyển</span>
                                    </div>
                                )}
                                <div>
                                    <Package className="pd-icon-small" />
                                    <span>Đổi trả 30 ngày</span>
                                </div>
                                {product.guarantee > 0 && (
                                    <div>
                                        <Shield className="pd-icon-small" />
                                        <span>Bảo hành {product.guarantee} tháng</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="pd-main-content">
                {/* Left Column */}
                <div className="pd-left-column">
                    {/* Product Details Tabs */}
                    <div className="pd-description-card">
                        <div className="flex border-b mb-6">
                            <button
                                className={`px-6 py-3 font-medium ${activeTab === "description" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("description")}
                            >
                                Thông tin sản phẩm
                            </button>
                            <button
                                className={`px-6 py-3 font-medium ${activeTab === "reviews" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("reviews")}
                            >
                                Đánh giá ({review.totalStar || 0})
                            </button>
                            <button
                                className={`px-6 py-3 font-medium ${activeTab === "shipping" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("shipping")}
                            >
                                Vận chuyển
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ) : (
                            <div className="content-loaded">
                                {activeTab === "description" && (
                                    <div className="pd-description-content">
                                        <div className="pd-description-column">
                                            <h3 className="pd-subtitle">Mô tả sản phẩm</h3>
                                            <div className="pd-text-content">
                                                <Markdown content={product.description} />
                                            </div>

                                            <h3 className="pd-subtitle mt-6">Chất liệu</h3>
                                            <div className="pd-text-content">
                                                <p>{product.material}</p>
                                            </div>
                                        </div>

                                        <div className="pd-description-column">
                                            <h3 className="pd-subtitle">Xuất xứ</h3>
                                            <div className="pd-text-content">
                                                <p>Sản xuất tại: {product.origin}</p>
                                            </div>

                                            <h3 className="pd-subtitle mt-6">Chứng nhận chất lượng</h3>
                                            <div className="pd-text-content">
                                                <Markdown content={product.qualityCertificate} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "reviews" && (
                                    <div className="pd-review-content">
                                        <div className="pd-review-summary">
                                            <div className="pd-review-average">
                                                <div className="pd-review-number">{product.averageRating.toFixed(1)}</div>
                                                <div className="pd-review-stars">{renderStars(product.averageRating)}</div>
                                                <div className="pd-review-total">{review.totalStar || 0} đánh giá</div>
                                            </div>

                                            <div className="pd-review-bars">
                                                {[5, 4, 3, 2, 1].map((star) => (
                                                    <div key={star} className="pd-review-bar">
                                                        <span className="pd-review-bar-star">{star}★</span>
                                                        <div className="pd-bar-bg">
                                                            <div
                                                                className="pd-bar-fill"
                                                                style={{
                                                                    width: `${review.totalStar ? (review[`star${star}`] / review.totalStar) * 100 : 0}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="pd-review-percent">
                              {review.totalStar ? ((review[`star${star}`] / review.totalStar) * 100).toFixed(1) : 0}%
                            </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pd-review-list">
                                            {review.productReviews.length > 0 &&
                                                review.productReviews.map(
                                                    ({ reviewId, customerName, customerImage, rating, createdAt, comment }) => (
                                                        <div key={reviewId} className="pd-review-item">
                                                            <div className="pd-review-user">
                                                                <img
                                                                    src={customerImage || noImage}
                                                                    alt={customerName}
                                                                    className="pd-review-user-img"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null
                                                                        e.target.src = noImage
                                                                    }}
                                                                />
                                                                <div>
                                                                    <div className="pd-user-name">{customerName}</div>
                                                                    <div className="pd-review-user-rating">
                                                                        <div className="flex">{renderStars(rating)}</div>
                                                                        <span className="pd-review-date">{new Date(createdAt).toLocaleDateString()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="pd-review-comment">{comment}</p>
                                                            <div className="pd-review-actions">
                                                                <button className="pd-review-action-btn">
                                                                    <ThumbsUp className="w-4 h-4" />
                                                                    Hữu ích
                                                                </button>
                                                                <button className="pd-review-action-btn">
                                                                    <MessageCircle className="w-4 h-4" />
                                                                    Trả lời
                                                                </button>
                                                                <button className="pd-review-action-btn">
                                                                    <Share2 className="w-4 h-4" />
                                                                    Chia sẻ
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                        </div>

                                        <div className="mt-6 text-center">
                                            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors">
                                                Xem thêm đánh giá
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "shipping" && (
                                    <div className="space-y-4">
                                        <h3 className="pd-subtitle">Thông tin vận chuyển</h3>
                                        <p>Sản phẩm được giao hàng từ 2-5 ngày làm việc tùy khu vực.</p>
                                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                                            <div className="border rounded-lg p-4">
                                                <h4 className="font-medium mb-2">Miền Bắc</h4>
                                                <p className="text-sm text-gray-600">Thời gian giao hàng: 1-3 ngày</p>
                                                <p className="text-sm text-gray-600">Phí vận chuyển: 30.000₫</p>
                                            </div>
                                            <div className="border rounded-lg p-4">
                                                <h4 className="font-medium mb-2">Miền Trung</h4>
                                                <p className="text-sm text-gray-600">Thời gian giao hàng: 2-4 ngày</p>
                                                <p className="text-sm text-gray-600">Phí vận chuyển: 35.000₫</p>
                                            </div>
                                            <div className="border rounded-lg p-4">
                                                <h4 className="font-medium mb-2">Miền Nam</h4>
                                                <p className="text-sm text-gray-600">Thời gian giao hàng: 2-4 ngày</p>
                                                <p className="text-sm text-gray-600">Phí vận chuyển: 35.000₫</p>
                                            </div>
                                            <div className="border rounded-lg p-4">
                                                <h4 className="font-medium mb-2">Miễn phí vận chuyển</h4>
                                                <p className="text-sm text-gray-600">Áp dụng cho đơn hàng từ 500.000₫</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Related Products Grid */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center transition-colors">
                                Xem tất cả
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>

                        {isLoading ? (
                            <div
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                                style={{ minHeight: "300px" }}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                    <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                                        <div className="aspect-square bg-gray-200"></div>
                                        <div className="p-4 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 content-loaded">
                                {relatedProducts.length > 0 &&
                                    relatedProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => (window.location.href = `/product/${product.id}/${toSlug(product.name)}`)}
                                        >
                                            <div className="aspect-square overflow-hidden">
                                                <img
                                                    src={product.image ? product.image : noImage}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                    onError={(e) => {
                                                        e.target.onerror = null
                                                        e.target.src = noImage
                                                    }}
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
                                                <div className="flex items-center mt-1">{renderStars(product.averageRating)}</div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-red-600 font-medium">{product.priceDiscount.toLocaleString()}₫</span>
                                                    <span className="text-sm text-gray-500 line-through">{product.price.toLocaleString()}₫</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Only visible on larger screens */}
                <div className="pd-right-column hidden lg:block">
                    <div className="pd-related-products-card">
                        <h3 className="pd-related-products-title">Top sản phẩm bán chạy</h3>
                        <div className="pd-related-products-list">
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex space-x-4">
                                            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="content-loaded">
                                    {topSaleProducts.slice(0, 5).map((product) => (
                                        <div
                                            key={product.id}
                                            className="pd-related-product-item"
                                            onClick={() => (window.location.href = `/product/${product.id}/${toSlug(product.name)}`)}
                                        >
                                            <div className="pd-related-product-image">
                                                <img
                                                    src={product.image ? product.image : noImage}
                                                    alt={product.name}
                                                    className="pd-related-product-img"
                                                    onError={(e) => {
                                                        e.target.onerror = null
                                                        e.target.src = noImage
                                                    }}
                                                />
                                            </div>
                                            <div className="pd-related-product-info">
                                                <h4 className="pd-related-product-name">{product.name}</h4>
                                                <div className="pd-related-product-rating">{renderStars(product.averageRating)}</div>
                                                <div className="pd-related-product-prices">
                                                    <span className="pd-related-product-price">{product.priceDiscount.toLocaleString()}₫</span>
                                                    <span className="pd-related-product-original-price">{product.price.toLocaleString()}₫</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pd-card mt-6">
                        <h3 className="text-lg font-semibold mb-4">Chính sách mua hàng</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Giao hàng miễn phí</p>
                                    <p className="text-sm text-gray-600">Cho đơn hàng từ 500.000₫</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Đổi trả dễ dàng</p>
                                    <p className="text-sm text-gray-600">Trong vòng 30 ngày</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Bảo hành chính hãng</p>
                                    <p className="text-sm text-gray-600">Theo chính sách nhà sản xuất</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail


