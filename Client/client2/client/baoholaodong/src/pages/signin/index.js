import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { AuthContext } from "../../contexts/AuthContext";
import Loading from "../../components/Loading/Loading";
import LoginGoogle from "./LoginGoogle";
const clientId ="389645565421-f4i91jcfq910iulpmps1go62ounqbnt4.apps.googleusercontent.com";
const Signin = () => {
    const [formSignin, setFormSignin] = useState({
        email: '',
        password: ''
    });
    const { user,login ,setUser} = useContext(AuthContext);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSignin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            var result = await login(formSignin.email, formSignin.password);
            setUser(result);
            if(result.role ==='Admin'){
                navigate('/manager');
            }else if(result.role ==='Customer'){
                localStorage.setItem("welcomeBack", "true");
                navigate("/");
            }
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
        }finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Loading isLoading={loading} />
            <div className="signin-form-container">
                <div className="signin-form-header">
                    <h2>ĐĂNG NHẬP</h2>
                </div>
                <form onSubmit={handleSignin} className="signin-form">
                    <div className="signin-form-group">
                        <input
                            type="email"
                            name="email"
                            value={formSignin.email}
                            onChange={(e) => setFormSignin({ ...formSignin, email: e.target.value })}
                            placeholder="Email"
                        />
                    </div>
                    <div className="signin-form-group">
                        <input
                            type="password"
                            name="password"
                            value={formSignin.password}
                            onChange={(e) => setFormSignin({ ...formSignin, password: e.target.value })}
                            placeholder="Mật khẩu"
                        />
                    </div>
                    {error && <p className="error-text">{error}</p>}
                    <button type="submit" className="signin-submit-button">Đăng nhập</button>
                </form>
                <div className="signin-links">
                    <div className="forgot-password-link">
                        <a href="/forgot-password">Quên mật khẩu?</a>
                    </div>
                    <div className="signin-link">
                        <a href="/register">Chưa có tài khoản?</a>
                    </div>
                </div>
                <div className="or-text">hoặc đăng nhập bằng</div>
                <LoginGoogle setUser={setUser} setError={setError}/>
            </div>
        </>
    );
};

export default Signin;
