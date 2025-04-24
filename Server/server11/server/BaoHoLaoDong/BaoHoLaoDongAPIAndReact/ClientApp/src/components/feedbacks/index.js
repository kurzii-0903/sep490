import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {DisplayContent} from "../TextEditor";
import feedbackBackground from "../../images/feedback-bg.jpg";

const FeedbacksStepSlide = ({blogpost =[]}) => {
    const [perPage, setPerPage] = useState(4);
    const [startIndex, setStartIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setPerPage(window.innerWidth < 1024 ? 1 : 4);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const canNext = startIndex + perPage < blogpost.length;
    const canPrev = startIndex > 0;

    const handleNext = () => {
        if (canNext) {
            setDirection(1);
            setStartIndex(startIndex + 1);
        }
    };

    const handlePrev = () => {
        if (canPrev) {
            setDirection(-1);
            setStartIndex(startIndex - 1);
        }
    };

    const visibleTestimonials = blogpost.slice(startIndex, startIndex + perPage);

    return (
        <section
            className="relative py-16 px-4 text-white bg-no-repeat bg-center bg-auto"
            style={{ backgroundImage:  `url(${feedbackBackground})` }}

        >
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>
            <div className="relative max mx-auto z-10">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold uppercase text-left mb-2 text-red-700">
                            KHÁCH HÀNG NÓI VỀ CHÚNG TÔI
                        </h2>
                        <p className="text-sm text-gray-300 max-w-xl text-left">
                            Hơn +50,000 khách hàng cảm nhận như thế nào về Bảo hộ lao động Minh Xuân.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={!canPrev}
                            className="w-9 h-9 flex items-center justify-center bg-white text-black rounded-full disabled:opacity-50"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!canNext}
                            className="w-9 h-9 flex items-center justify-center bg-white text-black rounded-full disabled:opacity-50"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={startIndex}
                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                        transition={{ duration: 0.4 }}
                        className={`grid grid-cols-1 ${perPage >= 4 ? "lg:grid-cols-4" : ""} gap-6`}
                    >
                        {visibleTestimonials.map(({title,summary,content,imageUrl}, index) => (
                            <div
                                key={index}
                                className="relative bg-white text-black p-6 rounded-lg shadow-lg text-left"
                            >
                                <div className="absolute top-6 right-6 text-6xl text-gray-200 leading-none select-none">
                                    &rdquo;
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={imageUrl}
                                        alt={title}
                                        className="w-14 h-14 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-bold">{title}</h4>
                                        <span className="text-sm text-gray-500">{summary}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700">
                                    <DisplayContent content={content} />
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default FeedbacksStepSlide;