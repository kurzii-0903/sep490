import { useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../contexts/AdminProductContext";
import Loading from "../components/Loading/Loading";
import * as signalR from "@microsoft/signalr";
import { CustomerProductContext } from "../contexts/CustomerProductContext";
import noimage from "../images/no-image-product.jpg"

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

const ProductDetail = () => {
    const { id } = useParams();
    const { getProductById } = useContext(CustomerProductContext);
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
    const [isLoading, setIsLoading] = useState(true);
    const [hubConnection, setHubConnection] = useState(null);

    const fetchProduct = async () => {
        setIsLoading(true);
        try {
            const data = await getProductById(id);
            setProduct(data);
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setIsLoading(false);
        }
    };

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
            await fetchProduct();
        };
        fetchData();
    }, [id]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Loading isLoading={isLoading} />
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="md:w-1/2 p-6">
                        <div className="relative aspect-square overflow-hidden rounded-xl">
                            <img
                                alt={product.name}
                                className="object-cover w-full h-full transform transition-transform duration-500 hover:scale-105"
                                src={product.image || noimage}
                            />
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="md:w-1/2 p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center mb-6">
                            <div className="flex text-yellow-400">
                                {[...Array(product.averageRating === 0 ? 5 : product.averageRating)].map((_, i) => (
                                    <i key={i} className="fas fa-star"></i>
                                ))}
                            </div>
                            <span className="ml-2 text-gray-600 text-sm">(45 đánh giá)</span>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <div className="flex items-center">
                                <span className="text-3xl font-bold text-red-600">
                                    {product.priceDiscount.toLocaleString()}₫
                                </span>
                                <span className="ml-3 text-lg text-gray-400 line-through">
                                    {product.price.toLocaleString()}₫
                                </span>
                                <span className="ml-3 px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
                                    -{product.discount}%
                                </span>
                            </div>
                        </div>

                        {/* Quantity Selector and Add to Cart */}
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors rounded-l-lg">
                                    -
                                </button>
                                <input
                                    type="text"
                                    className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                                    value="1"
                                />
                                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors rounded-r-lg">
                                    +
                                </button>
                            </div>
                            <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">
                                Thêm vào giỏ hàng
                            </button>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-3">Đặc điểm nổi bật</h2>
                            <div className="text-gray-600 space-y-2">
                                {product.description.split('\n').map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Options */}
                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-xl font-semibold mb-4">Chọn hình thức vận chuyển</h2>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="radio" name="shipping" className="w-4 h-4 text-blue-600" />
                                    <span className="text-gray-700">Giao hàng tiêu chuẩn</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="radio" name="shipping" className="w-4 h-4 text-blue-600" />
                                    <span className="text-gray-700">Giao hàng nhanh</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Specifications */}
            <div className="bg-white rounded-2xl shadow-xl mt-8 p-8">
                <h2 className="text-2xl font-bold mb-6">Thông số kỹ thuật</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Chi tiết sản phẩm</h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center">
                                <span className="font-medium w-24">Chất liệu:</span>
                                <span>{product.material}</span>
                            </li>
                            <li className="flex items-center">
                                <span className="font-medium w-24">Màu sắc:</span>
                                <span>{[...new Set(product.productVariants.map(v => v.color))].join(" - ")}</span>
                            </li>
                            <li className="flex items-center">
                                <span className="font-medium w-24">Kích thước:</span>
                                <span>{[...new Set(product.productVariants.map(v => v.size))].join(" , ")}</span>
                            </li>
                            <li className="flex items-center">
                                <span className="font-medium w-24">Xuất xứ:</span>
                                <span>{product.origin}</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Chứng nhận chất lượng</h3>
                        <div className="text-gray-600 space-y-2">
                            {product.qualityCertificate.split('\n').map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;