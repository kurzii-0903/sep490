﻿import {useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../contexts/AuthContext";
const Logout = ({config}) => {
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
