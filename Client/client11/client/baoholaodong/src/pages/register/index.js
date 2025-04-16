import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import RegisterByGoogle from './RegisterByGoogle';
import { AuthContext } from '../../contexts/AuthContext';
import logo from '../../images/logo.gif';
import {getConfig} from "../../config";
import regisBG from '../../images/regisandsign-BG.jpg';


const Register = ( {config}) => {
    const BASE_URL = config.baseUrl;
    const [formRegister, setFormRegister] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        dateOfBirth: '2000-02-15',
        imageUrl: '',
        isEmailVerified: false,
        gender: true,
        address: '',
    });
    const [error, setError] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (checkFormRegister()) {
            setIsLoading(true);
            setError('');
            try {
                const response = await axios.post(
                    `${BASE_URL}/api/Authentication/authenticate/registerby-email-password`,
                    formRegister
                );
                if (response.data !== null) {
                    navigate(`/verification?email=${response.data.email}&&verifyCode`);
                }
            } catch (err) {
                setError(err.response?.data || 'Thông tin đăng ký không hợp lệ.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const checkFormRegister = () => {
        const { fullName, email, phoneNumber, password } = formRegister;

        if (!fullName.trim()) {
            setError('Họ và tên không được để trống.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Email không hợp lệ.');
            return false;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setError('Số điện thoại không hợp lệ. Phải có đúng 10 chữ số.');
            return false;
        }

        if (password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            setError('Mật khẩu phải có ít nhất 6 ký tự, gồm cả chữ và số.');
            return false;
        }
        if (password !== passwordConfirm) {
            setError('Mật khẩu nhập lại không chính xác');
            return false;
        }
        setError('');
        return true;
    };

    return (
        <>
            <Loading isLoading={isLoading} />
            <div className="h-screen w-screen flex overflow-hidden">
                {/* Form Section */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 bg-white overflow-y-auto">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-4 sm:mb-6">
                            <img
                                src={logo}
                                alt="Bảo hộ lao động Minh Xuân"
                                className="h-16 sm:h-20 mx-auto mb-2 sm:mb-3"
                            />
                            <h1 className="text-red-600 text-base sm:text-lg font-semibold">
                                BẢO HỘ LAO ĐỘNG MINH XUÂN
                            </h1>
                            <Link
                                to="/"
                                className="inline-block mt-2 px-3 sm:px-4 py-1 sm:py-2 bg-gray-200 text-gray-800 text-sm sm:text-base rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Quay về trang chủ
                            </Link>
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-center text-red-600 mb-4 sm:mb-6">
                            Đăng ký tài khoản
                        </h2>
                        <p className="text-center text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                            Đã có tài khoản?{' '}
                            <a href="/login" className="text-blue-600 hover:underline">
                                Đăng nhập tại đây
                            </a>
                        </p>
                        {error && (
                            <div className="text-center text-xs sm:text-sm text-red-500 mb-4">{error}</div>
                        )}
                        <form className="space-y-3 sm:space-y-4" onSubmit={handleRegister}>
                            <div>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formRegister.fullName}
                                    onChange={(e) =>
                                        setFormRegister({ ...formRegister, fullName: e.target.value })
                                    }
                                    placeholder="Họ và Tên"
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="address"
                                    value={formRegister.address}
                                    onChange={(e) =>
                                        setFormRegister({ ...formRegister, address: e.target.value })
                                    }
                                    placeholder="Địa chỉ"
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formRegister.email}
                                    onChange={(e) =>
                                        setFormRegister({ ...formRegister, email: e.target.value })
                                    }
                                    placeholder="Email"
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formRegister.phoneNumber}
                                    onChange={(e) =>
                                        setFormRegister({ ...formRegister, phoneNumber: e.target.value })
                                    }
                                    placeholder="Số điện thoại"
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formRegister.password}
                                    onChange={(e) =>
                                        setFormRegister({ ...formRegister, password: e.target.value })
                                    }
                                    placeholder="Mật khẩu"
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    name="passwordConfirm"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    placeholder="Nhập lại mật khẩu"
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                            >
                                Đăng ký
                            </button>
                        </form>
                        <div className="text-center text-xs sm:text-sm text-gray-500 my-3 sm:my-4">
                            hoặc đăng nhập bằng
                        </div>
                        <RegisterByGoogle setUserData={setUser} />
                    </div>
                </div>
                {/* Image Section */}
                <div
                    className="hidden lg:block w-1/2 bg-cover bg-center relative"
                    style={{
                        backgroundImage:
                            `url(${regisBG})`,
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="text-center text-white p-6">
                            <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                                Bảo hộ lao động Minh Xuân
                            </h3>
                            <p className="text-xs sm:text-sm">
                                Luôn đem lại an toàn và hoàn hảo nhất cho bạn!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;