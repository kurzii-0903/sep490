import React, { useState, useEffect } from 'react';
import { KeyRound, ArrowLeft, Loader2, Eye, EyeOff, Clock } from 'lucide-react';
import axios from "axios";

const queryParams = new URLSearchParams(window.location.search);
const BASE_URL = process.env.REACT_APP_BASE_URL_API;

function ResetPassword() {
    const [timeLeft, setTimeLeft] = useState(3000); // 5 minutes in seconds
    const [formData, setFormData] = useState({
        token: queryParams.get('token') || "",
        email: queryParams.get('email') || "",
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const timeStr = queryParams.get('time');
        if (timeStr) {
            const expiryTime = new Date(timeStr).getTime();
            const now = new Date().getTime();
            const difference = Math.floor((expiryTime - now) / 1000);

            if (difference <= 0) {
                setIsExpired(true);
                return;
            }

            setTimeLeft(difference);
        }
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsExpired(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const validatePassword = (password: string) => {
        return password.length >= 8 && // at least 8 characters
            /[A-Z]/.test(password) && // at least one uppercase
            /[a-z]/.test(password) && // at least one lowercase
            /[0-9]/.test(password) && // at least one number
            /[^A-Za-z0-9]/.test(password); // at least one special character
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isExpired) {
            setError('Reset password link has expired. Please request a new one.');
            return;
        }

        if (!validatePassword(formData.password)) {
            setError('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/api/Authentication/authenticate/reset-password`, formData);
            if(response.status === 200) {
                setIsSuccess(true);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
                        <p className="text-gray-600 mb-6">
                            Your password has been successfully reset. You can now log in with your new password.
                        </p>
                        <a
                            href="/login"
                            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Go to Login
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (isExpired) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h2>
                        <p className="text-gray-600 mb-6">
                            This password reset link has expired. Please request a new password reset link.
                        </p>
                        <a
                            href="/forgot-password"
                            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Request New Link
                        </a>
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
                        <KeyRound className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                    <p className="text-gray-600 mt-2">
                        Please enter your new password below
                    </p>
                    <div className="mt-4 flex items-center justify-center text-sm">
                        <Clock className="w-4 h-4 text-indigo-600 mr-2" />
                        <span className="font-medium">Time remaining: </span>
                        <span className="ml-1 text-indigo-600 font-bold">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-12"
                                placeholder="Enter new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-12"
                                placeholder="Confirm new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!formData.password || !formData.confirmPassword || isLoading}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center
              ${
                            formData.password && formData.confirmPassword && !isLoading
                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                : 'bg-gray-400 cursor-not-allowed'
                        } transition-colors`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Resetting password...
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

export default ResetPassword;