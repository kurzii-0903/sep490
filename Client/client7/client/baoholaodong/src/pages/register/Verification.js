import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

const VerificationPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const verificationCode = searchParams.get("code"); // Đổi từ verifyCode thành code

    const [verification, setVerification] = useState({
        email: email || "",
        verificationCode: verificationCode || "",
    });

    useEffect(() => {
        setVerification({
            email: email || "",
            verificationCode: verificationCode || "",
        });
    }, [email, verificationCode]);

    const handleChange = (e) => {
        setVerification({ ...verification, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/api/user/confirm-email`, {
                email: verification.email,
                code: verification.verificationCode
            });
            if (response.status === 200 && response.data !== null) {
                navigate("/login");
            }
        } catch (err) {
            console.error("Verification failed:", err);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Account Verification</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={verification.email}
                            name="email"
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="verificationCode" className="block text-gray-700 font-bold mb-2">Verification Code</label>
                        <input
                            type="text"
                            id="verificationCode"
                            value={verification.verificationCode}
                            name="verificationCode"
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter verification code"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition duration-300">
                        Verify Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerificationPage;
