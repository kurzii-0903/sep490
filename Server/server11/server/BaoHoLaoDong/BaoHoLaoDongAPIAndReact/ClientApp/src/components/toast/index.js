import React, { useEffect } from "react";
import "./style.css";
import SuccessIcon from "../../images/successBlue.png";

const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="toast">
            <img src={SuccessIcon} alt="Success" className="toast-image" />
            <p>{message}</p>
        </div>
    );
};

export default Toast;