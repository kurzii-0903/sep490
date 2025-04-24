import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ProductContext = createContext();

export const AdminProductProvider = ({ children }) => {
	const [products, setProducts] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(0);
	const [newProduct, setNewProduct] = useState(null);
	const [selectedGroup, setSelectGroup] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [size, setSize] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [groupCategories, setGroupCategories] = useState([]);
	const [search, setSearch] = useState("");
	const [taxes, setTaxes] = useState([]);
	const [categories, setCategories] = useState([]);
	const [reports, setReports] = useState(null);
	const [productState, setProductState] = useState(null);
	const { user } = useContext(AuthContext);

	// Check if user is authenticated as Admin or Manager
	const isAuthenticated = user && ["Admin", "Manager"].includes(user.role);

	/** Lấy danh sách sản phẩm */
	const fetchProducts = useCallback(async () => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.get(`/api/Product/get-product-page`, {
				params: { group: selectedGroup, category: selectedCategory, page: currentPage, pagesize: size },
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			setProducts(response.data.items || []);
			setTotalPages(response.data.totalPages);
		} catch (error) {
			console.error("Lỗi khi lấy sản phẩm:", error.response?.data || error.message);
		}
	}, [currentPage, selectedCategory, selectedGroup, size, isAuthenticated, user]);

	/** Lấy thông tin chi tiết sản phẩm */
	const getProductById = async (id) => {
		if (!isAuthenticated) return null;
		try {
			const response = await axios.get(`/api/product/get-product-by-id/${id}`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			console.error("Lỗi khi lấy thông tin sản phẩm:", error.response?.data || error.message);
			return null;
		}
	};

	/** Lấy danh sách danh mục */
	const fetchGroupCategories = async () => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.get('/api/Product/getall-category', {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			setGroupCategories(response.data || []);
		} catch (error) {
			console.error("Lỗi khi lấy danh mục sản phẩm:", error.response?.data || error.message);
		}
	};

	/** Lấy danh sách thuế */
	const fetchTaxes = async () => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.get('/api/tax/getall', {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			setTaxes(response.data || []);
		} catch (error) {
			console.error("Lỗi khi lấy thuế:", error.response?.data || error.message);
		}
	};

	const createTax = async (newTax) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.post(`/api/tax/create`, newTax, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			const data = response.data;
			setTaxes((prev) => [...prev, data]);
			return data;
		} catch (error) {
			console.error("Lỗi khi tạo thuế:", error.response?.data || error.message);
			throw error;
		}
	};

	const updateTax = async (tax) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.put(`/api/tax/update`, tax, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			const updatedTax = response.data;
			setTaxes((prev) =>
				prev.map((item) => (item.taxId === updatedTax.taxId ? updatedTax : item))
			);
			return updatedTax;
		} catch (error) {
			console.error("Lỗi khi cập nhật thuế:", error.response?.data || error.message);
			throw error;
		}
	};

	/** Thêm danh mục sản phẩm */
	const createCategory = async (category) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.post(`/api/Product/create-category`, category, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			setGroupCategories(response.data);
			return response.data;
		} catch (error) {
			console.error("Lỗi khi tạo danh mục:", error.response?.data || error.message);
			throw error;
		}
	};

	/** Cập nhật danh mục sản phẩm */
	const updateCategory = async (category) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.put(`/api/Product/update-category`, category, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			setGroupCategories(response.data);
			return response.data;
		} catch (error) {
			console.error("Lỗi khi cập nhật danh mục:", error.response?.data || error.message);
			throw error;
		}
	};

	/** Tạo sản phẩm */
	const createProduct = async (product) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.post(`/api/product/create-product`, product, {
				headers: {
					Authorization: `Bearer ${user.token}`,
					'Content-Type': 'multipart/form-data',
				},
				withCredentials: true,
			});
			const newProduct = { ...response.data, isNew: true };
			setProducts((prevProducts) => [newProduct, ...prevProducts]);
			return response.data;
		} catch (error) {
			console.error("Lỗi khi tạo sản phẩm:", error.response?.data || error.message);
			throw error.response?.data || new Error("Không thể kết nối đến server!");
		}
	};

	/** Xóa sản phẩm */
	const deleteProduct = async (id) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.delete(`/api/product/delete-product/${id}`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			if (response.status >= 200 && response.status < 300) {
				return true; // SignalR will update the product list
			}
		} catch (error) {
			console.error("Lỗi khi xóa sản phẩm:", error.response?.data || error.message);
			throw error;
		}
	};

	/** Cập nhật sản phẩm */
	const updateProduct = async (product) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.put(`/api/product/update-product`, product, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			const updatedProduct = response.data;
			setProducts((prevProducts) =>
				prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
			);
			return updatedProduct;
		} catch (error) {
			console.error("Lỗi khi cập nhật sản phẩm:", error.response?.data || error.message);
			throw error.response?.data || error;
		}
	};

	/** Tìm kiếm sản phẩm */
	const searchProduct = useCallback(async (value) => {
		if (!isAuthenticated) return;
		if (!value.trim()) {
			fetchProducts();
			return;
		}
		try {
			const response = await axios.get('/api/Product/search-product', {
				params: { title: value },
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			setProducts(response.data || []);
		} catch (error) {
			console.error("Lỗi khi tìm kiếm sản phẩm:", error.response?.data || error.message);
		}
	}, [fetchProducts, isAuthenticated, user]);

	/** Upload image */
	const uploadImage = async (image) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.post(`/api/Product/create-image`, image, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			console.error("Lỗi khi upload ảnh:", error.response?.data || error.message);
			throw error;
		}
	};

	/** Update image */
	const updateImage = async (image) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.put(`/api/Product/update-image`, image, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			const updatedProduct = response.data;
			setProducts((prevProducts) =>
				prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
			);
			return updatedProduct;
		} catch (error) {
			console.error("Lỗi khi cập nhật ảnh:", error.response?.data || error.message);
			throw error;
		}
	};

	/** Delete image */
	const deleteImage = async (id) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.delete(`/api/Product/delete-image/${id}`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			console.error("Lỗi khi xóa ảnh:", error.response?.data || error.message);
			throw error;
		}
	};

	/** Create variant */
	const createVariant = async (variant) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.post(`/api/Product/create-product-variant`, variant, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			console.error("Lỗi khi tạo variant:", error.response?.data || error.message);
			throw error;
		}
	};

	/** Update variant */
	const updateVariant = async (variant) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.put(`/api/Product/update-product-variant`, variant, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			console.error("Lỗi khi cập nhật variant:", error.response?.data || error.message);
			throw error;
		}
	};

	/** Thêm thuế cho sản phẩm */
	const addProductTax = async (productId, taxId) => {
		if (!isAuthenticated) return;
		try {
			const productTax = { productId, taxId };
			const response = await axios.post(`/api/product/add-tax`, productTax, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			console.error("Lỗi khi thêm thuế cho sản phẩm:", error.response?.data || error.message);
			throw error;
		}
	};

	/** Xóa thuế khỏi sản phẩm */
	const deleteProductTax = async (id) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.delete(`/api/product/remove-tax/?productTaxid=${id}`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			console.error("Lỗi khi xóa thuế khỏi sản phẩm:", error.response?.data || error.message);
			throw error;
		}
	};

	/** Tạo nhóm danh mục */
	const createGroup = async (group) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.post(`/api/Product/create-group-category`, group, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			setGroupCategories((prevGroups) => [...prevGroups, response.data]);
			return response.data;
		} catch (error) {
			console.error("Lỗi khi tạo nhóm danh mục:", error.response?.data || error.message);
			throw error;
		}
	};

	/** Cập nhật nhóm danh mục */
	const updateGroupCategory = async (group) => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.put(`/api/Product/update-group-category`, group, {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			const updatedGroup = response.data;
			setGroupCategories((prevGroups) =>
				prevGroups.map((g) => (g.groupId === updatedGroup.groupId ? updatedGroup : g))
			);
			return response.data;
		} catch (error) {
			console.error("Lỗi khi cập nhật nhóm danh mục:", error.response?.data || error.message);
			throw error;
		}
	};

	/** Lấy báo cáo */
	const fetchReport = async () => {
		if (!isAuthenticated) return;
		try {
			const response = await axios.get('/api/Report', {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
				withCredentials: true,
			});
			setReports(response.data);
		} catch (error) {
			console.error("Lỗi khi lấy báo cáo:", error.response?.data || error.message);
		}
	};

	// Existing useEffect hooks remain unchanged
	useEffect(() => {
		if (search === "" && isAuthenticated) {
			fetchProducts();
		}
	}, [fetchProducts, search, isAuthenticated]);

	useEffect(() => {
		if (isAuthenticated) {
			if (taxes.length === 0) {
				fetchTaxes();
			}
			if (groupCategories.length === 0) {
				fetchGroupCategories();
			}
		}
	}, [taxes, groupCategories, isAuthenticated]);

	useEffect(() => {
		setCategories(() => {
			return groupCategories.flatMap(group => group.categories);
		});
	}, [groupCategories]);

	useEffect(() => {
		const delaySearch = setTimeout(() => {
			if (search.trim() !== "" && isAuthenticated) {
				searchProduct(search);
			} else if (isAuthenticated) {
				fetchProducts();
			}
		}, 500);
		return () => clearTimeout(delaySearch);
	}, [search, searchProduct, fetchProducts, isAuthenticated]);

	return (
		<ProductContext.Provider
			value={{
				products,
				setProducts,
				selectedCategory,
				setSelectedCategory,
				currentPage,
				setCurrentPage,
				size,
				setSize,
				groupCategories,
				setGroupCategories,
				createProduct,
				deleteProduct,
				search,
				setSearch,
				getProductById,
				updateProduct,
				uploadImage,
				updateImage,
				createVariant,
				updateVariant,
				deleteImage,
				createCategory,
				updateCategory,
				createGroup,
				taxes,
				addProductTax,
				deleteProductTax,
				categories,
				setSelectGroup,
				selectedGroup,
				totalPages,
				updateGroupCategory,
				newProduct,
				setNewProduct,
				reports,
				createTax,
				updateTax,
				fetchReport,
				productState,
				setProductState,
			}}
		>
			{children}
		</ProductContext.Provider>
	);
};