import React, { useState, useEffect, useContext } from 'react';
import { SquarePen, Eye } from 'lucide-react';
import { OrderContext } from '../../../contexts/OrderContext';
import Modal from "../../../components/Modal/Modal";

const Orders = () => {
	const [isOpenImage, setIsOpenImage] = useState(false);
	const [image, setImage] = useState('');
	const [orders, setOrders] = useState([]);
	const { getAllOrders, getInvoiceImage, updateOrderStatus } = useContext(OrderContext);
	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const data = await getAllOrders();
				setOrders(data);
			} catch (error) {
				console.error("Error fetching orders:", error);
			}
		};

		fetchOrders();
	}, [getAllOrders]);
	const handleViewInvoice = async (orderId) => {
		try {
			const response = await getInvoiceImage(orderId);
			if (!response) {
				setImage('');
				setIsOpenImage(true);
				return;
			}
			setImage(`data:image/jpeg;base64,${response.imageBase64}`);
			setIsOpenImage(true);
		} catch (error) {
			setImage('');
		}
	}

	const handleUpdateOrderStatus = async (orderId) => {
		try {
			const isConfirmed = window.confirm('Xác nhận thay đổi trạng thái đơn hàng?');
			if (isConfirmed) {
				await updateOrderStatus(orderId);
				const updatedOrders = await getAllOrders();
				setOrders(updatedOrders);
			}
		} catch (error) {
			console.error("Error updating order:", error);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow">
			<div className="p-6 border-b">
				<h3 className="text-lg font-semibold text-gray-800">Orders Management</h3>
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
							{orders.map((order) => (
								<tr key={order.orderId}>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{order.orderId}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{order.fullName}</div>
										<div className="text-sm text-gray-500">{order.email}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{order.orderDate}</div>
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
										<button className="text-blue-600 hover:text-blue-900 mr-4">
											<Eye onClick={() => handleViewInvoice(order.orderId)} className="h-5 w-5" />
										</button>
										<button className="text-blue-600 hover:text-blue-900">
											<SquarePen onClick={() => handleUpdateOrderStatus(order.orderId)} className="h-5 w-5" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
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