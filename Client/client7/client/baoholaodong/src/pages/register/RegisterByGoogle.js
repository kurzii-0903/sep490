import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
const BASE_URL = process.env.REACT_APP_BASE_URL_API;

function RegisterByGoogle({ setUserData }) {
    const navigate = useNavigate();
    const onSuccess = async (googleResponse) => {
        try {
            // Giải mã token để lấy thông tin người dùng
            const { credential } = googleResponse;
            const response = await axios.post(`${BASE_URL}/api/Authentication/authenticate/registerby-google`,
                {googleToken:credential});
            if(response.status === 200 || response.data !==null) {
                setUserData(response.data);
                Cookies.set("user", JSON.stringify(response.data), { expires: 1 });
                navigate('/');
            }
        } catch (error) {
            console.error("Lỗi khi xử lý đăng ký:", error);
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

export default RegisterByGoogle;
