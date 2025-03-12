import React from 'react';
import { Receipt, Download, Eye } from 'lucide-react';

const Invoices = () => {
	return (
		<div className="bg-white rounded-lg shadow">
			<div className="p-6 border-b">
				<h3 className="text-lg font-semibold text-gray-800">Invoices</h3>
			</div>
			<div className="p-6">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead>
						<tr>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Invoice #
							</th>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Customer
							</th>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Amount
							</th>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Date
							</th>
							<th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
						{[1, 2, 3, 4, 5].map((invoice) => (
							<tr key={invoice}>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-900">INV-{invoice}2024</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-900">John Doe</div>
									<div className="text-sm text-gray-500">john@example.com</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-900">$299.99</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									Mar 10, 2024
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<button className="text-blue-600 hover:text-blue-900 mr-4">
										<Eye className="h-5 w-5" />
									</button>
									<button className="text-green-600 hover:text-green-900">
										<Download className="h-5 w-5" />
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Invoices;