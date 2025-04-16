import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Banner = ({config}) => {
    const BASE_URL = config.baseUrl;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [banners, setBanners] = useState([]);
    const bannerRef = useRef(null); // Ref để truy cập container .banner-main

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };
    const fetchBanners = async () => {
        try{
            const response = await axios.get(`${BASE_URL}/api/BlogPost/get-blog-by-category/banner`)
            setBanners(response.data);
            console.log(response.data);
        }catch (e){
        }
    }

    // Điều chỉnh aspect-ratio dựa trên ảnh hiện tại
    useEffect(() => {
        if (banners.length === 0 || !bannerRef.current) return;

        const currentBanner = banners[currentIndex];
        const img = new Image();
        img.src = currentBanner.imageUrl;

        img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            if (bannerRef.current) {
                bannerRef.current.style.aspectRatio = `${aspectRatio}`; // Đặt aspect-ratio động
            }
        };
    }, [currentIndex, banners]);


    useEffect(() => {
        if (banners.length === 0) return;

        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [currentIndex, banners.length]);

    useEffect(() => {
        if (banners.length === 0) {
            fetchBanners();
        }
    }, [banners]);


    return (
        <div
            ref={bannerRef}
            className="banner-main relative w-full overflow-hidden"
        >
            {banners.length > 0 ? (
                banners.map(({ imageUrl, postUrl }, index) => (
                    <a
                        href={postUrl}
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    >
                        <img
                            src={imageUrl}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-contain object-center"
                            onError={(e) => {
                                e.target.src = "/fallback.jpg"; // Ảnh mặc định nếu bị lỗi
                            }}
                        />
                    </a>
                ))
            ) : (
                <p className="text-center text-gray-500">Không có banner nào để hiển thị.</p>
            )}
        </div>
    );

};

export default Banner;
