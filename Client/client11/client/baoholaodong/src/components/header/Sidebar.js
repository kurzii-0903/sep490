import { useContext, useEffect, useState } from "react";
import {
    FaHardHat, FaBolt, FaTint, FaShieldAlt, FaBiohazard,
    FaFireExtinguisher, FaTimes, FaChevronDown, FaChevronUp, FaBroom, FaRoad, FaUserShield
} from "react-icons/fa";
import { CustomerProductContext } from "../../contexts/CustomerProductContext";
import { useNavigate } from "react-router-dom";
import { toSlug } from "../../utils/SlugUtils";
import axios from "axios"; // Thêm axios để gọi API

const BASE_URL = process.env.REACT_APP_BASE_URL_API; // Đảm bảo BASE_URL đã được cấu hình

export default function Sidebar({ isOpen, toggleSidebar }) {
    const [openIndex, setOpenIndex] = useState(null);
    const { groupCategories } = useContext(CustomerProductContext);
    const [menuItems, setMenuItems] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState(""); // State để lưu số điện thoại từ API
    const navigate = useNavigate();

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
                const response = await axios.get(`${BASE_URL}/api/BlogPost/get-blog-by-category/lien-he`);
                const contactData = response.data;
                // Tìm bài post có title là "Điện thoại"
                const phonePost = contactData.find((post) => post.title.toLowerCase() === "điện thoại");
                if (phonePost) {
                    // Loại bỏ thẻ HTML trước khi lưu số điện thoại
                    const cleanPhoneNumber = stripHtml(phonePost.content);
                    setPhoneNumber(cleanPhoneNumber);
                } else {
                    setPhoneNumber("0912.201.309"); // Số mặc định nếu không tìm thấy
                }
            } catch (error) {
                console.error("Error fetching phone number:", error);
                setPhoneNumber("0912.201.309"); // Số mặc định nếu có lỗi
            }
        };

        fetchPhoneNumber();
    }, []);

    const handleItemClick = (index, groupId, cateId, event) => {
        toggleSidebar();
        if (event.target.classList.contains("arrow-icon")) {
            setOpenIndex(openIndex === index ? null : index);
        } else {
            const group = groupCategories.find(g => g.groupId === groupId);
            const slug = group ? toSlug(group.groupName) : "unknown";
            navigate(`/products/${groupId}/${cateId}/${slug}`);
        }
    };

    useEffect(() => {
        if (groupCategories && groupCategories.length > 0) {
            const updatedMenuItems = groupCategories.map(group => ({
                icon: getIconForGroup(group?.groupName || ""),
                label: group?.groupName || "Chưa xác định",
                groupId: group?.groupId || 0,
                subItems: (group?.categories || []).map(category => category?.categoryName || "Không xác định")
            }));
            setMenuItems(updatedMenuItems);
        } else {
            setMenuItems([]);
        }
    }, [groupCategories]);

    const getIconForGroup = (groupName) => {
        switch (groupName) {
            case "Trang Thiết bị bảo hộ": return <FaHardHat />;
            case "An toàn ngành điện": return <FaBolt />;
            case "An toàn ngành nước": return <FaTint />;
            case "Thiết bị chống ồn": return <FaShieldAlt />;
            case "Thiết bị phòng độc": return <FaBiohazard />;
            case "Phòng cháy chữa cháy": return <FaFireExtinguisher />;
            case "Thiết bị phòng sạch": return <FaBroom />;
            case "An toàn giao thông": return <FaRoad />;
            case "An ninh, bảo vệ": return <FaUserShield />;
            default: return <FaHardHat />;
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out z-[1050] ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={toggleSidebar}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[1051] ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-t from-[#4a0403] to-[#a50d0b] text-yellow-400 p-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold">DANH MỤC</h2>
                    <button onClick={toggleSidebar}>
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Danh mục */}
                <ul className="p-4 text-red-700 overflow-auto flex-1">
                    {menuItems.map(({ icon, subItems, groupId, label }, index) => (
                        <li key={groupId} className="flex flex-col">
                            <div className="flex items-center justify-between gap-3 p-3 border-b cursor-pointer hover:bg-gray-100">
                                <div
                                    className="flex items-center gap-2 flex-grow"
                                    onClick={(event) => handleItemClick(index, groupId, 0, event)}
                                >
                                    {icon}
                                    {label}
                                </div>
                                <div
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="cursor-pointer arrow-icon p-1"
                                >
                                    {openIndex === index ? (
                                        <FaChevronUp className="arrow-icon" />
                                    ) : (
                                        <FaChevronDown className="arrow-icon" />
                                    )}
                                </div>
                            </div>

                            {openIndex === index && (
                                <ul className="pl-8">
                                    {subItems.map((subItem, subIndex) => {
                                        const categoryId = groupCategories[index]?.categories[subIndex]?.categoryId;
                                        return (
                                            <li
                                                key={categoryId}
                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                                onClick={(event) => handleItemClick(index, groupId, categoryId, event)}
                                            >
                                                {subItem}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Footer */}
                <div className="p-4 mt-4 border-t text-red-600 text-sm">
                    <a href="/about" className="block mb-2 hover:underline">Về Bảo hộ lao động Minh Xuân</a>
                    <a href="/blogs" className="block mb-2 hover:underline">Các bài viết và tin tức mới nhất</a>
                    <a href="/contact" className="block hover:underline">Liên hệ chúng tôi</a>
                </div>

                <div className="absolute bottom-0 w-full p-4 bg-gray-100 flex items-center justify-center">
                    <span className="text-red-600 font-bold text-lg">
                        Hotline: {phoneNumber || "Đang tải..."}
                    </span>
                </div>
            </div>
        </>
    );
}