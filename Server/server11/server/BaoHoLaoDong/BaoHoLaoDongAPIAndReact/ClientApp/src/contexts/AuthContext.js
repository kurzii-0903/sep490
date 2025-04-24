import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const res = await axios.get("/api/Authentication/me", {
                withCredentials: true,
            });
            setUser(res.data);
            return res.data;
        } catch (error) {
            console.error("Không lấy được thông tin người dùng:", error);
            setUser(null);
            return null;
        }
    };

    useEffect(() => {
        fetchUser(); // Gọi fetchUser khi khởi tạo để kiểm tra session
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(
                `/api/Authentication/authenticate/loginby-email-password`,
                { email, password },
                { withCredentials: true }
            );
            if (response.data) {
                await fetchUser(); // Đồng bộ trạng thái từ server
                return response.data;
            }
            throw new Error("Đăng nhập thất bại");
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            throw new Error("Email hoặc mật khẩu không chính xác!");
        }
    };

    const logout = async () => {
        try {
            await axios.post(`/api/Authentication/logout`, {}, { withCredentials: true });
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Đăng xuất thất bại:", error);
            throw new Error("Đăng xuất thất bại!");
        }
    };

    const LoginGoogle = ({ setUser: setExternalUser, setError }) => {
        const onSuccess = async (googleResponse) => {
            try {
                const { credential } = googleResponse;
                const res = await axios.post(
                    `/api/Authentication/authenticate/loginby-google`,
                    { googleToken: credential },
                    { headers: { "Content-Type": "application/json" }, withCredentials: true }
                );
                const decodedToken = jwtDecode(credential);
                if (res.status === 200) {
                    const userData = { ...res.data, imageUrl: decodedToken.picture };
                    setUser(userData);
                    setExternalUser?.(userData);
                    await fetchUser(); // Đồng bộ trạng thái từ server
                    navigate(userData.role === "Admin" || userData.role === "Manager" ? "/manager" : "/");
                }
            } catch (e) {
                setError("Đăng nhập không thành công");
            }
        };

        const onFailure = (error) => {
            console.log("Đăng nhập thất bại:", error);
        };

        return (
            <div className="signInButton">
                <GoogleLogin onSuccess={onSuccess} onError={onFailure} />
            </div>
        );
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser, LoginGoogle, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};