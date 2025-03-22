import React from 'react';
import { Bell, Check, X } from 'lucide-react';

const Notifications = () => {
	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow">
				<div className="p-6 border-b flex justify-between items-center">
					<h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
					<button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
						Mark all as read
					</button>
				</div>
				<div className="p-6">
					<div className="space-y-4">
						{[1, 2, 3, 4, 5].map((notification) => (
							<div
								key={notification}
								className="flex items-start p-4 bg-blue-50 rounded-lg"
							>
								<div className="flex-shrink-0">
									<Bell className="h-6 w-6 text-blue-500" />
								</div>
								<div className="ml-3 flex-1">
									<p className="text-sm font-medium text-gray-900">
										New Order Received
									</p>
									<p className="mt-1 text-sm text-gray-500">
										Order #12345 has been placed by John Doe
									</p>
									<div className="mt-2 text-xs text-gray-400">2 minutes ago</div>
								</div>
								<div className="ml-4 flex-shrink-0 flex space-x-2">
									<button className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600">
										<Check className="h-4 w-4" />
									</button>
									<button className="bg-gray-200 text-gray-600 p-1 rounded-full hover:bg-gray-300">
										<X className="h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Notifications;