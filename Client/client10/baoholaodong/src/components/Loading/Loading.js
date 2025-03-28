import React from "react";

const Loading = ({ isLoading }) => {
    if (!isLoading) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-[9999]">
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="text-lg font-semibold">Loading ...</span>
            </div>
        </div>
    );
};

export default Loading;
