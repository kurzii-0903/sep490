import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';
import Loading from "../../components/Loading/Loading";
import RegisterByGoogle from "./RegisterByGoogle";
import {AuthContext} from "../../contexts/AuthContext";
const apiUrl = process.env.REACT_APP_BASE_URL_API;

const Register = () => {
    const [formRegister, setFormRegister] = useState({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        dateOfBirth: "2000-02-15",
        imageUrl: "",
        isEmailVerified: false,
        gender: true,
        address: ""
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const {setUser} = useContext(AuthContext);
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const handleRegister = async (e) => {
        e.preventDefault();
        if(checkFormRegister()){
            setIsLoading(true);
            setError(""); // Reset lỗi trước khi gửi request
            try {
                var response = await axios.post(`${apiUrl}/api/Authentication/authenticate/registerby-email-password`, formRegister);
                if (response.data !== null) {
                    navigate(`/verification?email=${response.data.email}&&verifyCode`);
                }
            } catch (err) {
                setError(err.response.data || "Thông tin đăng ký không hợp lệ.");
            } finally {
                setIsLoading(false);
            }
        }else{
            return;
        }
    };
    const checkFormRegister = () => {
        const { fullName, email, phoneNumber, password } = formRegister;

        if (!fullName.trim()) {
            setError("Họ và tên không được để trống.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Email không hợp lệ.");
            return false;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setError("Số điện thoại không hợp lệ. Phải có đúng 10 chữ số.");
            return false;
        }

        if (password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            setError("Mật khẩu phải có ít nhất 6 ký tự, gồm cả chữ và số.");
            return false;
        }
        if(password!==passwordConfirm){
            setError("Mật khẩu nhập lại không chính xác");
            return false;
        }
        setError(""); // Nếu không có lỗi, reset lỗi
        return true;
    };
    return (
        <>
            <Loading isLoading={isLoading}/>
            <div className="form-container">
                <div className="form-header">
                    <h2>Đăng ký</h2>
                </div>
                <div className="login-link">
                    <p>Đã có tài khoản, đăng nhập <a href="/login">tại đây</a></p>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form className="form">
                    <div className="form-group">
                        <input
                            type="text"
                            name="fullName"
                            value={formRegister.fullName}
                            onChange={(e) => setFormRegister({...formRegister, name: e.target.value})}
                            placeholder="Họ và Tên"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="address"
                            value={formRegister.address}
                            onChange={(e) => setFormRegister({...formRegister, address: e.target.value})}
                            placeholder="Địa chỉ"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={formRegister.email}
                            onChange={(e) => setFormRegister({...formRegister, email: e.target.value})}
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formRegister.phoneNumber}
                            onChange={(e) => setFormRegister({...formRegister, phoneNumber: e.target.value})}
                            placeholder="Số điện thoại"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            value={formRegister.password}
                            onChange={(e) => setFormRegister({...formRegister, password: e.target.value})}
                            placeholder="Mật khẩu"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="passwordConfirm"
                            value={passwordConfirm}
                            onChange={(e) => {setPasswordConfirm(e.target.value)}}
                            placeholder="Mật lại khẩu"
                        />
                    </div>
                    <button type="button" onClick={(e) => {
                        handleRegister(e)
                    }} className="submit-button">Đăng ký
                    </button>
                </form>
                <div className="or-text">hoặc đăng nhập bằng</div>
                <RegisterByGoogle setUserData={setUser}/>
            </div>
        </>
    );
};

export default Register;
