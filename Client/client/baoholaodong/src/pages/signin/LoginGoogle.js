import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie"; // Cần cài đặt thư viện này: npm install jwt-decode

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

function LoginGoogle({ setUser ,setError}) {
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

export default LoginGoogle;
