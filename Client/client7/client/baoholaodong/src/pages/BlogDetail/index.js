import React from 'react';
import { FaClock } from 'react-icons/fa';
import './style.css';

const BlogDetail = () => {
    // Sample data for the blog detail (adjusted to match the image content)
    const blog = {
        title: "HUẤN LUYỆN AN TOÀN LAO ĐỘNG TẠI KHU CÔNG NGHIỆP",
        date: "06/09/2024",
        image: "https://baoholaodonglasa.com/wp-content/uploads/2021/04/thiet-bi-bao-ho-lao-dong.webp",
        content: {
            intro: `
        <p>An toàn lao động tại khu công nghiệp là một yêu cầu bắt buộc nhằm đảm bảo an toàn cho người lao động. Việc thực hiện huấn luyện an toàn lao động không chỉ giúp nâng cao ý thức của người lao động mà còn giúp doanh nghiệp tuân thủ đúng các quy định pháp luật. Theo Cục An toàn Lao động, việc huấn luyện an toàn giúp người lao động hiểu rõ các nguy cơ tiềm ẩn trong quá trình làm việc.</p>
      `,
            importance: `
        <p><strong>1. Tầm quan trọng của huấn luyện an toàn lao động</strong></p>
        <p>An toàn lao động tại khu công nghiệp thường có tính chất nguy cơ cao và mang tính chất lâu dài. Việc huấn luyện an toàn giúp người lao động hiểu rõ các nguy cơ tiềm ẩn trong quá trình làm việc, từ đó giảm thiểu nguy cơ xảy ra tai nạn lao động.</p>
      `,
            programs: `
        <p><strong>2. Các nội dung huấn luyện an toàn lao động</strong></p>
        <p>Hiện nay, nội dung huấn luyện an toàn lao động bao gồm các vấn đề sau:</p>
        <ul>
          <li>Huấn luyện về các quy định pháp luật về an toàn lao động tại khu công nghiệp.</li>
          <li>Huấn luyện về các biện pháp phòng ngừa tai nạn lao động và bệnh nghề nghiệp.</li>
          <li>Huấn luyện về cách sử dụng trang thiết bị bảo hộ lao động và các phương tiện an toàn.</li>
        </ul>
      `,
            benefits: `
        <p><strong>3. Lợi ích của việc tham gia huấn luyện an toàn lao động</strong></p>
        <p>Việc tham gia huấn luyện an toàn lao động mang lại nhiều lợi ích cho cả người lao động và doanh nghiệp:</p>
        <ul>
          <li>Giảm thiểu tai nạn lao động: Ngăn chặn các nguy cơ tiềm ẩn trong công việc.</li>
          <li>Nâng cao ý thức làm việc: Giúp người lao động hiểu rõ trách nhiệm của mình.</li>
          <li>Tuân thủ pháp luật: Đảm bảo doanh nghiệp không vi phạm các quy định pháp luật.</li>
        </ul>
      `,
            conclusion: `
        <p><strong>Kết luận</strong></p>
        <p>Huấn luyện an toàn lao động là một phần không thể thiếu trong việc đảm bảo an toàn lao động tại khu công nghiệp. Điều này không chỉ giúp nâng cao ý thức của người lao động mà còn giúp doanh nghiệp đạt được hiệu quả sản xuất cao hơn và tuân thủ các quy định pháp luật.</p>
      `
        },
        relatedPosts: [
            {
                title: "Lợi ích của An Sạch Khi Tập Gym Ở Hồ Tấp Hiệu Quá",
                image: "https://via.placeholder.com/300x200",
                date: "06/09/2024",
                link: "#",
                description: "Thức ăn nào phù hợp với bạn để có được vòng eo thon gọn..."
            },
            {
                title: "Phục Hồi Sau Chạy Bộ; Giãn Cơ Sau Khi Chạy Trail",
                image: "https://via.placeholder.com/300x200",
                date: "06/09/2024",
                link: "#",
                description: "Bạn với hoàn toàn chạy bộ trail đúng cách và có sức khỏe..."
            }
        ]
    };

    return (
        <div className="blog-detail-wrapper">
            <div className="blog-detail-container">
                {/* Header Section */}
                <div className="blog-detail-header">
                    <img src={blog.image} alt={blog.title} className="blog-detail-image" />
                    <div className="blog-detail-meta">
                        <FaClock className="blog-detail-date-icon" />
                        <span className="blog-detail-date-text">Thứ Tư, {blog.date} 🕒 4 NĂM</span>
                    </div>
                </div>

                {/* Main Content Section */}
                <div className="blog-detail-content">
                    <h1 className="blog-detail-title">{blog.title}</h1>
                    <div className="blog-detail-body" dangerouslySetInnerHTML={{ __html: blog.content.intro }} />

                    <div className="blog-detail-section" dangerouslySetInnerHTML={{ __html: blog.content.importance }} />
                    <div className="blog-detail-section" dangerouslySetInnerHTML={{ __html: blog.content.programs }} />
                    <div className="blog-detail-section" dangerouslySetInnerHTML={{ __html: blog.content.benefits }} />
                    <div className="blog-detail-section" dangerouslySetInnerHTML={{ __html: blog.content.conclusion }} />
                </div>

                {/* Related Posts Section */}
                <div className="blog-detail-related">
                    <h2 className="blog-detail-section-title">TIN TỨC LIÊN QUAN</h2>
                    <div className="related-posts">
                        {blog.relatedPosts.map((post, index) => (
                            <div key={index} className="related-post-item">
                                <img src={"https://baoholaodonglasa.com/wp-content/uploads/2021/04/thiet-bi-bao-ho-lao-dong.webp"} alt={post.title} className="related-post-image" />
                                <div className="related-post-content">
                                    <p className="related-post-date">{post.date}</p>
                                    <h3 className="related-post-title">{post.title}</h3>
                                    <p className="related-post-description">{post.description}</p>
                                    <a href={post.link} className="related-post-link">Xem chi tiết →</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;