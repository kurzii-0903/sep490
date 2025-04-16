import React, { useContext, useEffect, useState } from "react";
import { CustomerProductContext } from "../../contexts/CustomerProductContext";
import Banner from "../../components/banner/Banner";
import Feedbacks from "../../components/feedbacks";
import NewBlog from "../../components/newblog";
import TopSaleProducts from "./TopSaleProducts";
import TopDealProducts from "./TopDealProducts";
import StoreLocation from "../../components/StoreLocation";
import PageWrapper from "../../components/pageWrapper/PageWrapper";

import "./home.css";
import axios from "axios";

function Index({config}) {
    const BASE_URL = config.baseUrl;
    const [showWelcome, setShowWelcome] = useState(false);
    const [topSaleProducts, setTopSaleProducts] = useState([]);
    const [topDealProducts, setTopDealProducts] = useState([]);
    const [customerSayAboutUs, setCustomerSayAboutUs] = useState([]);

    useEffect(() => {
        if (localStorage.getItem("welcomeBack") === "true") {
            setShowWelcome(true);
            localStorage.removeItem("welcomeBack");
            setTimeout(() => setShowWelcome(false), 3000);
        }
    }, []);

    const fetchProductsByTopic = async (topic, page = 1, size = 20) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/Product/get-products-by-topic`, {
                params: {
                    topic: topic,
                    page: page,
                    size: size,
                },
            });
            return response.data || [];
        } catch (error) {
            console.error(`Lỗi khi lấy dữ liệu ${topic}:`, error);
            return [];
        }
    };

    const fetchCustomerSayAboutUs = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/BlogPost/get-blog-by-category/khach-hang-noi-ve-chung-toi`);
            setCustomerSayAboutUs(response.data);
        } catch (e) {
            console.error("Lỗi khi lấy dữ liệu khách hàng nói về chúng tôi:", e);
        }
    };

    useEffect(() => {
        fetchProductsByTopic("top_sale").then((data) => setTopSaleProducts(data));
        fetchProductsByTopic("top_deal").then((data) => setTopDealProducts(data));
    }, []);

    useEffect(() => {
        if (customerSayAboutUs.length === 0) {
            fetchCustomerSayAboutUs();
        }
    }, [customerSayAboutUs]);

    return (
        <PageWrapper title="Bảo hộ lao động Minh Xuân">
            <div className="home-container">
                {showWelcome && <div className="welcome-message">🎉 Welcome back!</div>}
                <Banner config={config} />
                <TopDealProducts products={topDealProducts} config={config} />
                <TopSaleProducts products={topSaleProducts} config={config} title="TOP SẢN PHẨM BÁN CHẠY" />
                <Feedbacks blogpost={customerSayAboutUs}  />
                <NewBlog config={config} />
                <StoreLocation  config={config}/> {/* Thêm component StoreLocation */}
            </div>
        </PageWrapper>
    );
}

export default Index;