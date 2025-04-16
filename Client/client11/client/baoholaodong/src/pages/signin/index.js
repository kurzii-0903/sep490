import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../../components/Loading/Loading";
import logo from '../../images/logo.gif';
import regisBG from '../../images/regisandsign-BG.jpg';

const Signin = ({config}) => {
    const [formSignin, setFormSignin] = useState({
        email: '',
        password: ''
    });
    const { login, setUser, LoginGoogle } = useContext(AuthContext);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSignin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let result = await login(formSignin.email, formSignin.password);
            setUser(result);
            if (result.role === 'Admin' || result.role === 'Manager') {
                navigate('/manager');
            } else if (result.role === 'Customer') {
                localStorage.setItem("welcomeBack", "true");
                navigate("/");
            }
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Loading isLoading={loading} />
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
                            Đăng nhập
                        </h2>
                        {error && (
                            <div className="text-center text-xs sm:text-sm text-red-500 mb-4">{error}</div>
                        )}
                        <form className="space-y-3 sm:space-y-4" onSubmit={handleSignin}>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formSignin.email}
                                    onChange={(e) => setFormSignin({ ...formSignin, email: e.target.value })}
                                    placeholder="Email"
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formSignin.password}
                                    onChange={(e) => setFormSignin({ ...formSignin, password: e.target.value })}
                                    placeholder="Mật khẩu"
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                            >
                                Đăng nhập
                            </button>
                        </form>
                        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
                            <a href="/forgot-password" className="text-blue-600 hover:underline">
                                Quên mật khẩu?
                            </a>
                            <a href="/register" className="text-blue-600 hover:underline">
                                Chưa có tài khoản?
                            </a>
                        </div>
                        <div className="text-center text-xs sm:text-sm text-gray-500 my-3 sm:my-4">
                            hoặc đăng nhập bằng
                        </div>
                        <LoginGoogle setUser={setUser} setError={setError} />
                    </div>
                </div>
                {/* Image Section */}
                <div
                    className="hidden md:block w-1/2 bg-cover bg-center relative"
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

export default Signin;