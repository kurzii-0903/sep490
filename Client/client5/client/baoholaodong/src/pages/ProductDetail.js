import React, {useContext, useEffect, useState} from 'react';
import { Star, StarHalf, ThumbsUp, MessageCircle, Share2, ShoppingCart, Truck, Package, Shield, ArrowRight } from 'lucide-react';
import {CustomerProductContext} from "../contexts/CustomerProductContext";
import {useNavigate, useParams} from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import {toSlug} from "../utils/SlugUtils";
import { CartContext } from "../contexts/CartContext"; // Import CartContext
import noImage from "../images/no-image-product.jpg";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

function ProductDetail() {
    const { slug, id } = useParams();
    const { addToCart } = useContext(CartContext); // Add addToCart function
    const { getProductById,fetchRelatedProducts,fetchReviewProduct } = useContext(CustomerProductContext);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [imageIndex, setImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hubConnection, setHubConnection] = useState(null);
    const navigate = useNavigate();
    const [relatedProducts,setRelatedProducts] = useState([]);
    const [review, setReview] = useState({
        totalStar:0,
        star1 :0,
        star2 :0,
        star3 :0,
        star4 :0,
        star5 :0,
        productReviews: [{
                reviewId: 0,
                productId: 0,
                customerId: 0,
                rating: 0,
                comment: "",
                createdAt: "",
                updatedAt: null,
                customerName: "",
                customerImage: "",
        }
        ]
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
        const remainingStars = 5 - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
        }
        return stars;
    };

    const LoadingSkeleton = () => (
        <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                <div className="space-y-4">
                    <div className="aspect-square rounded-lg bg-gray-200"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square rounded-md bg-gray-200"></div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        <div className="mt-4 flex items-center space-x-4">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-10 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-12 bg-gray-200 rounded"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-6 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const [product, setProduct] = useState({
        id: parseInt(id),
        name: "",
        description: "",
        material: "oke nha",
        origin: "han quoc",
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
                isPrimary: true
            }
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
                status: true
            }
        ]
    });

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${BASE_URL}/productHub`)
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                console.log("Connected to SignalR");
                setHubConnection(connection);
            })
            .catch(err => console.error("Lỗi khi kết nối SignalR:", err));

        return () => {
            if (connection.state === signalR.HubConnectionState.Connected) {
                connection.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (!hubConnection || hubConnection.state !== signalR.HubConnectionState.Connected) return;

        const handleProductChange = (updatedProduct) => {
            console.log(`Received update for product ID: ${updatedProduct}`);
            if (updatedProduct.id === parseInt(id)) {
                setProduct(updatedProduct)
            }
        };
        hubConnection.on("ProductUpdated", handleProductChange);
        return () => {
            if (hubConnection.state === signalR.HubConnectionState.Connected) {
                hubConnection.off("ProductUpdated", handleProductChange);
            }
        };
    }, [hubConnection, id]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const product = await getProductById(id);
                const relateProduct = await fetchRelatedProducts(parseInt(id),10);
                const review = await fetchReviewProduct(parseInt(id),10);
                setProduct(product);
                setRelatedProducts(relateProduct);
                setReview(review);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!isLoading && product?.name) {
            const correctSlug = toSlug(product.name);
            if (slug !== correctSlug) {
                navigate(`/product/${id}/${correctSlug}`, { replace: true });
            }
            document.title = `${product.name} | Chi tiết sản phẩm`;
        }
        return () => {
            document.title = "BaoHoLaoDongMinhXuan";
        };
    }, [isLoading, product, slug, id, navigate]);


    const handleAddToCart = () => {
        const selectedVariant = product.productVariants.find(variant => variant.size === selectedSize && variant.color === selectedColor);
        if (selectedVariant) {
            addToCart({
                ...product,
                selectedVariant,
                quantity
            });
        } else {
            alert("Please select a valid size and color.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                            <div className="space-y-4">
                                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={product.productImages.length > 0 ? product.productImages[imageIndex].image : noImage}
                                        alt="Product"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = noImage;
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {product.productImages.length > 0 ? product.productImages.map((img, index) => (
                                        <div key={index} className="aspect-square rounded-md overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 ring-blue-500">
                                            <img onClick={() => setImageIndex(index)}
                                                 src={img.image}
                                                 alt={`View ${index}`}
                                                 className="w-full h-full object-cover"
                                                 onError={(e) => {
                                                     e.target.onerror = null;
                                                     e.target.src = noImage;
                                                 }}
                                            />
                                        </div>
                                    )) : (
                                        <></>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                    <div className="mt-4 flex items-center space-x-4">
                                        <div className="flex items-center">
                                            {renderStars(4.5)}
                                            <span className="ml-2 text-sm text-gray-600">(128 đánh giá)</span>
                                        </div>
                                        <span className="text-sm text-gray-500">|</span>
                                        <span className="text-sm text-green-600">Đã bán {product.totalSale}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-3xl font-bold text-red-600">{product.priceDiscount.toLocaleString("vi-vn")}₫</span>
                                        <span className="text-lg text-gray-400 line-through">{product.price.toLocaleString("vi-vn")}₫</span>
                                        {product.discount > 0 ? (
                                            <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">-{product.discount}%</span>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {product.productVariants.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">Kích thước</h3>
                                            <div className="mt-2 grid grid-cols-4 gap-2">
                                                {[...new Set(product.productVariants.map(({ size }) => size))].map((size, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                                                            selectedSize === size
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {product.productVariants.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">Màu sắc</h3>
                                            <div className="mt-2 grid grid-cols-4 gap-2">
                                                {[...new Set(product.productVariants.map(({ color }) => color))].map((color, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                                                            selectedColor === color
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {color}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-16 text-center border-x border-gray-300 py-2"
                                            />
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-sm text-gray-500">Còn {product.quantity} sản phẩm</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            className="flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50"
                                            onClick={handleAddToCart} // Add onClick handler
                                        >
                                            <ShoppingCart className="w-5 h-5 mr-2" />
                                            Thêm vào giỏ
                                        </button>
                                        <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                                            Mua ngay
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                                    {product.freeShip && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Truck className="w-5 h-5" />
                                            <span>Miễn phí vận chuyển</span>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Package className="w-5 h-5" />
                                        <span>Đổi trả 30 ngày</span>
                                    </div>
                                    {product.guarantee > 0 && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Shield className="w-5 h-5" />
                                            <span>Bảo hành {product.guarantee} tháng</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-2xl font-bold mb-4">Thông tin sản phẩm</h2>
                            {isLoading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            ) : (
                                <div className="prose max-w-none">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Mô tả sản phẩm</h3>
                                                <div className="mt-2 text-gray-600">
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {product.description.split("\n").map((line, index) => (
                                                            <li key={index} className="mb-2">{line}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Chất liệu</h3>
                                                <div className="mt-2 text-gray-600">
                                                    {product.material}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Xuất xứ</h3>
                                                <div className="mt-2 text-gray-600">
                                                    <p>Sản xuất tại: {product.origin}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Chứng nhận chất lượng</h3>
                                                <div className="mt-2 text-gray-600">
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {product.qualityCertificate.split('\n').map((cert, index) => (
                                                            <li key={index}>{cert}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>
                                <button className="text-blue-600 hover:text-blue-700 font-medium">Viết đánh giá</button>
                            </div>

                            {isLoading ? (
                                <div className="animate-pulse space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center space-x-4 mb-8">
                                        <div className="text-center">
                                            <div className="text-5xl font-bold text-gray-900">{product.averageRating}</div>
                                            <div className="flex items-center justify-center mt-2">
                                                {renderStars(product.averageRating)}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">128 đánh giá</div>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            {[5, 4, 3, 2, 1].map((star) => (
                                                <div key={star} className="flex items-center">
                                                    <span className="text-sm text-gray-600 w-8">{star}★</span>
                                                    <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-yellow-400"
                                                            style={{ width: `${(review[`star${star}`] / review.totalStar) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-500 w-12">
                                                        {((review[`star${star}`] / review.totalStar) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        { review.productReviews.length >0 && review.productReviews.map(({reviewId,customerName,customerImage,rating,createdAt,comment}) => (
                                            <div key={reviewId} className="border-b pb-6">
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src={customerImage|| ""}
                                                        alt={review.user}
                                                        className="w-12 h-12 rounded-full"
                                                    />
                                                    <div>
                                                        <h4 className="font-medium">{customerName}</h4>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <div className="flex">
                                                                {renderStars(rating)}
                                                            </div>
                                                            <span className="text-sm text-gray-500">
                                                                {new Date(createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="mt-4 text-gray-600">{comment}</p>
                                                <div className="flex items-center space-x-6 mt-4">
                                                    <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                                                        <ThumbsUp className="w-4 h-4 mr-1" />
                                                        Hữu ích ({review.likes})
                                                    </button>
                                                    <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                                                        <MessageCircle className="w-4 h-4 mr-1" />
                                                        Trả lời ({review.replies})
                                                    </button>
                                                    <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                                                        <Share2 className="w-4 h-4 mr-1" />
                                                        Chia sẻ
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className="mt-6 text-center">
                                <button className="text-blue-600 hover:text-blue-700 font-medium">
                                    Xem thêm đánh giá
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Sản phẩm tương tự</h2>
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                                    Xem tất cả
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex space-x-4">
                                            <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    { relatedProducts.length >0 && relatedProducts.map((product) => (
                                        <div key={product.id} className="flex space-x-4" onClick={()=>window.location.href=(`/product/${product.id}/${toSlug(product.name)}`)}>
                                            <div className="w-24 h-24 flex-shrink-0">
                                                <img
                                                    src={product.image? product.image:noImage}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                                                <div className="flex items-center mt-1">
                                                    {renderStars(product.averageRating)}
                                                </div>
                                                <div className="mt-1 flex items-center space-x-2">
                                                    <span className="text-red-600 font-medium">
                                                        {product.priceDiscount.toLocaleString()}₫
                                                    </span>
                                                    <span className="text-sm text-gray-500 line-through">
                                                        {product.price.toLocaleString()}₫
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;