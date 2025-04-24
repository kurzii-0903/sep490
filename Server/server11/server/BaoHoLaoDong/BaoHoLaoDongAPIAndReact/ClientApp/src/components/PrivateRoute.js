import { Navigate } from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const PrivateRoute = ({ element, roleRequired = [] }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		setIsLoading(true);
		const fetchUser = async () => {
			try {
				const res = await axios.get("/api/Authentication/me", {
					withCredentials: true, // ⚠️ BẮT BUỘC nếu bạn dùng cookie/session
				});
				setUser(res.data);
			} catch (error) {
				console.error("Không lấy được thông tin người dùng:", error);
			}finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, []);
	if (isLoading) return <div></div>; // hoặc spinner
	// Kiểm tra nếu chưa đăng nhập
	if (!user || !user.email || !user.token) {
		return <Navigate to="/login" replace />;
	}

	// Kiểm tra quyền truy cập (roleRequired là danh sách)
	if (roleRequired.length > 0 && !roleRequired.includes(user.role)) {
		return <Navigate to="/403" replace />;
	}

	// Nếu hợp lệ, hiển thị element
	return element;
};

export default PrivateRoute;