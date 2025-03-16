import React, { useEffect, useState } from "react";

const ErrorList = ({ errors = [] }) => {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(100);
    const [fadingOut, setFadingOut] = useState(false);

    useEffect(() => {
        if (errors.length > 0) {
            setVisible(true);
            setFadingOut(false);
            setProgress(90);

            // Sau 3s bắt đầu mờ dần
            const timer = setTimeout(() => {
                setFadingOut(true);
                // Sau 0.5s (khớp với CSS transition), ẩn hoàn toàn
                setTimeout(() => {
                    setVisible(false);
                }, 500);
            }, 3000);

            // Thanh tiến trình giảm dần
            const progressInterval = setInterval(() => {
                setProgress((prev) => Math.max(prev - 3, 0));
            }, 100);

            return () => {
                clearTimeout(timer);
                clearInterval(progressInterval);
            };
        }
    }, [errors]);

    if (!visible || !Array.isArray(errors) || errors.length === 0) return null;

    return (
        <div
            style={{
                zIndex: 1000,
                transform: fadingOut ? "translateX(100%)" : "translateX(0)",
                opacity: fadingOut ? 0 : 1,
                transition: "transform 0.5s ease-in-out, opacity 0.5s ease-in-out",
            }}
            className="fixed top-20 right-4 w-96 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg"
        >
            <strong className="block font-bold">Lỗi xảy ra:</strong>
            <ul className="list-disc pl-5 mt-2">
                {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>

            {/* Thanh tiến trình */}
            <div className="w-full h-1 bg-red-300 mt-3 rounded overflow-hidden">
                <div
                    className="h-full bg-red-500 transition-all"
                    style={{
                        width: `${progress}%`,
                        transition: "width 0.1s linear",
                    }}
                ></div>
            </div>
        </div>
    );
};

export default ErrorList;
