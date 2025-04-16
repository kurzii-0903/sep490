import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFilter, FaCartPlus, FaRegFrown, FaCog, FaAngleDown, FaSearch, FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa';
import { CustomerProductContext } from '../../contexts/CustomerProductContext';
import { CartContext } from '../../contexts/CartContext';
import { toSlug } from "../../utils/SlugUtils";
import ProductPopup from '../../components/productpopup';
import PageWrapper from "../../components/pageWrapper/PageWrapper";
import Banner from "../../components/banner/Banner";

const useQuery = () => new URLSearchParams(useLocation().search);

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

const ProductList = ({ config }) => {
    const { group, cate } = useParams();
    const query = useQuery();
    const search = query.get("search")?.trim() || "";
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [products, setProducts] = useState([]);
    const { groupCategories, searchProduct } = useContext(CustomerProductContext);
    const { addToCart } = useContext(CartContext);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedGroups, setExpandedGroups] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const productsPerPage = 20;
    const navigate = useNavigate();
    const filters = ["Giá tăng dần", "Giá giảm dần", "Rating"];

    const handleOpenPopup = (product) => setSelectedProduct(product);
    const handleClosePopup = () => setSelectedProduct(null);

    const handleAddToCart = (product) => {
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.image || "/placeholder.svg",
            quantity: 1,
            selectedVariant: null,
            price: product.price,
            priceAfterDiscount: product.priceAfterDiscount || product.price,
            discount: product.discount || 0,
            quantityInStock: product.quantity,
        };
        addToCart(cartItem);
    };

    const handleNavigateToDetail = (product) => navigate(`/products/${product.slug}`);

    const toggleGroupExpand = (groupId) => {
        setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await searchProduct(search);
                let sortedProducts = [...allProducts];
                if (selectedFilter === "Giá tăng dần") {
                    sortedProducts.sort((a, b) => getMinVariantPrice(a) - getMinVariantPrice(b));
                } else if (selectedFilter === "Giá giảm dần") {
                    sortedProducts.sort((a, b) => getMinVariantPrice(b) - getMinVariantPrice(a));
                } else if (selectedFilter === "Rating") {
                    sortedProducts.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                }
                setTotalPages(Math.ceil(sortedProducts.length / productsPerPage));
                const startIndex = (currentPage - 1) * productsPerPage;
                const endIndex = startIndex + productsPerPage;
                setProducts(sortedProducts.slice(startIndex, endIndex));
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [search, selectedFilter, currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <PageWrapper title={search || "Tất cả sản phẩm"}>
            <div className="bg-gray-100 min-h-screen">
                <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden">
                    <Banner config={config}/>
                </div>

                <div className="sticky top-0 z-10 bg-white shadow-md p-4 lg:hidden">
                    <button
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        className="flex items-center justify-between w-full p-2 bg-gray-100 rounded-lg"
                    >
                        <span className="flex items-center">
                            <FaFilter className="mr-2" />
                            Bộ lọc sản phẩm
                        </span>
                        <FaAngleDown className={`transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`} />
                    </button>
                </div>

                <div className="max-w-[95rem] mx-auto px-4 py-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                        <div className={`w-full lg:w-1/4 xl:w-1/5 ${mobileFiltersOpen ? "block" : "hidden"} lg:block`}>
                            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-20">
                                <div className="bg-gradient-to-t from-[#4a0403] to-[#a50d0b] text-yellow-400 p-4 flex items-center">
                                    <FaFilter className="mr-2" />
                                    <span className="font-semibold">BỘ LỌC SẢN PHẨM</span>
                                </div>

                                <div className="p-4 border-b border-gray-200">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (searchQuery.trim()) {
                                                navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                                            }
                                        }}
                                        className="relative"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm sản phẩm..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full p-2 pl-10 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-600"
                                        />
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </form>
                                </div>

                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="font-semibold mb-3 text-gray-600">Sắp xếp theo</h3>
                                    <div className="flex flex-col gap-2">
                                        {filters.map((filter, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedFilter(filter)}
                                                className={`px-4 py-2 bg-white rounded cursor-pointer transition-all text-left ${selectedFilter === filter ? "bg-blue-50 text-red-600" : "hover:bg-gray-100"}`}
                                            >
                                                {filter}
                                                {selectedFilter === filter && <FaCheck className="ml-2 inline" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold mb-3 text-gray-600">Loại Sản Phẩm</h3>
                                    <div className="flex flex-col gap-2">
                                        {groupCategories.map((groupItem) => (
                                            <div key={groupItem.groupId}>
                                                <div
                                                    className={`flex items-center justify-between p-2 rounded cursor-pointer ${Number.parseInt(group) === groupItem.groupId ? "bg-blue-50 text-red-600 font-medium" : "hover:bg-gray-100"}`}
                                                    onClick={() => toggleGroupExpand(groupItem.groupId)}
                                                >
                                                    <span
                                                        className="flex-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/products/${groupItem.groupId}/0/${toSlug(groupItem.groupName)}`);
                                                        }}
                                                    >
                                                        {groupItem.groupName}
                                                    </span>
                                                    <FaAngleDown
                                                        className={`transition-transform ${expandedGroups[groupItem.groupId] ? "rotate-180" : ""}`}
                                                    />
                                                </div>
                                                {expandedGroups[groupItem.groupId] && (
                                                    <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-200 pl-2">
                                                        {groupItem.categories.map((category) => (
                                                            <div
                                                                key={category.categoryId}
                                                                className={`p-2 rounded cursor-pointer ${Number.parseInt(group) === groupItem.groupId && Number.parseInt(cate) === category.categoryId ? "bg-blue-50 text-red-600 font-medium" : "hover:bg-gray-100"}`}
                                                                onClick={() => navigate(`/products/${groupItem.groupId}/${category.categoryId}/${toSlug(groupItem.groupName)}`)}
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

                        <div className="w-full lg:w-3/4 xl:w-4/5">
                            {products.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-12 flex flex-col items-center justify-center">
                                    <FaRegFrown className="text-gray-400 w-16 h-16 mb-4" />
                                    <h3 className="text-xl font-medium text-gray-500 mb-2">Không tìm thấy sản phẩm</h3>
                                    <p className="text-gray-400 text-center">
                                        Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <motion.div
                                        className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                                            exit: { opacity: 0 },
                                        }}
                                    >
                                        {products.map((product) => {
                                            const minVariant = getMinVariant(product);
                                            const minPrice = getMinVariantPrice(product);
                                            const hasDiscount = (product.discount && product.discount > 0) ||
                                                (product.priceAfterDiscount && product.priceAfterDiscount < product.price);

                                            return (
                                                <motion.div
                                                    key={product.id}
                                                    className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl flex flex-col"
                                                    variants={{
                                                        hidden: { opacity: 0, y: 20 },
                                                        visible: { opacity: 1, y: 0 },
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="relative overflow-hidden">
                                                        <img
                                                            src={product.image || "/placeholder.svg"}
                                                            alt={product.name}
                                                            className="w-full h-48 object-cover transition-transform hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity flex items-center justify-center hover:opacity-100">
                                                            <button
                                                                className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium translate-y-4 transition-transform hover:translate-y-0"
                                                                onClick={() => handleNavigateToDetail(product)}
                                                            >
                                                                Xem chi tiết
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 flex flex-col flex-grow gap-2">
                                                        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 min-h-[40px]">
                                                            {product.name}
                                                        </h3>
                                                        <div className="mt-auto">
                                                            <div className="text-red-600 font-bold mb-3 min-h-[50px]">
                                                                {hasDiscount ? (
                                                                    <>
                                                                        <div>
                                                                            <span className="text-red-500">{minPrice.toLocaleString()}đ</span>
                                                                            <span className="text-gray-400 line-through ml-2">
                                                                                {(minVariant ? minVariant.price : product.price).toLocaleString()}đ
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-yellow-600">Giảm {product.discount || 0}%</p>
                                                                    </>
                                                                ) : (
                                                                    <span>{minPrice.toLocaleString()}đ</span>
                                                                )}
                                                            </div>
                                                            {product.productVariants && product.productVariants.length > 0 ? (
                                                                <button
                                                                    className="w-full p-2 rounded-lg flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
                                                                    onClick={() => handleOpenPopup(product)}
                                                                >
                                                                    <FaCog />
                                                                    Tùy chọn
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="w-full p-2 rounded-lg flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
                                                                    onClick={() => handleAddToCart(product)}
                                                                >
                                                                    <FaCartPlus />
                                                                    Thêm vào giỏ
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>

                                    {products.length > 20 && totalPages > 1 && (
                                        <div className="mt-8 flex justify-center">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className={`px-4 py-2 rounded bg-white text-gray-600 border border-gray-200 ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
                                                >
                                                    <FaChevronLeft className="w-4 h-4" />
                                                </button>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`px-4 py-2 rounded bg-white text-gray-600 border border-gray-200 ${currentPage === page ? "bg-red-600 text-white" : "hover:bg-gray-100"}`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className={`px-4 py-2 rounded bg-white text-gray-600 border border-gray-200 ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
                                                >
                                                    <FaChevronRight className="w-4 h-4" />
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
        </PageWrapper>
    );
};


export default ProductList;