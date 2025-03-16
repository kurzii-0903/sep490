import {useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {AuthContext} from "../contexts/AuthContext";
const Logout = () => {
	const navigate = useNavigate();
	const {logout} = useContext(AuthContext);
	useEffect(() => {
		logout();
		navigate("/login");
	}, [navigate]);
	
	return (
		<div className="flex justify-center items-center h-screen">
			<h2 className="text-xl">Logging out...</h2>
		</div>
	);
};

export default Logout;
