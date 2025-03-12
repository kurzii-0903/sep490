import React, { useEffect } from "react";
import "./style.css";

const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="toast">
            <img src="https://cdn-icons-png.flaticon.com/512/7518/7518748.png" alt="Success" className="toast-image" />
            <p>{message}</p>
        </div>
    );
};

export default Toast;