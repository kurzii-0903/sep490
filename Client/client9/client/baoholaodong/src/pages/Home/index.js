import React, { useContext, useEffect, useState } from "react";
import { CustomerProductContext } from "../../contexts/CustomerProductContext";
import Banner from "../../components/banner/Banner";
import Feedbacks from "../../components/feedbacks";
import NewBlog from "../../components/newblog";
import TopSaleProducts from "./TopSaleProducts";
import TopDealProducts from "./TopDealProducts";
import "./home.css";
import axios from "axios"; // Import the CSS file

// const BlogCategories = ({ blogs }) => {
//     return (
//         <div className="blog-categories-container">
//             <h2 className="section-title">BLOG LAO ĐỘNG MỚI NHẤT</h2>
//             <div className="blog-list">
//                 {blogs.map((blog) => (
//                     <div key={blog.id} className="blog-item">
//                         <img src={blog.image} alt={blog.title} className="blog-image" />
//                         <div className="blog-content">
//                             <h3 className="blog-title">{blog.title}</h3>
//                             <p className="blog-date">{blog.date}</p>
//                             <p className="blog-preview">{blog.preview}</p>
//                             <div className="blog-actions">
//                                 <div className="blog-tags">
//                                     {blog.tags.map((tag, index) => (
//                                         <span key={index} className="blog-tag">#{tag}</span>
//                                     ))}
//                                 </div>
//                                 <a href={blog.link} className="read-more">
//                                     Đọc thêm →
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

const BASE_URL = process.env.REACT_APP_BASE_URL_API;
function Index() {
    const [showWelcome, setShowWelcome] = useState(false)
    const [topSaleProducts, setTopSaleProducts] = useState([])
    const [topDealProducts, setTopDealProducts] = useState([])
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        if (localStorage.getItem("welcomeBack") === "true") {
            setShowWelcome(true);
            localStorage.removeItem("welcomeBack"); // Remove after showing once
            setTimeout(() => setShowWelcome(false), 3000); // Auto-hide after 3s
        }
    }, [])
    const fetchTopSaleProducts = async (size) => {
        try{
            const response = await axios.get(`${BASE_URL}/api/Product/top-sale-product`,{
                params: {
                    size: size
                }
            });
            console.log(response.data.length);
            setTopSaleProducts(response.data || []);
        }catch(error){
            return [];
        }
    }
    const fetchTopDealProducts = async (size,minDiscount) => {
        try{
            const response = await axios.get(`${BASE_URL}/api/Product/top-deal`,{
                params: {
                    size: size,
                    minDiscountPercent: minDiscount,
                }
            });
            setTopDealProducts(response.data || []);
        }catch(error){
            return [];
        }
    }

    const fetchBlogs = async () => {
        try {
            const mockBlogs = [
                {
                    id: 1,
                    title: "Chính sách mua hàng đồ bảo hộ lao động",
                    image: "/thiet-bi-bao-ho-lao-dong.webp",
                    date: "March 18, 2025 - 8 min read",
                    preview:
                        "Tìm hiểu chi tiết về chính sách mua hàng tại BaoHoLaoDongMinhXuan, nơi cung cấp các sản phẩm đồ bảo hộ lao động chất lượng cao như mũ bảo hộ, giày chống trượt, và quần áo bảo hộ. Chúng tôi cam kết mang đến cho khách hàng các điều khoản rõ ràng về giá cả, phương thức thanh toán, và quyền lợi đổi trả trong trường hợp sản phẩm không đạt yêu cầu. Chính sách này được thiết kế để đảm bảo sự an tâm tuyệt đối cho người lao động khi lựa chọn sản phẩm từ chúng tôi, đồng thời hỗ trợ tối đa trong quá trình sử dụng.",
                    link: "/policy/purchase-policy",
                    tags: ["Chínhsách", "Đồbảohộ", "Muahàng"],
                },
                {
                    id: 2,
                    title: "Hướng dẫn mua và sử dụng đồ bảo hộ lao động",
                    image: "/thiet-bi-bao-ho-lao-dong.webp",
                    date: "March 17, 2025 - 7 min read",
                    preview:
                        "Hướng dẫn từng bước để bạn có thể mua sắm và sử dụng hiệu quả các sản phẩm đồ bảo hộ lao động trên website của chúng tôi. Từ việc lựa chọn kích cỡ phù hợp cho mũ bảo hộ, kiểm tra chất lượng giày chống trượt, đến cách bảo quản quần áo bảo hộ sau khi sử dụng, chúng tôi sẽ cung cấp đầy đủ thông tin để bạn yên tâm. Ngoài ra, bạn sẽ được hướng dẫn cách đặt hàng trực tuyến, theo dõi đơn hàng, và xử lý các vấn đề phát sinh trong quá trình giao nhận, đảm bảo trải nghiệm mua sắm thuận lợi nhất.",
                    link: "/guide/purchase-guide",
                    tags: ["Hướngdẫn", "Đồbảohộ", "Sửdụng"],
                },
            ];
            setBlogs(mockBlogs); // Cập nhật state blogs
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setBlogs([]);
        }
    };

    useEffect(() => {
        fetchTopDealProducts()
        fetchTopSaleProducts()
        fetchBlogs();
    },[])

    return (
        <div className="home-container">
            {showWelcome && <div className="welcome-message">🎉 Welcome back!</div>}
            <Banner />
            <TopDealProducts products={topDealProducts} />
            <TopSaleProducts products={topSaleProducts} title="TOP SẢN PHẨM BÁN CHẠY" />
            <Feedbacks />
            <NewBlog /></div>

    );
}

export default Index;