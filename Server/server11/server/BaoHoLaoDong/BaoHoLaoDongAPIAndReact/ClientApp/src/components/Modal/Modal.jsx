import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children, title, noFull = true }) => {
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        >
            <div
                className={`bg-white shadow-xl transform transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-95 opacity-0'} 
                ${noFull
                    ? "w-3/4 max-w-4xl max-h-[90vh] rounded-lg p-6 overflow-y-auto"
                    : "w-[95vw] h-[95vh] max-w-none max-h-none overflow-hidden rounded-lg"}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center border-b p-4 ">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className={`p-6 ${noFull ? "overflow-y-auto max-h-[70vh]" : "overflow-auto h-[calc(95vh-64px)]"}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
