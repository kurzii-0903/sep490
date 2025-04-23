import React from "react";
import "./style.css";
import PageWrapper from "../../components/pageWrapper/PageWrapper";
import aboutUsImage from "../../images/about-us.jpg";
import serviceImage from "../../images/sanpham-dichvu.png";
import partnerImage from "../../images/doitac.png";
import teamImage from "../../images/doingunhanvien.png";
import commitmentImage from "../../images/cam-ket.png";

const sections = [
    {
        title: "Về chúng tôi",
        content:
            "Được cấp phép hoạt động, Minh Xuân là đơn vị chuyên cung cấp bảo hộ lao động chất lượng và uy tín trên cả nước.",
        img: aboutUsImage,
    },
    {
        title: "Sản phẩm và dịch vụ",
        content:
            "Chúng tôi cung cấp sản phẩm bảo hộ chất lượng, đảm bảo an toàn cho người lao động.",
        img: serviceImage,
    },
    {
        title: "Đối tác tin cậy",
        content:
            "Hợp tác với nhiều thương hiệu lớn như ProSafety, Techwear, LSS Asia...",
        img: partnerImage,
    },
    {
        title: "Đội ngũ nhân viên",
        content:
            "Nhân sự tận tâm, giàu kinh nghiệm, sẵn sàng phục vụ khách hàng.",
        img: teamImage ,
    },
    {
        title: "Cam kết của chúng tôi",
        content:
            "Cam kết cung cấp sản phẩm chất lượng và dịch vụ khách hàng tốt nhất.",
        img: commitmentImage,
    },
];

const About = ({config}) => {
    return (
        <PageWrapper title="Về chúng tôi">
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
        </PageWrapper>
    );
};

export default About;