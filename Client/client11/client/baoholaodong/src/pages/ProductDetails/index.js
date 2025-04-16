"use client";

import { useContext, useEffect, useState } from "react";
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
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import noImage from "../../images/no-image-product.jpg";
import { CartContext } from "../../contexts/CartContext";
import axios from "axios";
import ProductVariantSelector from "./ProductVariantSelector";
import { DisplayContent } from "../../components/TextEditor";
import { formatVND } from "../../utils/format";
import PageWrapper from "../../components/pageWrapper/PageWrapper";

export default function ProductDetail({config}) {
    const BASE_URL = config.baseUrl;

    const { slug } = useParams();
    const { addToCart, showToast } = useContext(CartContext);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [imageIndex, setImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hubConnection, setHubConnection] = useState(null);
    const [activeTab, setActiveTab] = useState("description");
    const navigate = useNavigate();
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [topSaleProducts, setTopSaleProducts] = useState([]);
    const [review, setReview] = useState({
        totalStar: 0,
        star1: 0,
        star2: 0,
        star3: 0,
        star4: 0,
        star5: 0,
        productReviews: [],
    });
    const [BlogTransport, setBlogTransport] = useState(null);
    const [purchasePolicyContent, setPurchasePolicyContent] = useState(null);

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
        priceAfterDiscount: 0,
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
        productImages: [],
        productVariants: [],
    });

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
        }
        if (hasHalfStar) {
            stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
        }
        for (let i = 0; i < 5 - fullStars - (hasHalfStar ? 1 : 0); i++) {
            stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
        }
        return stars;
    };

    const handleDetailProduct = (product) => {
        navigate(`/products/${product.slug}`, { replace: true });
    };

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${BASE_URL}/productHub`)
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => setHubConnection(connection))
            .catch((err) => console.error("SignalR Error:", err));

        return () => connection.stop();
    }, []);

    useEffect(() => {
        if (!hubConnection) return;
        hubConnection.on("ProductUpdated", (updatedProduct) => {
            if (updatedProduct.slug === slug) setProduct(updatedProduct);
        });
        return () => hubConnection.off("ProductUpdated");
    }, [hubConnection, slug]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/api/Product/get-product-by-slug-for-page-detail/${slug}`);
                setProduct(response.data.product);
                setRelatedProducts(response.data.relatedProducts || []);
                setTopSaleProducts(response.data.topSaleProducts || []);
                setBlogTransport(response.data.blogTransport || null);
                setReview(response.data.review);
            } catch (error) {
                if (error.response?.status === 404) navigate("/404");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    useEffect(() => {
        const fetchPurchasePolicy = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/BlogPost/get-blog-by-category/chinh-sach`);
                const policyPost = response.data.find(post => post.title === "Chính sách mua hàng");
                setPurchasePolicyContent(policyPost ? policyPost.content : null);
            } catch (error) {
                console.error("Error fetching purchase policy:", error);
            }
        };
        fetchPurchasePolicy();
    }, []);

    const handleAddToCart = () => {
        const availableQuantity = selectedVariant ? selectedVariant.quantity : product.quantity;
        if (!selectedVariant && product.productVariants.length > 0) {
            showToast("Vui lòng chọn kích thước và màu sắc");
            return;
        }
        if (quantity > availableQuantity) {
            showToast("Số lượng vượt quá tồn kho!");
            return;
        }
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.productImages[0]?.image || noImage,
            quantity,
            selectedVariant,
            price: product.price,
            priceAfterDiscount: product.priceAfterDiscount || product.price,
            discount: product.discount || 0,
            quantityInStock: product.quantity,
        };
        addToCart(cartItem);
        showToast("Sản phẩm đã được thêm vào giỏ hàng");
    };

    const handleBuyNow = () => {
        const availableQuantity = selectedVariant ? selectedVariant.quantity : product.quantity;
        if (!selectedVariant && product.productVariants.length > 0) {
            showToast("Vui lòng chọn kích thước và màu sắc");
            return;
        }
        if (quantity > availableQuantity) {
            showToast("Số lượng vượt quá tồn kho!");
            return;
        }
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.productImages[0]?.image || noImage,
            quantity,
            selectedVariant,
            price: product.price,
            priceAfterDiscount: product.priceAfterDiscount || product.price,
            discount: product.discount || 0,
        };
        navigate("/confirm-order", {
            state: {
                customerId: null,
                customerName: "",
                customerPhone: "",
                customerEmail: "",
                customerAddress: "",
                paymentMethod: "Cash",
                orderDetails: [{
                    index: 0,
                    productId: product.id,
                    productName: product.name,
                    quantity,
                    price: selectedVariant?.price || product.priceAfterDiscount || product.price,
                    image: product.productImages[0]?.image || noImage,
                    variant: selectedVariant || {},
                }],
            },
        });
    };

    return (
        <PageWrapper title={product.name || "Chi tiết sản phẩm"}>
            <div className="min-h-screen bg-gray-50 py-5 w-[90%] mx-auto flex flex-col gap-5">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <a href="/" className="hover:text-red-600">Trang chủ</a>
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <a href="/products/0/0/all" className="hover:text-red-600">Sản phẩm</a>
                    <ChevronRight className="w-4 h-4 mx-1" />
                    <span className="text-gray-700 font-medium">{product.name}</span>
                </div>

                <div className="bg-white rounded-lg shadow-md p-5 mb-5">
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-5 animate-fade-in">
                            <div className="w-full lg:w-1/2 min-w-[300px]">
                                <div className="w-full h-[560px] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                                    <img
                                        src={product.productImages[imageIndex]?.image || noImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target.src = noImage)}
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto">
                                    {product.productImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`w-32 h-32 flex-shrink-0 rounded-md overflow-hidden cursor-pointer ${imageIndex === index ? "border-2 border-blue-600" : "border border-gray-200"}`}
                                            onClick={() => setImageIndex(index)}
                                        >
                                            <img
                                                src={img.image || noImage}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.target.src = noImage)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full lg:w-1/2">
                                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex">{renderStars(product.averageRating)}</div>
                                    <span className="text-sm text-gray-600">({review.totalStar} đánh giá)</span>
                                    <span className="text-gray-500">|</span>
                                    <span className="text-green-600 font-medium">Đã bán {product.totalSale}</span>
                                </div>

                                <div className="">
                                    {(() => {
                                        const { basePrice, discount, finalPrice } = selectedVariant
                                            ? { basePrice: selectedVariant.price, discount: selectedVariant.discount || 0, finalPrice: selectedVariant.price * (1 - (selectedVariant.discount || 0) / 100) }
                                            : product.productVariants.length > 0
                                                ? product.productVariants.reduce((min, v) => {
                                                    const final = v.price * (1 - (v.discount || 0) / 100);
                                                    return final < min.finalPrice ? { basePrice: v.price, discount: v.discount || 0, finalPrice: final } : min;
                                                }, { basePrice: Infinity, discount: 0, finalPrice: Infinity })
                                                : { basePrice: product.price, discount: product.discount || 0, finalPrice: product.priceAfterDiscount || product.price };
                                        return (
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-red-600">{formatVND(finalPrice)}</span>
                                                <span className="text-lg text-gray-500 line-through">{formatVND(basePrice)}</span>
                                                {discount > 0 && <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full">-{discount}%</span>}
                                            </div>
                                        );
                                    })()}
                                </div>

                                <ProductVariantSelector product={product} setSelectedVariant={setSelectedVariant} />

                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            className="w-12 text-center border border-gray-300 rounded p-1"
                                            readOnly
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(selectedVariant?.quantity || product.quantity, quantity + 1))}
                                            className="w-8 h-8 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
                                            disabled={quantity >= (selectedVariant?.quantity || product.quantity)}
                                        >
                                            +
                                        </button>
                                        <span className="text-sm text-gray-600">
                                            Còn {selectedVariant?.quantity || product.quantity} sản phẩm
                                        </span>
                                    </div>

                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={handleAddToCart}
                                            className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-yellow-400 hover:text-red-600 transition-colors"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            Thêm vào giỏ
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-yellow-400 rounded hover:bg-yellow-400 hover:text-red-600 transition-colors"
                                        >
                                            Mua ngay
                                        </button>
                                    </div>

                                    <button className="flex items-center mt-4 text-gray-600 hover:text-red-500 transition-colors">
                                        <Heart className="w-5 h-5 mr-2" />
                                        Thêm vào yêu thích
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    {product.freeShip && (
                                        <div className="flex items-center gap-1">
                                            <Truck className="w-4 h-4" />
                                            Miễn phí vận chuyển
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Package className="w-4 h-4" />
                                        Đổi trả 30 ngày
                                    </div>
                                    {product.guarantee > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-4 h-4" />
                                            Bảo hành {product.guarantee} tháng
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-5">
                    <div className="flex-1 lg:flex-[3] space-y-5">
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <div className="flex border-b mb-6">
                                {["description", "reviews", "shipping"].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`px-6 py-3 font-medium ${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab === "description" ? "Thông tin sản phẩm" : tab === "reviews" ? `Đánh giá (${review.totalStar})` : "Vận chuyển"}
                                    </button>
                                ))}
                            </div>

                            {isLoading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            ) : (
                                <div className="animate-fade-in">
                                    {activeTab === "description" && (
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <h3 className="text-lg font-bold mb-2">Mô tả sản phẩm</h3>
                                                <DisplayContent content={product.description} />
                                                <h3 className="text-lg font-bold mt-6 mb-2">Chất liệu</h3>
                                                <p>{product.material}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold mb-2">Xuất xứ</h3>
                                                <p>Sản xuất tại: {product.origin}</p>
                                                <h3 className="text-lg font-bold mt-6 mb-2">Chứng nhận chất lượng</h3>
                                                <DisplayContent content={product.qualityCertificate} />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "reviews" && (
                                        <div>
                                            <div className="flex flex-col md:flex-row gap-6 mb-6">
                                                <div className="text-center">
                                                    <div className="text-4xl font-bold text-gray-800">{product.averageRating.toFixed(1)}</div>
                                                    <div className="flex justify-center gap-1">{renderStars(product.averageRating)}</div>
                                                    <div className="text-sm text-gray-600">{review.totalStar} đánh giá</div>
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    {[5, 4, 3, 2, 1].map((star) => (
                                                        <div key={star} className="flex items-center gap-2">
                                                            <span className="w-8 text-sm text-gray-600">{star}★</span>
                                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-yellow-400"
                                                                    style={{ width: `${review.totalStar ? (review[`star${star}`] / review.totalStar) * 100 : 0}%` }}
                                                                />
                                                            </div>
                                                            <span className="w-10 text-right text-sm text-gray-600">
                                                                {review.totalStar ? ((review[`star${star}`] / review.totalStar) * 100).toFixed(1) : 0}%
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-5">
                                                {review.productReviews.map(({ reviewId, customerName, customerImage, rating, createdAt, comment }) => (
                                                    <div key={reviewId} className="border-b pb-4">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <img
                                                                src={customerImage || noImage}
                                                                alt={customerName}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                                onError={(e) => (e.target.src = noImage)}
                                                            />
                                                            <div>
                                                                <div className="font-bold">{customerName}</div>
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <div className="flex">{renderStars(rating)}</div>
                                                                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-700">{comment}</p>
                                                        <div className="flex gap-4 mt-2">
                                                            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                                                                <ThumbsUp className="w-4 h-4" /> Hữu ích
                                                            </button>
                                                            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                                                                <MessageCircle className="w-4 h-4" /> Trả lời
                                                            </button>
                                                            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                                                                <Share2 className="w-4 h-4" /> Chia sẻ
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-6 text-center">
                                                <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                                    Xem thêm đánh giá
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "shipping" && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold">{BlogTransport?.title}</h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <DisplayContent content={BlogTransport?.content} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
                                <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                                    Xem tất cả <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                            {isLoading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {Array(10).fill().map((_, i) => (
                                        <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                                            <div className="aspect-square bg-gray-200" />
                                            <div className="p-4 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
                                    {relatedProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                                            onClick={() => handleDetailProduct(product)}
                                        >
                                            <div className="aspect-square overflow-hidden">
                                                <img
                                                    src={product.image || noImage}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                    onError={(e) => (e.target.src = noImage)}
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
                                                <div className="flex items-center mt-1">{renderStars(product.averageRating)}</div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-red-600 font-medium">{formatVND(product.priceAfterDiscount)}</span>
                                                    <span className="text-sm text-gray-500 line-through">{formatVND(product.price)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col gap-5 flex-1">
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <h3 className="text-xl font-bold mb-4">Top sản phẩm bán chạy</h3>
                            {isLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    {Array(5).fill().map((_, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fade-in">
                                    {topSaleProducts.slice(0, 5).map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex gap-3 cursor-pointer hover:-translate-y-1 transition-transform"
                                            onClick={() => handleDetailProduct(product)}
                                        >
                                            <img
                                                src={product.image || noImage}
                                                alt={product.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                                onError={(e) => (e.target.src = noImage)}
                                            />
                                            <div>
                                                <h4 className="font-medium">{product.name}</h4>
                                                <div className="flex items-center mt-1">{renderStars(product.averageRating)}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-red-600 font-medium">{formatVND(product.priceAfterDiscount)}</span>
                                                    <span className="text-sm text-gray-500 line-through">{formatVND(product.price)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                            <h3 className="text-xl font-bold mb-4 border-b-2 border-blue-200 pb-2">Chính sách mua hàng</h3>
                            {purchasePolicyContent ? (
                                <div className="space-y-4 text-gray-700">
                                    <DisplayContent content={purchasePolicyContent} />
                                    <style jsx>{`
                                        .space-y-4 p {
                                            font-style: italic;
                                            line-height: 1.6;
                                        }
                                        .space-y-4 ul {
                                            list-style-type: none;
                                            padding-left: 0;
                                        }
                                        .space-y-4 ul li {
                                            position: relative;
                                            padding-left: 1.5rem;
                                            margin-bottom: 0.75rem;
                                            font-weight: 500;
                                            transition: background-color 0.2s ease;
                                        }
                                        .space-y-4 ul li:hover {
                                            background-color: #f1f5f9;
                                            border-radius: 0.375rem;
                                        }
                                        .space-y-4 ul li:before {
                                            content: "✔";
                                            position: absolute;
                                            left: 0;
                                            color: #3b82f6;
                                            font-size: 1rem;
                                        }
                                    `}</style>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-4">
                                    <svg className="animate-spin h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                    </svg>
                                    <p className="text-sm text-gray-500">Đang tải chính sách...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );

    function LoadingSkeleton() {
        return (
            <div className="animate-pulse">
                <div className="flex flex-col lg:flex-row gap-5">
                    <div className="w-full lg:w-1/2">
                        <div className="w-full h-[560px] bg-gray-200 rounded-lg" />
                        <div className="flex gap-2 mt-3">
                            {Array(4).fill().map((_, i) => (
                                <div key={i} className="w-32 h-32 bg-gray-200 rounded-md" />
                            ))}
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-32" />
                        <div className="h-10 bg-gray-200 rounded w-1/2" />
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24" />
                            <div className="grid grid-cols-4 gap-2">
                                {Array(4).fill().map((_, i) => (
                                    <div key={i} className="h-10 bg-gray-200 rounded" />
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-12 bg-gray-200 rounded w-1/3" />
                            <div className="h-12 bg-gray-200 rounded w-1/3" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}