"use client"

import { useState, useEffect, useContext } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
    FaFilter,
    FaCartPlus,
    FaRegFrown,
    FaCog,
    FaChevronRight,
    FaChevronLeft,
    FaAngleDown,
    FaSearch,
} from "react-icons/fa"
import { CustomerProductContext } from "../../contexts/CustomerProductContext"
import { CartContext } from "../../contexts/CartContext"
import { toSlug } from "../../utils/SlugUtils"
import ProductPopup from "../../components/productpopup"
import "./ProductListCategory.css" // Import the new CSS file

const useQuery = () => new URLSearchParams(useLocation().search)

const ProductListCategory = () => {
    const { group, cate, slug } = useParams()
    const query = useQuery()
    const [selectedFilters, setSelectedFilters] = useState([])
    const [products, setProducts] = useState([])
    const { groupCategories, searchProduct, getProductPage } = useContext(CustomerProductContext)
    const { addToCart } = useContext(CartContext)
    const [currentPage, setCurrentPage] = useState(Number.parseInt(query.get("page")) || 1)
    const [totalPages, setTotalPages] = useState(0)
    const [pageSize] = useState(8)
    const [categorySelected, setSelectedCategory] = useState(0)
    const navigate = useNavigate()
    const [hoveredGroup, setHoveredGroup] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [expandedGroups, setExpandedGroups] = useState({})

    const priceFilters = ["Dưới 1 triệu", "1 triệu - 3 triệu", "3 triệu - 5 triệu", "Trên 5 triệu"]

    const handleFilterChange = (filter) => {
        setSelectedFilters((prev) => (prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]))
    }

    const handleOpenPopup = (product) => {
        setSelectedProduct(product);
    }

    const handleNavigateToDetail = (product) => {
        navigate(`/products/${product.slug}`);
    }

    const handleClosePopup = () => {
        setSelectedProduct(null)
    }

    const handleAddToCart = (product) => {
        addToCart(product)
        const toast = document.createElement("div")
        toast.className = "product-list-category-toast-notification"
        toast.innerHTML = `
      <div class="product-list-category-toast-content">
        <div class="product-list-category-toast-icon">✓</div>
        <div class="product-list-category-toast-message">Đã thêm ${product.name} vào giỏ hàng</div>
      </div>
    `
        document.body.appendChild(toast)
        setTimeout(() => {
            toast.classList.add("show")
            setTimeout(() => {
                toast.classList.remove("show")
                setTimeout(() => {
                    document.body.removeChild(toast)
                }, 300)
            }, 3000)
        }, 100)
    }

    const toggleGroupExpand = (groupId) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupId]: !prev[groupId],
        }))
    }

    useEffect(() => {
        let isMounted = true
        const fetchProducts = async () => {
            try {
                const result = await getProductPage(Number.parseInt(group), Number.parseInt(cate), currentPage, pageSize)
                if (isMounted) {
                    setProducts(result?.items || [])
                    setTotalPages(result?.totalPages || 0)
                }
            } catch (error) {
                console.error("Error fetching products:", error)
            } finally {
                if (groupCategories && groupCategories.length > 0) {
                    const groupExit = groupCategories.find((g) => g.groupId === Number.parseInt(group))

                    if (groupExit) {
                        const slugGroup = groupExit.groupName || ""
                        navigate(`/products/${group}/${cate}/${toSlug(slugGroup)}`, { replace: true })
                    } else {
                        console.warn("groupExit is undefined, check if groupId is valid:", group)
                    }
                } else {
                    console.warn("groupCategories is empty or undefined.")
                }
            }
        }

        fetchProducts()

        return () => {
            isMounted = false
        }
    }, [group, cate, slug, groupCategories, currentPage, pageSize])

    const getCurrentCategoryName = () => {
        if (!groupCategories || groupCategories.length === 0) return ""

        const currentGroup = groupCategories.find((g) => g.groupId === Number.parseInt(group))
        if (!currentGroup) return ""

        if (Number.parseInt(cate) === 0) return currentGroup.groupName

        const currentCategory = currentGroup.categories.find((c) => c.categoryId === Number.parseInt(cate))
        return currentCategory ? currentCategory.categoryName : currentGroup.groupName
    }

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
                    <h1 className="product-list-category-banner-title">{getCurrentCategoryName() || "Sản phẩm"}</h1>
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
                                                        e.stopPropagation()
                                                        navigate(`/products/${groupItem.groupId}/0/${toSlug(groupItem.groupName)}`)
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

                                {/* Pagination */}
                                {totalPages > 0 && (
                                    <div className="product-list-category-pagination-container">
                                        <div className="product-list-category-pagination-buttons">
                                            <button
                                                onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                                                disabled={currentPage === 1}
                                                className={`product-list-category-pagination-button ${currentPage === 1 ? "disabled" : ""}`}
                                            >
                                                <FaChevronLeft className="product-list-category-pagination-icon" />
                                            </button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(Number(page))}
                                                    className={`product-list-category-pagination-button ${currentPage === page ? "active" : ""}`}
                                                >
                                                    {page}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className={`product-list-category-pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
                                            >
                                                <FaChevronRight className="product-list-category-pagination-icon" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {selectedProduct && <ProductPopup product={selectedProduct} onClose={handleClosePopup} />}
        </div>
    )
}

export default ProductListCategory