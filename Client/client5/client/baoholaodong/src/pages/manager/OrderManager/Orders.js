import React, { useState, useEffect } from 'react';
import { SquarePen, Eye, Plus } from 'lucide-react';
import Modal from "../../../components/Modal/Modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RangePicker from '../../../components/rangepicker/RangePicker';

const BASE_URL = process.env.REACT_APP_BASE_URL_API;

const Orders = () => {
	const [isOpenImage, setIsOpenImage] = useState(false);
	const [image, setImage] = useState('');
	const [orders, setOrders] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchName, setSearchName] = useState('');
	const [startDateString, setStartDateString] = useState('');
	const [startDate, setStartDate] = useState(null);
	const [endDateString, setEndDateString] = useState('');
	const [endDate, setEndDate] = useState('');
	const [searchInput, setSearchInput] = useState("");
	const navigate = useNavigate();
	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await axios.get(`${BASE_URL}/api/Order/get-page-orders`, {
					params: {
						customerName: searchName,
						startDate: startDateString,
						endDate: endDateString,
						page: currentPage,
						pageSize: 10
					}
				});
				console.log(response.data.items || []);

				setOrders(response.data.items || []);
				setTotalPages(response.data.totalPages);
			} catch (error) {
				console.error("Error fetching orders:", error);
				setOrders([]);
			}
		};

		fetchOrders();
	}, [currentPage, searchName, startDateString, endDateString]);

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			setSearchName(searchInput);
		}
	};

	const handleCreate = () => {
		navigate("/manager/create-order");
	}

	const handleStartDateChange = (e) => {
		if (!e.target.value) {
			setStartDate(null);
			setStartDateString('');
			return;
		}
		const formattedDate = formatDate(e.target.value);
		setStartDate(e.target.value);
        setStartDateString(formattedDate);
    };

    const handleEndDateChange = (e) => {
		if (!e.target.value) {
			setEndDate(null);
			setEndDateString('');
			return;
		}
		const formattedDate = formatDate(e.target.value);
		setEndDate(e.target.value);
        setEndDateString(formattedDate);
    };

	const formatDate = (date) => {
		const [day, month, year] = new Date(date).toLocaleDateString("en-GB").split("/");
		return `${day}${month}${year}`;
	  };	  

	return (
		<div className="bg-white rounded-lg shadow">
			<div className="flex p-6 border-b justify-between">
				<h3 className="text-lg font-semibold text-gray-800">Orders Management</h3>
				<div className="flex space-x-4">
					<input
						type="text"
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Tên khách hàng..."
						className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
					/>
					<input
						type="date"
						value={startDate}
						onChange={handleStartDateChange}
						className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
						placeholder="Từ ngày"
					/>
					<input
						type="date"
						value={endDate}
						onChange={handleEndDateChange}
						placeholder="Đến ngày"
						className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
						min={startDate}
					/>
					<button
						className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
						onClick={handleCreate}>
						<Plus className="w-5 h-5 mr-2" />
						Tạo đơn hàng
					</button>
				</div>
			</div>
			<div className="p-6">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead>
							<tr>
								<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Order ID
								</th>
								<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Customer
								</th>
								<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Date
								</th>
								<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Total
								</th>
								<th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{orders.length > 0 && orders.map((order) => (
								<tr key={order.orderId}>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{order.orderId}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{order.fullName}</div>
										<div className="text-sm text-gray-500">{order.email}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{new Date(order.orderDate).toLocaleString()}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
											{order.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{order.totalAmount}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button
											onClick={() => navigate(`/manager/order-detail/${order.orderId}`)}
											className="text-blue-600 hover:text-blue-900 mr-4">
											<Eye className="h-5 w-5" />
										</button>
										<button className="text-blue-600 hover:text-blue-900">
											<SquarePen className="h-5 w-5" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="p-6 flex justify-center mt-4">
						{orders.length !== 0 ? (
							<nav className="flex items-center space-x-1">
								<button
									onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
									disabled={currentPage === 1}
									className="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-200"><i
										className="fas fa-angle-left"></i></button>
								{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
									<button
										key={page}
										onClick={() => setCurrentPage(() => Number(page))} // Đảm bảo React cập nhật state chính xác
										className={`px-3 py-1 border rounded-md ${currentPage === page
											? "bg-blue-500 text-white"
											: "text-gray-700 hover:bg-gray-200"
											}`}
									>
										{page}
									</button>

								))}
								<button
									onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
									disabled={currentPage === totalPages}
									className="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-200"><i
										className="fas fa-angle-right"></i></button>
							</nav>
						) : (
							""
						)}
					</div>

				</div>
				<Modal isOpen={isOpenImage} onClose={() => setIsOpenImage(false)} title={"Hình ảnh chuyển khoản"}>
					<div className="p-6">
						{image ? (
							<img src={image} alt="Base64 Image" />
						) : (
							<p>Không có hình ảnh</p>
						)}
					</div>
				</Modal>

			</div>
		</div>
	);
};

export default Orders;