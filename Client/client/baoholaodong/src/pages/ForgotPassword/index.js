import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL_API;
function Index() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${BASE_URL}/api/Authentication/authenticate/request-reset-password?email=${email}`
            );
            if (response.status === 200) {
                setIsSuccess(true);
            }
        } catch (err) {
            if (err.response) { // Kiểm tra nếu có response từ server
                if (err.response.status === 404) {
                    setError("Không tìm thấy email: " + email);
                } else {
                    setError("Đã xảy ra lỗi: " + err.response.data);
                }
            } else {
                setError("Lỗi kết nối đến server");
            }
        }
        finally {
            setIsLoading(false);
        }
    };


    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                        <p className="text-gray-600 mb-6">
                            We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
                        </p>
                        <button
                            onClick={() => {
                                setIsSuccess(false);
                                setEmail('');
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center mx-auto"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to reset password
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                    <p className="text-gray-600 mt-2">
                        No worries! Enter your email and we'll send you reset instructions.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!validateEmail(email) || isLoading}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center
              ${
                            validateEmail(email) && !isLoading
                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                : 'bg-gray-400 cursor-not-allowed'
                        } transition-colors`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Sending instructions...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </button>

                    <div className="text-center">
                        <a
                            href="/login"
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Back to login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Index;