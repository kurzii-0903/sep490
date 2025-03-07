import React, { useContext, useEffect, useState } from "react";
import {CustomerProductContext} from "../../contexts/CustomerProductContext";
import Banner from "../../components/banner/Banner";
import DiscountedProducts from "../../components/discountedproducts";
import Products from "../../components/products";
import Feedbacks from "../../components/feedbacks";
import NewBlog from "../../components/newblog";
import TopSaleProducts from "./TopSaleProducts";

function Index() {
    const { topSaleProducts } = useContext(CustomerProductContext);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("welcomeBack") === "true") {
            setShowWelcome(true);
            localStorage.removeItem("welcomeBack"); // Xóa sau khi hiển thị 1 lần
            setTimeout(() => setShowWelcome(false), 3000); // Tự động ẩn sau 3s
        }
    }, []);

    return (
        <div>
            {showWelcome && <div className="welcome-message">🎉 Welcome back!</div>}
            <Banner />
            <DiscountedProducts />
            <TopSaleProducts products={topSaleProducts} title="TOP SẢN PHẨM BÁN CHẠY" />
            <Feedbacks />
            <NewBlog />
        </div>
    );
}

export default Index;
