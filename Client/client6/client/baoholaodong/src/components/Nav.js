import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinkCustomers = [
	{ label: "Trang chủ", href: "/" },
	{ label: "Giới thiệu", href: "/about" },
	{ label: "Sản phẩm", href: "/#" },
	{ label: "Kiến thức an toàn lao động", href: "/#" },
	{ label: "Hệ thống phân phối", href: "/#" },
	{ label: "Liên hệ", href: "/#" },
	{ label: "Mua hàng", href: "/#" },
];

const Nav = () => {
	// Hook để lấy location (địa chỉ của trang hiện tại)
	const location = useLocation();

	return (
		<nav className="bg-red-600">
			<div className="container mx-auto">
				<ul className="flex justify-center space-x-4 text-white py-2">
					{navLinkCustomers.map((link, index) => (
						<li key={index}>
							<Link
								className={`hover:underline ${
									location.pathname === link.href ? "text-yellow-500" : ""
								}`}
								to={link.href}
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
};

export default Nav;
