import React, { useState, useEffect } from "react";
import "./Banner.css";

const Banner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const banners = [
        {
            image: "http://baoholaodongminhxuan.com/images/common/slider1.jpg",
            link: "/product/1"
        },
        {
            image: "http://baoholaodongminhxuan.com/images/common/slider2.jpg",
            link: "/product/2"
        },
        {
            image: "http://baoholaodongminhxuan.com/images/common/slider3.jpg",
            link: "/product/3"
        },
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    return (
        <div className="banner-main">
            <button className="prev" onClick={prevSlide}>❮</button>
            {banners.map((banner, index) => (
                <a href={banner.link} key={index}>
                    <img
                        src={banner.image}
                        alt={`Slide ${index + 1}`}
                        className={index === currentIndex ? "active" : ""}
                    />
                </a>
            ))}
            <button className="next" onClick={nextSlide}>❯</button>
        </div>
    );
};

export default Banner;