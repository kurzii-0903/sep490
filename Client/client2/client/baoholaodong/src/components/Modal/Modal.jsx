import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children, title }) => {
    const [isVisible, setIsVisible] = useState(isOpen);

    // Khi isOpen thay đổi, thêm hiệu ứng đóng/mở modal
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300); // Thời gian hiệu ứng đóng
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        >
            <div
                className={`bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-95 opacity-0'}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Body - Cuộn khi nội dung quá dài */}
                <div className="mt-4 overflow-y-auto max-h-[70vh]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
