import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFilter, FaCartPlus, FaRegFrown, FaCog, FaAngleDown, FaSearch } from 'react-icons/fa';
import { CustomerProductContext } from '../../contexts/CustomerProductContext';
import { CartContext } from '../../contexts/CartContext';
import { toSlug } from "../../utils/SlugUtils";
import ProductPopup from '../../components/productpopup';
import './ProductListCategory.css';

const useQuery = () => new URLSearchParams(useLocation().search);

const ProductList = () => {
    const { group, cate } = useParams(); // Define group and cate
    const query = useQuery();
    const search = query.get("search")?.trim() || "";
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [products, setProducts] = useState([]);
    const { groupCategories, searchProduct, getProductPage } = useContext(CustomerProductContext);
    const { addToCart } = useContext(CartContext);
    const [hoveredGroup, setHoveredGroup] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedGroups, setExpandedGroups] = useState({});
    const navigate = useNavigate();

    const priceFilters = [
        "Dưới 1 triệu",
        "1 triệu - 3 triệu",
        "3 triệu - 5 triệu",
        "Trên 5 triệu",
    ];

    const handleFilterChange = (filter) => {
        setSelectedFilters((prev) =>
            prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]
        );
    };

    const handleOpenPopup = (product) => {
        setSelectedProduct(product);
    };

    const handleClosePopup = () => {
        setSelectedProduct(null);
    };

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    const handleNavigateToDetail = (product) => {
        navigate(`/products/${product.slug}`);
    };

    const toggleGroupExpand = (groupId) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupId]: !prev[groupId],
        }));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await searchProduct(search);
                setProducts(products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [search]);

    return (
        <div className="product-list-category-container">
            {/* Banner */}
            <div className="product-list-category-banner-container">
                <img
                    src="https://img.freepik.com/premium-photo/personal-protective-equipment-safety-banner-with-place-text_106035-3441.jpg"
                    alt="Banner"
                    className="product-list-category-banner-image"
                />
                <div className="product-list-category-banner-overlay">
                    <h1 className="product-list-category-banner-title">{search || "Sản phẩm"}</h1>
                </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="product-list-category-mobile-filter-toggle">
                <button
                    onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    className="product-list-category-mobile-filter-button"
                >
                    <span className="product-list-category-filter-button-text">
                        <FaFilter className="product-list-category-filter-icon" />
                        Bộ lọc sản phẩm
                    </span>
                    <FaAngleDown className={`product-list-category-filter-arrow ${mobileFiltersOpen ? "rotate-180" : ""}`} />
                </button>
            </div>

            <div className="product-list-category-main-content">
                <div className="product-list-category-content-wrapper">
                    {/* Filter Section */}
                    <div className={`product-list-category-filter-section ${mobileFiltersOpen ? "block" : "hidden"} lg:block`}>
                        <div className="product-list-category-filter-container">
                            <div className="product-list-category-filter-header">
                                <FaFilter className="product-list-category-filter-icon" />
                                <span className="product-list-category-filter-title">BỘ LỌC SẢN PHẨM</span>
                            </div>

                            {/* Search */}
                            <div className="product-list-category-search-section">
                                <div className="product-list-category-search-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="product-list-category-search-input"
                                    />
                                    <FaSearch className="product-list-category-search-icon" />
                                </div>
                            </div>

                            {/* Price Filters */}
                            <div className="product-list-category-price-filter-section">
                                <h3 className="product-list-category-section-title">Chọn Mức Giá</h3>
                                <div className="product-list-category-filter-options">
                                    {priceFilters.map((filter, index) => (
                                        <label key={index} className="product-list-category-filter-label">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters.includes(filter)}
                                                onChange={() => handleFilterChange(filter)}
                                                className="product-list-category-filter-checkbox"
                                            />
                                            <span className="product-list-category-filter-text">{filter}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="product-list-category-category-section">
                                <h3 className="product-list-category-section-title">Loại Sản Phẩm</h3>
                                <div className="product-list-category-category-options">
                                    {groupCategories.map((groupItem) => (
                                        <div key={groupItem.groupId} className="product-list-category-category-group">
                                            <div
                                                className={`product-list-category-category-group-header ${
                                                    Number.parseInt(group) === groupItem.groupId ? "active" : ""
                                                }`}
                                                onClick={() => toggleGroupExpand(groupItem.groupId)}
                                            >
                                                <span
                                                    className="product-list-category-group-name"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/products/${groupItem.groupId}/0/${toSlug(groupItem.groupName)}`);
                                                    }}
                                                >
                                                    {groupItem.groupName}
                                                </span>
                                                <FaAngleDown
                                                    className={`product-list-category-group-arrow ${
                                                        expandedGroups[groupItem.groupId] ? "rotate-180" : ""
                                                    }`}
                                                />
                                            </div>

                                            {expandedGroups[groupItem.groupId] && (
                                                <div className="product-list-category-subcategory-list">
                                                    {groupItem.categories.map((category) => (
                                                        <div
                                                            key={category.categoryId}
                                                            className={`product-list-category-subcategory-item ${
                                                                Number.parseInt(group) === groupItem.groupId &&
                                                                Number.parseInt(cate) === category.categoryId
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                navigate(
                                                                    `/products/${groupItem.groupId}/${category.categoryId}/${toSlug(groupItem.groupName)}`,
                                                                )
                                                            }
                                                        >
                                                            {category.categoryName}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Section */}
                    <div className="product-list-category-product-section">
                        {products.length === 0 ? (
                            <div className="product-list-category-empty-product-container">
                                <FaRegFrown className="product-list-category-empty-icon" />
                                <h3 className="product-list-category-empty-title">Không tìm thấy sản phẩm</h3>
                                <p className="product-list-category-empty-message">
                                    Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn.
                                </p>
                            </div>
                        ) : (
                            <>
                                <motion.div
                                    className="product-list-category-product-grid"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                                        exit: { opacity: 0 },
                                    }}
                                >
                                    {products.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            className="product-list-category-product-card"
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0 },
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="product-list-category-product-image-container">
                                                <img
                                                    src={product.image || "/placeholder.svg"}
                                                    alt={product.name}
                                                    className="product-list-category-product-image"
                                                />
                                                <div className="product-list-category-image-overlay">
                                                    <button
                                                        className="product-list-category-view-details-button"
                                                        onClick={() => handleNavigateToDetail(product)}
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="product-list-category-product-info">
                                                <h3 className="product-list-category-product-name">{product.name}</h3>
                                                <p className="product-list-category-product-price">{product.price.toLocaleString()} VND</p>
                                                {product.productVariants && product.productVariants.length > 0 ? (
                                                    <button
                                                        className="product-list-category-options-button"
                                                        onClick={() => handleOpenPopup(product)}
                                                    >
                                                        <FaCog className="product-list-category-button-icon" />
                                                        <span>Tùy chọn</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="product-list-category-add-to-cart-button"
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        <FaCartPlus className="product-list-category-button-icon" />
                                                        <span>Thêm vào giỏ</span>
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {selectedProduct && <ProductPopup product={selectedProduct} onClose={handleClosePopup} />}
        </div>
    );
};

export default ProductList;