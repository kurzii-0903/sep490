import React, { useState } from "react";
import { FaArrowRight, FaCheck, FaShoppingCart, FaStar } from "react-icons/fa";
import "./style.css";
import noimage from "../../images/no-image-product.jpg";
import { useNavigate, useOutletContext } from "react-router-dom";

const Products = ({ products = [], title = "" }) => {
	const [selectedFilter, setSelectedFilter] = useState(null);
	const navigate = useNavigate();
	const { addToCart } = useOutletContext();

	const filters = ["Giá tăng dần", "Giá giảm dần", "Rating"];

	const sortedProducts = [...products];
	if (selectedFilter === "Giá tăng dần") {
		sortedProducts.sort((a, b) => a.price - b.price);
	} else if (selectedFilter === "Giá giảm dần") {
		sortedProducts.sort((a, b) => b.price - a.price);
	} else if (selectedFilter === "Rating") {
		sortedProducts.sort((a, b) => b.averageRating - a.averageRating);
	}

	const handleDetailProduct = (id) => {
		navigate("/product/" + id);
	};

	return (
		<main className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-4" style={{ marginTop: "30px" }}>
				<h2 className="best-products">{title}</h2>
				<div className="flex space-x-4">
					{filters.map((filter, index) => (
						<button
							key={index}
							onClick={() => setSelectedFilter(filter)}
							className={`filter-button ${selectedFilter === filter ? "selected" : ""}`}
						>
							{filter}
							{selectedFilter === filter && <FaCheck className="ml-2 inline" />}
						</button>
					))}
				</div>
			</div>
			<div className="product-container-best-products">
				{sortedProducts.map((product, index) => (
					<div key={index} className="product-card">
						<img onClick={() => { handleDetailProduct(product.id) }}
							 className="product-image"
							 src={product.image || noimage}
							 alt={product.name}
						/>
						<div className="product-info">
							<div className="product-rating-price">
								<div className="product-rating">
									{Array.from({ length: product.averageRating }, (_, i) => (
										<FaStar key={i} />
									))}
								</div>
								<div className="product-price">{product.price}</div>
							</div>
							<div className="product-name">{product.name}</div>
							<div className="product-stock">{product.stock}</div>
							<div className="product-actions">
								<input type="number" className="quantity-input" min="1" defaultValue="1" />
								<button className="add-to-cart-button" onClick={() => addToCart(product)}>
									<FaShoppingCart className="icon" /> <span>Thêm vào giỏ</span>
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="flex justify-center mt-4">
				<div className="new-blog-read-more">
					<button className="new-blog-read-more-button">
						<div className="new-blog-read-more-text">Xem tất cả <FaArrowRight className="inline" /></div>
					</button>
				</div>
			</div>
		</main>
	);
};

export default Products;