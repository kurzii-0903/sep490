import React, { useState, useEffect, useRef, useContext } from "react";
import { FaArrowLeft, FaArrowRight, FaCog, FaCartPlus } from "react-icons/fa";
import { CartContext } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import ProductPopup from "../../components/productpopup";
import noImage from "../../images/no-image-product.jpg";
import * as signalR from "@microsoft/signalr";
import './TopDealProductsStyle.css';

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

export default function TopDealProducts({ products = [], config }) {
    const scrollRef = useRef(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productList, setProductList] = useState(products);
    const [hubConnection, setHubConnection] = useState(null);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleViewAll = () => {
        navigate("/products/0/0/trang-thiet-bi-bao-ho?page=1");
    };

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`/productHub`)
            .withAutomaticReconnect()
            .build();

        connection
            .start()
            .then(() => {
                setHubConnection(connection);
            })
            .catch((err) => console.error("SignalR error:", err));

        return () => {
            if (connection.state === signalR.HubConnectionState.Connected) connection.stop();
        };
    }, []);

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

    const scroll = (dir) => {
        scrollRef.current?.scrollBy({ left: dir === "left" ? -350 : 350, behavior: "smooth" });
    };

    const handleAddToCart = (product) => {
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
    };

    return (
        <div className="top-deal-container">
            <div className="top-deal-content-wrapper">
                <div className="top-deal-flex-container">
                    <div className="top-deal-header-section">
                        <h2 className="top-deal-title">
                            <span className="top-deal-title-highlight">"BÃO</span> DEAL" GIẢM GIÁ
                        </h2>
                        <div className="top-deal-button-group">
                            <button onClick={() => scroll("left")} className="top-deal-scroll-button">
                                <FaArrowLeft />
                            </button>
                            <button onClick={() => scroll("right")} className="top-deal-scroll-button">
                                <FaArrowRight />
                            </button>
                        </div>
                        <button className="top-deal-view-all-button"
                                onClick={handleViewAll}>
                            <span>Xem tất cả <FaArrowRight className="inline ml-1" /></span>
                            <span></span>
                        </button>
                    </div>

                    <div ref={scrollRef} className="top-deal-product-scroll">
                        {productList.map((product) => {
                            const minVariant = getMinVariant(product);
                            const minPrice = getMinVariantPrice(product);
                            const hasDiscount = (product.discount && product.discount > 0) ||
                                (product.priceAfterDiscount && product.priceAfterDiscount < product.price);

                            return (
                                <div key={product.id} className="top-deal-product-card flex flex-col">
                                    <div className="top-deal-image-container">
                                        <img
                                            src={product.image || noImage}
                                            alt={product.name}
                                            className="top-deal-product-image"
                                            onClick={() => navigate(`/products/${product.slug}`)}
                                        />
                                        <div className="top-deal-image-overlay">
                                            <button
                                                onClick={() => navigate(`/products/${product.slug}`)}
                                                className="top-deal-detail-button"
                                            >
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-grow p-3 gap-2">
                                        <h3 className="top-deal-product-title line-clamp-2 min-h-[40px]">
                                            {product.name}
                                        </h3>
                                        <div className="top-deal-price-container mt-auto">
                                            {hasDiscount ? (
                                                <>
                                                    <span className="top-deal-price-discounted">
                                                        {minPrice.toLocaleString()}đ
                                                    </span>
                                                    <span className="top-deal-price-original">
                                                        {(minVariant ? minVariant.price : product.price).toLocaleString()}đ
                                                    </span>
                                                    <p className="top-deal-discount-text">
                                                        Giảm {product.discount || 0}%
                                                    </p>
                                                </>
                                            ) : (
                                                <span className="top-deal-price-normal">
                                                    {minPrice.toLocaleString()}đ
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            className="top-deal-add-to-cart-button flex items-center justify-center gap-1"
                                            onClick={() => (product.productVariants?.length > 0 ? setSelectedProduct(product) : handleAddToCart(product))}
                                        >
                                            {product.productVariants?.length > 0 ? (
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
                            );
                        })}
                    </div>
                </div>
            </div>
            {selectedProduct && <ProductPopup product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        </div>
    );
}