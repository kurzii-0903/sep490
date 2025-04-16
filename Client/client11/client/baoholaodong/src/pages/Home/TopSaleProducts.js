import React, { useState, useContext, useEffect } from "react";
import { FaArrowRight, FaCheck, FaStar, FaCog, FaCartPlus } from "react-icons/fa";
import noImage from "../../images/no-image-product.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductPopup from "../../components/productpopup";
import { CartContext } from "../../contexts/CartContext";
import * as signalR from "@microsoft/signalr";
import { getConfig } from '../../config';

const getMinVariant = (product) => {
    if (!product.productVariants || product.productVariants.length === 0) return null;
    return product.productVariants.reduce((min, variant) => {
        const discount = product.discount || 0;
        const finalPrice = variant.price - (variant.price * discount) / 100;
        const minPrice = min.price - (min.price * discount) / 100;
        return finalPrice < minPrice ? variant : min;
    }, product.productVariants[0]);
};

const getMinVariantPrice = (product) => {
    const variant = getMinVariant(product);
    if (!variant) {
        const discount = product.discount || 0;
        return product.priceAfterDiscount && product.priceAfterDiscount < product.price
            ? product.priceAfterDiscount
            : product.price - (product.price * discount) / 100;
    }
    const discount = product.discount || 0;
    return variant.price - (variant.price * discount) / 100;
};

const TopSaleProducts = ({ products = [], title = "", config }) => {
    const BASE_URL = config.baseUrl;
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productList, setProductList] = useState(products);
    const [hubConnection, setHubConnection] = useState(null);
    const productsPerPage = 20;
    const filters = ["Giá tăng dần", "Giá giảm dần", "Rating"];
    const totalPages = Math.ceil(productList.length / productsPerPage);
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const handleViewAll = () => {
        navigate("/products/0/0/trang-thiet-bi-bao-ho?page=1");
    };

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${BASE_URL}/productHub`)
            .withAutomaticReconnect()
            .build();

        connection
            .start()
            .then(() => setHubConnection(connection))
            .catch(console.error);

        return () => {
            if (connection.state === signalR.HubConnectionState.Connected) connection.stop();
        };
    }, [BASE_URL]);

    useEffect(() => {
        if (!hubConnection || hubConnection.state !== signalR.HubConnectionState.Connected) return;

        const handleProductChange = (updatedProduct) => {
            setProductList((prev) =>
                prev.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
            );
        };

        hubConnection.on("ProductUpdated", handleProductChange);
        return () => hubConnection.off("ProductUpdated", handleProductChange);
    }, [hubConnection]);

    useEffect(() => {
        setProductList(products);
    }, [products]);

    const sortedProducts = [...productList];
    if (selectedFilter === "Giá tăng dần") {
        sortedProducts.sort((a, b) => getMinVariantPrice(a) - getMinVariantPrice(b));
    } else if (selectedFilter === "Giá giảm dần") {
        sortedProducts.sort((a, b) => getMinVariantPrice(b) - getMinVariantPrice(a));
    } else if (selectedFilter === "Rating") {
        sortedProducts.sort((a, b) => b.averageRating - a.averageRating);
    }

    const currentProducts = sortedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const handleDetailProduct = (product) => {
        navigate(`/products/${product.slug}`);
    };

    const handleProductClick = (product) => {
        if (product.productVariants.length > 0) {
            setSelectedProduct(product);
        } else {
            const cartItem = {
                id: product.id,
                name: product.name,
                image: product.image || noImage,
                quantity: 1,
                selectedVariant: null,
                price: product.price,
                priceAfterDiscount: product.priceAfterDiscount || product.price,
                discount: product.discount || 0,
                quantityInStock: product.quantity,
            };
            addToCart(cartItem);
        }
    };

    const handleClosePopup = () => {
        setSelectedProduct(null);
    };

    return (
        <main className="w-full max-w-screen-2xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#b50a00] text-left relative inline-block after:block after:w-1/3 after:h-1 after:bg-yellow-400 after:mt-1 after:[clip-path:polygon(0%_0%,100%_0%,calc(100%-4px)_100%,0%_100%)]">
                    {title}
                </h2>

                <div className="flex flex-wrap gap-2">
                    {filters.map((filter, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedFilter(filter)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 
              ${selectedFilter === filter ? 'bg-red-700 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            {filter} {selectedFilter === filter && <FaCheck className="inline ml-1" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="-mx-4 px-4 py-5 flex overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:overflow-visible gap-4">
                {currentProducts.map((product, idx) => {
                    const minVariant = getMinVariant(product);
                    const minPrice = getMinVariantPrice(product);
                    const hasDiscount = (product.discount && product.discount > 0) ||
                        (product.priceAfterDiscount && product.priceAfterDiscount < product.price);

                    return (
                        <motion.div
                            key={product.id}
                            className="w-[250px] flex-shrink-0 sm:w-full group bg-white rounded-lg shadow-[0_0_10px_black] overflow-hidden cursor-pointer transition-transform duration-300 flex flex-col"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -8, transition: { duration: 0.05, ease: "easeOut" } }}
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={product.image || noImage}
                                    alt={product.name}
                                    onClick={() => handleDetailProduct(product)}
                                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => handleDetailProduct(product)}
                                        className="bg-white text-gray-800 text-sm px-4 py-1 rounded-full font-medium"
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>

                            <div className="p-3 flex flex-col gap-2 flex-grow">
                                <div className="flex text-yellow-400 text-sm justify-start">
                                    {Array.from({ length: product.averageRating }, (_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>

                                <h3 className="text-sm font-semibold line-clamp-2 text-left min-h-[40px]">
                                    {product.name}
                                </h3>

                                <div className="mt-auto flex flex-col gap-2">
                                    <div className="text-sm text-left min-h-[48px]">
                                        {hasDiscount ? (
                                            <>
                                                <span className="text-red-600 font-bold">
                                                    {minPrice.toLocaleString()}đ
                                                </span>
                                                <span className="text-gray-400 line-through ml-2 text-sm">
                                                    {(minVariant ? minVariant.price : product.price).toLocaleString()}đ
                                                </span>
                                                <p className="text-yellow-600 text-xs font-semibold mt-1">
                                                    Giảm {product.discount || 0}%
                                                </p>
                                            </>
                                        ) : (
                                            <span className="text-red-600 font-bold">
                                                {minPrice.toLocaleString()}đ
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        className="text-sm bg-red-700 text-white w-full py-2 rounded hover:bg-red-800 transition flex items-center justify-center gap-1"
                                        onClick={() => handleProductClick(product)}
                                    >
                                        {product.productVariants.length > 0 ? (
                                            <>
                                                <FaCog /> Tùy chọn
                                            </>
                                        ) : (
                                            <>
                                                <FaCartPlus /> Thêm vào giỏ hàng
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex justify-center mt-8">
                <button className="px-6 py-2 bg-red-700 text-white rounded-full font-bold uppercase tracking-wide hover:bg-yellow-400 hover:text-red-700 transition"
                        onClick={handleViewAll}>
                    Xem tất cả <FaArrowRight className="inline ml-1" />
                </button>
            </div>

            {selectedProduct && <ProductPopup product={selectedProduct} onClose={handleClosePopup} />}
        </main>
    );
};

export default TopSaleProducts;