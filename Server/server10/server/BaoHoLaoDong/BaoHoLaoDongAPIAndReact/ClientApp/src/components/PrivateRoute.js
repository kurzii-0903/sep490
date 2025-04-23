import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ element, roleRequired = [] }) => {
	const { user } = useContext(AuthContext);
	// Kiểm tra nếu chưa đăng nhập
	if (!user || !user.email || !user.token) {
		return <Navigate to="/404" replace />;
	}

	// Kiểm tra quyền truy cập (roleRequired là danh sách)
	if (roleRequired.length > 0 && !roleRequired.includes(user.role)) {
		return <Navigate to="/403" replace />;
	}

	// Nếu hợp lệ, hiển thị element
	return element;
};

export default PrivateRoute;