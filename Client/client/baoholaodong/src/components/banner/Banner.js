import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 7000,
    };

    const images = [
        "http://baoholaodongminhxuan.com/images/common/slider1.jpg",
        "http://baoholaodongminhxuan.com/images/common/slider2.jpg",
        "http://baoholaodongminhxuan.com/images/common/slider3.jpg",
    ];

    return (
        <div className="banner">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index}>
                        <img src={image} alt={`Slide ${index + 1}`} className="w-full" />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Banner;