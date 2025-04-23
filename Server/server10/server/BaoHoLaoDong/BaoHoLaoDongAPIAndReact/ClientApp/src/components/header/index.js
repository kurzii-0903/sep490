import React, { useState, useEffect, useContext } from "react";
import { FaPhoneAlt, FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import CartDropdown from "../Cartdropdown/CartDropdown";
import "./style.css";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import logo from "../../images/logo.gif";
import maleAvatar from "../../images/maleAvatar.png";
import femaleAvatar from "../../images/femaleAvatar.png";

function Header({ cartItems, removeFromCart, updateCartItemQuantity, showToast }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [search, setSearch] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const dropdownTimeout = React.useRef(null);

    // Hàm loại bỏ thẻ HTML
    const stripHtml = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    // Gọi API để lấy số điện thoại
    useEffect(() => {
        const fetchPhoneNumber = async () => {
            try {
                const response = await axios.get(`/api/BlogPost/get-blog-by-category/lien-he`);
                const contactData = response.data;
                const phonePost = contactData.find((post) => post.title.toLowerCase() === "điện thoại");
                if (phonePost) {
                    const cleanPhoneNumber = stripHtml(phonePost.content);
                    setPhoneNumber(cleanPhoneNumber);
                } else {
                    setPhoneNumber("0912.201.309");
                }
            } catch (error) {
                console.error("Error fetching phone number:", error);
                setPhoneNumber("0912.201.309");
            }
        };

        fetchPhoneNumber();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (!sidebarOpen) {
                setIsScrolled(window.scrollY > 50);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [sidebarOpen]);

    useEffect(() => {
        if (cartItems) {
            setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
        }
    }, [cartItems]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search) navigate(`/products?search=${search}`);
    };

    const showDropdown = () => {
        if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
        setDropdownVisible(true);
    };

    const hideDropdown = () => {
        dropdownTimeout.current = setTimeout(() => {
            setDropdownVisible(false);
        }, 200);
    };

    const location = useLocation();
    const isCartPage = location.pathname === "/cart" || location.pathname === "/confirm-order";
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Chọn avatar dựa trên giới tính, giống CustomerProfile
    const getAvatar = () => {
        if (user?.imageUrl) return user.imageUrl;
        const gender = user?.gender;

        if (typeof gender === 'string') {
            const genderLower = gender.toLowerCase();
            if (genderLower === 'male' || genderLower === 'nam') return maleAvatar;
            if (genderLower === 'female' || genderLower === 'nữ') return femaleAvatar;
        } else if (typeof gender === 'boolean') {
            return gender ? maleAvatar : femaleAvatar; // true: Male, false: Female
        }

        return maleAvatar; // Mặc định
    };

    // Ngăn sự kiện click lan tỏa từ dropdown
    const handleUserClick = (e) => {
        e.stopPropagation();
    };

    return (
        <header className={`header ${isScrolled ? "scrolled" : ""}`}>
            <div className="header-content">
                <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <FaTimes /> : <FaBars />}
                    <span>Menu</span>
                </button>

                <a href="/" className="logo">
                    <img src={logo} alt="Company Logo" />
                    <div className="company-info">
                        <h1>BẢO HỘ LAO ĐỘNG MINH XUÂN</h1>
                        <p>Luôn đem lại an toàn và hoàn hảo nhất cho bạn!</p>
                    </div>
                </a>

                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                    />
                </form>

                <div className="actions">
                    <div className="contact">
                        <FaPhoneAlt />
                        <span>{phoneNumber || "Đang tải..."}</span>
                    </div>
                    <div className="user" onClick={() => !user && navigate("/login")}>
                        {user ? (
                            <img
                                src={getAvatar()}
                                alt="User Avatar"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        ) : (
                            <FaUser />
                        )}
                        <div className="user-text">
                            <span>Thông tin</span>
                            <span>Tài khoản</span>
                        </div>
                        <div className="user-dropdown" onClick={handleUserClick}>
                            {user ? (
                                <>
                                    <Link to={`/customer-profile/${user.userId}`} className="block">
                                        Thông tin
                                    </Link>
                                    <Link to={`/order-history`} className="block">
                                        Đơn hàng
                                    </Link>
                                    <Link to="/logout" className="block">
                                        Đăng xuất
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/register" className="block">
                                        Đăng ký
                                    </Link>
                                    <Link to="/login" className="block">
                                        Đăng nhập
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div
                        className="cart-wrapper"
                        onMouseEnter={isDesktop && !isCartPage ? showDropdown : undefined}
                        onMouseLeave={isDesktop && !isCartPage ? hideDropdown : undefined}
                    >
                        <div className="cart" onClick={() => navigate("/cart")}>
                            <FaShoppingCart />
                            <span className="cart-count">{cartCount}</span>
                        </div>

                        {isDesktop && !isCartPage && dropdownVisible && (
                            <CartDropdown
                                cartItems={cartItems}
                                removeFromCart={removeFromCart}
                                updateCartItemQuantity={updateCartItemQuantity}
                                showToast={showToast}
                            />
                        )}
                    </div>
                </div>
            </div>
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </header>
    );
}

export default Header;