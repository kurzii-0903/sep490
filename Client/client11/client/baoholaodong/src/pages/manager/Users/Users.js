import React, {useContext} from 'react';
import { User, Edit, Trash2 } from 'lucide-react';
import {UserContext} from "../../../contexts/AdminUserContext";

const Users = ({config}) => {
	const {pageUser} = useContext(UserContext);
	return (
		<div className="bg-white min-h-[800px] rounded-lg shadow">
			<div className="p-6 border-b flex justify-between items-center">
				<h3 className="text-lg font-semibold text-gray-800">Users Management</h3>
				<button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
					Add New User
				</button>
			</div>
			<div className="p-6">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead>
						<tr>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								User
							</th>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Role
							</th>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
						{pageUser.items.map(({id,name,phoneNumber,email,role,status,imageUrl},index) => (
							<tr key={index} className="border-b bg-white divide-y divide-gray-200 hover:bg-gray-100">
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="flex-shrink-0 h-10 w-10">
											{imageUrl ? (
												<img src={imageUrl} alt="User Avatar" className="h-10 w-10 rounded-full object-cover" />
											) : (
												<User className="h-10 w-10 rounded-full bg-gray-100 p-2" />
											)}
										</div>

										<div className="ml-4">
											<div className="text-sm font-medium text-gray-900">{name}</div>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-900">{email}</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-900">{role}</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
										{status}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<button className="text-blue-600 hover:text-blue-900 mr-4">
										<Edit className="h-5 w-5" />
									</button>
									<button className="text-red-600 hover:text-red-900">
										<Trash2 className="h-5 w-5" />
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

export default Users;