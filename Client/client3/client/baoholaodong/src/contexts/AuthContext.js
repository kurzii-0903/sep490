import {createContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {GoogleLogin} from "@react-oauth/google";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

// Tạo context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Lấy user từ Cookies nếu có, nếu không thì null
    const [user, setUser] = useState(() => {
        try {
            const storedUser = Cookies.get("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Lỗi khi đọc Cookies:", error);
            return null;
        }
    });

    // Hàm login
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/Authentication/authenticate/loginby-email-password`, {
                email,
                password,
            });

            if (response.data) {
                setUser(response.data); // Cập nhật state
                Cookies.set("user", JSON.stringify(response.data), { expires: 1 }); // Lưu Cookies (hết hạn sau 1 ngày)
            }
            return response.data;
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            throw new Error("Email hoặc mật khẩu không chính xác!");
        }
    };

    // Hàm logout
    const logout = () => {
        setUser(null); // Reset state
        Cookies.remove("user"); // Xóa Cookies
    };
    const LoginGoogle=({ setUser ,setError})=> {
        const navigate = useNavigate();

        const onSuccess = async (googleResponse) => {
            try {
                const { credential } = googleResponse;
                const res = await axios.post(`${BASE_URL}/api/Authentication/authenticate/loginby-google`,
                    { googleToken: credential }, // Đưa vào object thay vì gửi trực tiếp
                    { headers: { "Content-Type": "application/json" } }
                );
                const decodedToken = jwtDecode(credential);
                if(res.status === 200){
                    const user = res.data;
                    user.imageUrl = decodedToken.picture;
                    setUser(user);
                    Cookies.set("user", JSON.stringify(user), { expires: 1 });
                    if(res.data.role === "Admin"){
                        navigate("/manager");
                    }else{
                        navigate("/");
                    }
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
    }
    return (
        <AuthContext.Provider value={{ user, login, logout, setUser,LoginGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};