import React, { useState, useEffect, useContext } from "react";
import { FaPhoneAlt, FaUser, FaShoppingCart, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import CartDropdown from "../Cartdropdown/CartDropdown";
import "./style.css";
import { AuthContext } from "../../contexts/AuthContext";
import {ProductContext} from "../../contexts/AdminProductContext";
import {CustomerProductContext} from "../../contexts/CustomerProductContext";

function Header({ cartItems, removeFromCart, updateCartItemQuantity, showToast }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false); // State to track scroll position
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState("");
    const handleSearch = (e)=>{
        e.preventDefault();
        if(search !== ""){
            window.location.href= ("/products?search="+search);
        }
    }
    useEffect(() => {
        updateCartCount();
    }, [cartItems]);

    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector(".header-gradient");
            const headerHeight = header.offsetHeight;
            if (window.scrollY > headerHeight * 2) { // Adjust the threshold as needed
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const updateCartCount = () => {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
    };

    const handleCartClick = () => {
        navigate("/cart");
    };

    return (
        <>
            <header className={`header-gradient shadow ${isScrolled ? "scrolled" : ""}`}>
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-4">
                    <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                        <button onClick={toggleSidebar} className="text-white mr-4">
                            {sidebarOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                            <span className="ml-2  md:inline">MENU</span>
                        </button>
                        <a href="/">
                            <img alt="Company Logo" className="h-12 md:h-16" src={"http://baoholaodongminhxuan.com/images/common/logo1.gif"} />
                        </a>
                        <div className="ml-4">
                            <h1 className="text-lg md:text-xl font-bold text-white">
                                BẢO HỘ LAO ĐỘNG MINH XUÂN
                            </h1>
                            <p className="text-xs md:text-sm text-white">
                                Luôn đem lại an toàn và hoàn hảo nhất cho bạn!
                            </p>
                        </div>
                    </div>
                    <div className="search-container w-full md:w-auto mx-4 md:mx-8 flex items-center">
                        <FaSearch className="text-white h-5 w-5 mr-2" onClick={handleSearch} />
                        <form className="w-full" onSubmit={handleSearch}>
                            <input
                                value={search}
                                onChange={(e)=>{setSearch(e.target.value)}}
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="w-full px-4 py-2 "
                            />
                        </form>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="relative group contact-info">
                            <div className="flex items-center cursor-pointer">
                                <FaPhoneAlt className="text-white h-6 w-6" />
                                <div className="ml-2">
                                    <p className="text-sm text-white">
                                        Liên hệ
                                    </p>
                                    <div className="flex items-center">
                                        <p className="text-lg font-bold text-white">
                                            0912.201.309
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="flex items-center cursor-pointer">
                                {user ? (
                                    <img
                                        src={user.imageUrl}
                                        alt="Avatar"
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <FaUser
                                        className="text-white h-6 w-6"
                                        onClick={() => {
                                            if (!user) {
                                                navigate("/login");
                                            }
                                        }}
                                    />
                                )}
                                <div className="ml-2">
                                    <p className="text-sm text-white">Thông tin</p>
                                    <div className="flex items-center">
                                        <p className="text-lg font-bold text-white">Tài khoản</p>
                                        <span className="ml-1 text-white">&#9662;</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                {user? (
                                    <a href="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Đăng
                                        xuất</a>
                                ) : (
                                    <>
                                        <a href="/register" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Đăng
                                            ký</a>
                                        <a href="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Đăng
                                            nhập</a></>
                                )}
                            </div>
                        </div>
                        <div className="relative flex items-center"
                             onMouseEnter={() => location.pathname !== "/cart" && setDropdownVisible(true)}
                             onMouseLeave={() => setDropdownVisible(false)}>
                            <div className="relative">
                                <FaShoppingCart className="text-white h-8 w-8 cursor-pointer" onClick={handleCartClick} />
                                <span
                                    className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-block w-4 h-4 bg-white text-red-600 text-xs font-bold rounded-full text-center">{cartCount}</span>
                            </div>
                            <span className="ml-2 text-lg font-bold text-white">
                                Giỏ hàng
                            </span>
                            {dropdownVisible && <CartDropdown cartItems={cartItems} removeFromCart={removeFromCart} updateCartItemQuantity={updateCartItemQuantity} showToast={showToast} />}
                        </div>
                    </div>

                </div>
                <div className="mobile-search-container w-full md:hidden mx-4 md:mx-8 flex items-center">
                    <FaSearch className="text-white h-5 w-5 mr-2" onClick={handleSearch} />
                    <form className="w-full" onSubmit={handleSearch}>
                        <input
                            value={search}
                            onChange={(e)=>{setSearch(e.target.value)}}
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full px-4 py-2 "
                        />
                    </form>
                </div>

            </header>
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </>
    );
}

export default Header;