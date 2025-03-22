import React from "react";

export const Error403 = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-6xl font-bold text-red-600">403</h1>
            <h2 className="text-2xl font-semibold mt-4">Forbidden</h2>
            <p className="text-gray-600 mt-2">Bạn không có quyền truy cập vào trang này.</p>
            <a href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Quay lại trang chủ</a>
        </div>
    );
};

export const Error503 = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-6xl font-bold text-yellow-600">503</h1>
            <h2 className="text-2xl font-semibold mt-4">Service Unavailable</h2>
            <p className="text-gray-600 mt-2">Máy chủ đang bảo trì. Vui lòng thử lại sau.</p>
        </div>
    );
};

export const Error404 = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-6xl font-bold text-gray-700">404</h1>
            <h2 className="text-2xl font-semibold mt-4">Không tìm thấy trang</h2>
            <p className="text-gray-600 mt-2">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <a href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Quay lại trang chủ</a>
        </div>
    );
};
