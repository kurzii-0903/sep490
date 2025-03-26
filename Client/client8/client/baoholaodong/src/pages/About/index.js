import React from "react";
import "./style.css";

const sections = [
    {
        title: "Về chúng tôi",
        content:
            "Được cấp phép hoạt động, Minh Xuân là đơn vị chuyên cung cấp bảo hộ lao động chất lượng và uy tín trên cả nước.",
        img: "https://static.vecteezy.com/system/resources/previews/007/933/321/non_2x/about-us-button-about-us-text-template-for-website-about-us-icon-flat-style-vector.jpg",
    },
    {
        title: "Sản phẩm và dịch vụ",
        content:
            "Chúng tôi cung cấp sản phẩm bảo hộ chất lượng, đảm bảo an toàn cho người lao động.",
        img: "https://base.vn/wp-content/uploads/2024/11/dich-vu-chuyen-nghiep-1024x576.webp",
    },
    {
        title: "Đối tác tin cậy",
        content:
            "Hợp tác với nhiều thương hiệu lớn như ProSafety, Techwear, LSS Asia...",
        img: "https://hpt.vn/Uploads/Image/doitac.png",
    },
    {
        title: "Đội ngũ nhân viên",
        content:
            "Nhân sự tận tâm, giàu kinh nghiệm, sẵn sàng phục vụ khách hàng.",
        img: "https://nhansudoanhnghiep.com/wp-content/uploads/2023/05/15-e1684737322569.png",
    },
    {
        title: "Cam kết của chúng tôi",
        content:
            "Cam kết cung cấp sản phẩm chất lượng và dịch vụ khách hàng tốt nhất.",
        img: "https://bizweb.dktcdn.net/100/067/565/files/chung-toi-cam-ket-chong-set-thu-do.jpg?v=1476327137025",
    },
];

const About = () => {
    return (
        <div className="about-container">
            <h1 className="title">
                CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI BẢO HỘ LAO ĐỘNG MINH XUÂN
            </h1>
            <p className="subtitle">
                Đồng hành cùng sự an toàn của bạn
            </p>
            {sections.map((section, index) => (
                <div
                    key={index}
                    className={`section ${index % 2 === 1 ? "reverse" : ""}`}
                >
                    <div className="text-content">
                        <h2 className="section-title">{section.title}</h2>
                        <p className="section-text">{section.content}</p>
                    </div>
                    <img
                        src={section.img}
                        alt={section.title}
                        className="image"
                    />
                </div>
            ))}
        </div>
    );
};

export default About;