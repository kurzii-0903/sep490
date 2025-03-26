import React, { useEffect } from "react";
import "./style.css";
import { CheckCircle, XCircle, X } from "lucide-react"; // Sử dụng icon từ lucide-react

const ManagerToast = ({ message, onClose, type = "success" }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`manager-toast ${type}`}>
            <div className="toast-content">
                {type === "success" ? (
                    <CheckCircle className="toast-icon" />
                ) : (
                    <XCircle className="toast-icon" />
                )}
                <p className="toast-message">{message}</p>
                <button className="toast-close" onClick={onClose}>
                    <X size={16} />
                </button>
            </div>
            <div className="toast-progress" />
        </div>
    );
};

export default ManagerToast;