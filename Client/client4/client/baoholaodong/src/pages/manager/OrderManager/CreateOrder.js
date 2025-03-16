import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import noImage from "../../../images/no-image-product.jpg";
import { formatVND } from "../../../utils/format";
import {Trash2, Plus, Minus, ShoppingCart, Truck, Package, Shield} from "lucide-react";
import Modal from "../../../components/Modal/Modal";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

export default function CreateOrder() {
    const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [productSelected, setProductSelected] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [order, setOrder] = useState({
        customerName: "",
        address: "",
        phone: "",
        email: "",
        orderDetails: []
    });

    useEffect(() => {
        if (searchText.trim() !== "") {
            const delayDebounce = setTimeout(() => {
                searchProduct(searchText);
            }, 1000);
            return () => clearTimeout(delayDebounce);
        } else {
            setProducts([]);
        }
    }, [searchText]);

    const searchProduct = useCallback(async (value) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/Product/search-product`, {
                params: { title: value },
            });
            setProducts(response.data || []);
        } catch (error) {
            console.error("Lỗi khi tìm kiếm sản phẩm:", error.response?.data || error.message);
        }
    }, []);

    const addToOrder = (product) => {
        setProductSelected(product);
        setIsOpenModal(true);
    };

    const updateQuantity = (index, change) => {
        setOrder((prevOrder) => {
            let newOrderDetails = [...prevOrder.orderDetails];

            if (newOrderDetails[index].quantity + change > 0) {
                newOrderDetails[index].quantity += change;
                newOrderDetails[index].totalPrice = newOrderDetails[index].quantity * newOrderDetails[index].productPrice;
            } else {
                newOrderDetails.splice(index, 1);
            }
            return { ...prevOrder, orderDetails: newOrderDetails };
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 bg-white min-h-[800px]">
                {/* Left Side: Product Search */}
                <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Search Products</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="search">Product Name</label>
                        <input
                            className="w-full p-3 border rounded-lg"
                            id="search"
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search for a product..."
                        />
                    </div>
                    <table className="min-w-full max-h-[500px] divide-y divide-gray-200">
                        <thead>
                        <tr>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh sản phẩm</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá sản phẩm</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thêm</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.length > 0 && products.map((product) => (
                            <tr key={product.id} className="border-b bg-white divide-y divide-gray-200 hover:bg-gray-100">
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <img src={product.image || noImage} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                                </td>
                                <td className="px-6 py-4 text-sm truncate max-w-[150px]">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{formatVND(product.price)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{product.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                                        onClick={() => addToOrder(product)}
                                    >Add</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Right Side: Order Items */}
                <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Order Items</h2>
                    <div className="space-y-4">
                        {order.orderDetails.length > 0 ? order.orderDetails.map((item, index) => (
                            <div key={item.productId} className="p-4 border rounded-lg flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                                    {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                                    <p>{formatVND(item.productPrice)} x {item.quantity} = <b>{formatVND(item.totalPrice)}</b></p>
                                </div>
                                <button onClick={() => updateQuantity(index, -1)} className="bg-gray-200 p-2 rounded"><Minus size={16} /></button>
                                <button onClick={() => updateQuantity(index, 1)} className="bg-gray-200 p-2 rounded"><Plus size={16} /></button>
                                <button onClick={() => updateQuantity(index, -item.quantity)} className="bg-red-500 text-white p-2 rounded"><Trash2 size={16} /></button>
                            </div>
                        )) : <p className="text-center text-gray-500">No products in order.</p>}
                    </div>
                </div>

            </div>
            <Modal onClose={()=>setIsOpenModal(false)} isOpen={isOpenModal}  title={"Chọn biến thể"} >
                <FormSelectProductVariant product={productSelected} setOrder={setOrder} onClose={()=>setIsOpenModal(false)} />
            </Modal>
        </div>
    );
}
const FormSelectProductVariant = ({ product, setOrder,onClose }) => {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // Lọc kích thước có sẵn
    const availableSizes = [...new Set(product.productVariants.map(({ size }) => size))];

    // Lọc màu sắc có sẵn dựa trên kích thước đã chọn
    const availableColors = selectedSize
        ? [...new Set(product.productVariants.filter(v => v.size === selectedSize).map(({ color }) => color))]
        : [...new Set(product.productVariants.map(({ color }) => color))];

    // Tự động cập nhật kích thước hoặc màu khi có lựa chọn mới
    useEffect(() => {
        if (selectedSize) {
            const colorsForSize = availableColors;
            if (!colorsForSize.includes(selectedColor)) {
                setSelectedColor(null);
            }
        }
    }, [selectedSize]);

    useEffect(() => {
        if (selectedColor) {
            const sizesForColor = product.productVariants
                .filter(v => v.color === selectedColor)
                .map(({ size }) => size);
            if (!sizesForColor.includes(selectedSize)) {
                setSelectedSize(null);
            }
        }
    }, [selectedColor]);

    // Lấy biến thể phù hợp với kích thước và màu sắc đã chọn
    const selectedVariant = product.productVariants.find(
        v => v.size === selectedSize && v.color === selectedColor
    );

    const addToOrder = () => {
        let newItem;

        if (product.productVariants.length !== 0) {
            if (!selectedVariant) {
                alert("Vui lòng chọn kích thước và màu sắc.");
                return;
            }
            newItem = {
                productId: selectedVariant.id,
                productPrice: selectedVariant.price,
                quantity,
                totalPrice: selectedVariant.price * quantity,
                name: product.name,
                size: selectedSize || null,
                color: selectedColor || null,
                image: product.image || noImage
            };
        } else {
            // Trường hợp sản phẩm không có biến thể
            newItem = {
                productId: product.id,
                productPrice: product.price,
                quantity,
                totalPrice: product.price * quantity,
                name: product.name,
                size: null,
                color: null,
                image: product.image || noImage
            };
        }

        setOrder(prevOrder => {
            let newOrderDetails = [...prevOrder.orderDetails];

            // Kiểm tra xem sản phẩm với cùng productId, size và color đã tồn tại chưa
            const existingIndex = newOrderDetails.findIndex(item =>
                item.productId === newItem.productId &&
                item.size === newItem.size &&
                item.color === newItem.color
            );

            if (existingIndex >= 0) {
                // Nếu đã tồn tại, chỉ cập nhật số lượng và tổng giá
                newOrderDetails[existingIndex].quantity += quantity;
                newOrderDetails[existingIndex].totalPrice =
                    newOrderDetails[existingIndex].quantity * newOrderDetails[existingIndex].productPrice;
            } else {
                // Nếu chưa tồn tại, thêm sản phẩm mới vào danh sách
                newOrderDetails.push(newItem);
            }

            return { ...prevOrder, orderDetails: newOrderDetails };
        });


        onClose();
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
                {/* Ảnh sản phẩm */}
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                        src={product.productImages.length > 0 ? product.productImages[imageIndex].image : noImage}
                        alt="Product"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = noImage; }}
                    />
                </div>
                {/* Danh sách ảnh nhỏ */}
                <div className="grid grid-cols-4 gap-4">
                    {product.productImages.map((img, index) => (
                        <div key={index} className="aspect-square rounded-md overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 ring-blue-500">
                            <img onClick={() => setImageIndex(index)}
                                 src={img.image}
                                 alt={`View ${index}`}
                                 className="w-full h-full object-cover"
                                 onError={(e) => { e.target.onerror = null; e.target.src = noImage; }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                {/* Giá sản phẩm */}
                <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-red-600">{product.priceDiscount.toLocaleString("vi-vn")}₫</span>
                    <span className="text-lg text-gray-400 line-through">{product.price.toLocaleString("vi-vn")}₫</span>
                    {product.discount > 0 && (
                        <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">-{product.discount}%</span>
                    )}
                </div>

                {/* Chọn kích thước */}
                {availableSizes.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">Kích thước</h3>
                        <div className="mt-2 grid grid-cols-4 gap-2">
                            {availableSizes.map((size, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                                        selectedSize === size ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chọn màu sắc */}
                {availableColors.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">Màu sắc</h3>
                        <div className="mt-2 grid grid-cols-4 gap-2">
                            {availableColors.map((color, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedColor(color)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                                        selectedColor === color ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Điều chỉnh số lượng */}
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

                {/* Nút thêm vào đơn hàng */}
                <button
                    onClick={addToOrder}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Thêm vào đơn hàng
                </button>
            </div>
        </div>
    );
};
