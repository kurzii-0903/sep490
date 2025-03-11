import React, {createContext, useState, useEffect, useCallback} from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import {useNavigate} from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;
export const ProductContext = createContext();

export const AdminProductProvider = ({ children }) => {
	const [products, setProducts] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(0);
	const [newProduct, setNewProduct] = useState(null);
	const [selectedGroup, setSelectGroup] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [size, setSize] = useState(10);
	const [totalPages,setTotalPages] = useState(0);
	const [groupCategories, setGroupCategories] = useState([]);
	const [hubConnection, setHubConnection] = useState(null);
	const [search, setSearch] = useState("");
	const [taxes, setTaxes] = useState([]);
	const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
	const [reports, setReports] = useState(null);
    // Thiết lập Axios Interceptors để bắt lỗi 500
    axios.interceptors.response.use(
        (response) => response, // Nếu response thành công thì trả về bình thường
        (error) => {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        navigate("/login"); // Unauthorized
                        break;
                    case 403:
                        navigate("/403"); // Forbidden
                        break;
                    case 404:
                        navigate("/404"); // Not Found
                        break;
                    case 500:
                        navigate("/500"); // Internal Server Error
                        break;
                    case 503:
                        navigate("/503"); // Service Unavailable
                        break;
                    default:
                        break;
                }
            } else if (error.request) {
                console.error("Không có phản hồi từ server:", error.request);
                navigate("/offline"); // Có thể điều hướng đến trang "Không có kết nối mạng"
            } else {
                console.error("Lỗi không xác định:", error.message);
            }
            return Promise.reject(error);
        }
    );
	/** Lấy danh sách sản phẩm */
	const fetchProducts = useCallback(async () => {
		//setLoading(true);
		try {
			const response = await axios.get(`${BASE_URL}/api/Product/get-product-page`, {
				params: {group:selectedGroup, category: selectedCategory, page: currentPage, pagesize: size },
			});
			setProducts(response.data.items || []);
			setTotalPages(response.data.totalPages);
		} catch (error) {
			console.error("Lỗi khi lấy sản phẩm:", error.response?.data || error.message);
		} finally {
			setTimeout(() => {
			}, 0); //
		}
	},[currentPage, selectedCategory, selectedGroup, size]);

	/** Lấy thông tin chi tiết sản phẩm */
	const getProductById = async (id) => {
		try {
			const response = await axios.get(`${BASE_URL}/api/product/get-product-by-id/${id}`);
			return response.data;
		} catch (error) {
			console.error("Lỗi khi lấy thông tin sản phẩm:", error.response?.data || error.message);
		}
	};

	/** Lấy danh sách danh mục */
	const fetchGroupCategories = async () => {
		try {
			const response = await axios.get(`${BASE_URL}/api/Product/getall-category`);
			setGroupCategories(response.data || []);
		} catch (error) {
			console.error("Lỗi khi lấy danh mục sản phẩm:", error.response?.data || error.message);
			setGroupCategories([]);
		}
	};
	/**
	 * lấy danh sách thuế
	 * */
	const fetchTaxes = async () => {
		try{
			const response = await axios.get(`${BASE_URL}/api/tax/getall`);
			setTaxes(response.data || []);
		}catch(error){

		}
	}

	/** Thêm danh mục sản phẩm */
	const createCategory = async (category) => {
		try{
			const response = await axios.post(`${BASE_URL}/api/Product/create-category`, category);
			setGroupCategories(response.data);
			return response.data;
		}catch (error){
			throw error;
		}
	};

	/** Thêm danh mục sản phẩm */
	const updateCategory = async (category) => {
		try{
			const response = await axios.put(`${BASE_URL}/api/Product/update-category`, category);
			setGroupCategories(response.data);
			return response.data;
		}catch (error){
			throw error;
		}
	};

	/** Tạo sản phẩm */
	const createProduct = async (product) => {
		try {
			const response = await axios.post(`${BASE_URL}/api/product/create-product`, product);
			const newProduct = {...await response.data,isNew: true};
			setProducts((prevProducts)=>[newProduct,...prevProducts]);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data) {
				throw error.response.data;
			}
			throw new Error("Không thể kết nối đến server!");
		}
	};


	/** Xóa sản phẩm */
	const deleteProduct = async (id) => {
		try {
			const response = await axios.delete(`${BASE_URL}/api/product/delete-product/${id}`);
			if (response.status >= 200 && response.status < 300) {
				return true; // SignalR sẽ tự động cập nhật danh sách sản phẩm
			}
		} catch (error) {
			console.error("Lỗi khi xóa sản phẩm:", error.response?.data || error.message);
		}
	};

	/** cập nhật sản phẩm */
	const updateProduct = async (product) => {
		try{
			const response = await axios.put(`${BASE_URL}/api/product/update-product`, product);
			const updatedProduct = response.data;
			// Cập nhật danh sách sản phẩm
			setProducts((prevProducts) =>
				prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
			);
			return updatedProduct;

		}catch(error){
            if (error.response && error.response.data) {
                throw error.response.data;
            }
			throw error;
		}
	};

	/** Tìm kiếm sản phẩm */
	const searchProduct = useCallback(async (value) => {
		if (!value.trim()) {
			fetchProducts();
			return;
		}
		try {
			const response = await axios.get(`${BASE_URL}/api/Product/search-product`, {
				params: { title: value },
			});
			setProducts(response.data || []);
		} catch (error) {
			console.error("Lỗi khi tìm kiếm sản phẩm:", error.response?.data || error.message);
		}
	},[fetchProducts]);

	/** upload image */
	const uploadImage = async (image) => {
		try{
			const response = await axios.post(`${BASE_URL}/api/Product/create-image`, image);
			return response.data;
		}catch(error){
			throw error;
		}
	};

	/** upload image */
	const updateImage = async (image) => {
		try{
			const response = await axios.put(`${BASE_URL}/api/Product/update-image`, image);
			const updatedProduct = response.data;
			// Cập nhật danh sách sản phẩm
			setProducts((prevProducts) =>
				prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
			);
			return updatedProduct;
		}catch (error){
			throw error;
		}
	}

	/** delete image */
	const deleteImage = async (id) => {
		try{
			const response = await axios.delete(`${BASE_URL}/api/Product/delete-image/${id}`);
			return response.data;
		}catch(error){
			throw error;
		}
	}

	/** create variant */
	const createVariant= async (variant)=>{
		try{
			const response = await axios.post(`${BASE_URL}/api/Product/create-product-variant`, variant);
			return response.data;
		}catch(error){
			throw error;
		}
	}

	// update variant
	const updateVariant = async (variant) => {
		try{
			const response = await axios.put(`${BASE_URL}/api/Product/update-product-variant`, variant);
			return response.data;
		}catch(error){
			throw error;
		}
	}
	/**
	 * them thue cho san pham
	 * @param {number} productId
	 * @param {number} taxId
	 * @return {object} product
	 * */
	const addProductTax= async (productId,taxId) => {
		try{
			var productTax = {
				productId: productId,
				taxId: taxId
			}
			const response = await axios.post(`${BASE_URL}/api/product/add-tax`, productTax);
			return response.data;
		}catch(error){
			throw error;
		}
	}
	/**
	 * them thue cho san pham
	 * @param {number} id
	 * @return {object} product
	 * */
	const deleteProductTax= async (id) => {
		try{
			const response = await axios.delete(`${BASE_URL}/api/product/remove-tax/?productTaxid=${id}`);
			return response.data;
		}catch(error){
			throw error;
		}
	}

	const createGroup = async (group)=>{
		try{
			const response = await axios.post(`${BASE_URL}/api/Product/create-group-category`, group);
			setGroupCategories((prevGroups) =>[...prevGroups,response.data])
			return response.data;
		}catch (error){
			throw error;
		}
	}
	const updateGroupCategory = async (group)=>{
		try{
			const response = await axios.put(`${BASE_URL}/api/Product/update-group-category`, group);
			const updatedGroup = await response.data;
			setGroupCategories((prevGroups) => {
				return prevGroups.map((g) =>
					g.groupId === updatedGroup.groupId ? updatedGroup : g
				);
			});
			return response.data;
		}catch(error){
			throw error;
		}
	}
	useEffect(()=>{
		const fetchReport = async () => {
			try{
				const response = await axios.get(`${BASE_URL}/api/Report`);
				setReports(response.data);
			}catch (error){

			}
		}
		if(reports === null){
			fetchReport();
		}
	},[reports])
	/** Gọi API khi thay đổi danh mục, trang hoặc kích thước trang */
	useEffect(() => {
		if (search === "") {
			fetchProducts();
		}
	}, [fetchProducts, search]);


	/** Lấy danh mục và thuế ngay khi khởi động */
	useEffect(() => {
		if(taxes.length===0){
			fetchTaxes();
		}if(groupCategories.length ===0){
			fetchGroupCategories();
		}
	}, [taxes,groupCategories]);

	useEffect(()=>{
		setCategories(()=>{
			return groupCategories.flatMap(group => group.categories);
		});
	},[groupCategories])

	/** Delay tìm kiếm để tránh spam API */
	useEffect(() => {
		const delaySearch = setTimeout(() => {
			if (search.trim() !== "") {
				searchProduct(search);
			} else {
				fetchProducts();
			}
		}, 500);
		return () => clearTimeout(delaySearch);
	}, [searchProduct,fetchProducts,search]);

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
			}}
		>
			{children}
		</ProductContext.Provider>
	);
};
