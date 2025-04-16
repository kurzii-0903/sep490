"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"

const VerificationPage = ({config}) => {
    const BASE_URL = config.baseUrl;
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const email = searchParams.get("email")
    const verificationCode = searchParams.get("code")

    const [verification, setVerification] = useState({
        email: email || "",
        verificationCode: verificationCode || "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setVerification({
            email: email || "",
            verificationCode: verificationCode || "",
        })
    }, [email, verificationCode])

    const handleChange = (e) => {
        setVerification({ ...verification, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await axios.post(`${BASE_URL}/api/Authentication/confirm-email`, {
                email: verification.email,
                code: verification.verificationCode,
            })
            if (response.status === 200 && response.data !== null) {
                navigate("/login")
            }
        } catch (err) {
            console.error("Verification failed:", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100 transition-all duration-300 hover:shadow-lg mx-4">
                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-emerald-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Account Verification</h2>
                <p className="text-gray-500 text-center mb-6">Enter your details to verify your account</p>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-sm">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                    />
                                </svg>
                            </div>
                            <input
                                type="email"
                                id="email"
                                value={verification.email}
                                name="email"
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="verificationCode" className="block text-gray-700 font-medium mb-2 text-sm">
                            Verification Code
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="verificationCode"
                                value={verification.verificationCode}
                                name="verificationCode"
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                placeholder="Enter verification code"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 ${
                            isSubmitting
                                ? "bg-emerald-400 cursor-not-allowed"
                                : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 hover:shadow-md"
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Verifying...
                            </div>
                        ) : (
                            "Verify Account"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Didn't receive a code?{" "}
                        <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                            Resend code
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VerificationPage
