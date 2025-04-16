import React from 'react';
import { User, Lock, Bell, Globe } from 'lucide-react';

const Settings = ({config}) => {
	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow">
				<div className="p-6 border-b">
					<h3 className="text-lg font-semibold text-gray-800">Settings</h3>
				</div>
				<div className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Profile Settings */}
						<div className="col-span-2">
							<h4 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h4>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">Profile Picture</label>
									<div className="mt-1 flex items-center space-x-4">
										<img
											src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
											alt="Profile"
											className="h-12 w-12 rounded-full"
										/>
										<button className="bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
											Change
										</button>
									</div>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700">Full Name</label>
									<input
										type="text"
										className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
										placeholder="John Doe"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700">Email Address</label>
									<input
										type="email"
										className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
										placeholder="john@example.com"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700">Bio</label>
									<textarea
										rows={4}
										className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
										placeholder="Write a few sentences about yourself"
									/>
								</div>
							</div>
						</div>
						
						{/* Quick Settings */}
						<div>
							<h4 className="text-lg font-medium text-gray-900 mb-4">Quick Settings</h4>
							<div className="space-y-4">
								<div className="flex items-center p-4 bg-gray-50 rounded-lg">
									<User className="h-6 w-6 text-gray-400" />
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-900">Account Settings</p>
										<p className="text-sm text-gray-500">Manage your account details</p>
									</div>
								</div>
								
								<div className="flex items-center p-4 bg-gray-50 rounded-lg">
									<Lock className="h-6 w-6 text-gray-400" />
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-900">Security</p>
										<p className="text-sm text-gray-500">Password and authentication</p>
									</div>
								</div>
								
								<div className="flex items-center p-4 bg-gray-50 rounded-lg">
									<Bell className="h-6 w-6 text-gray-400" />
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-900">Notifications</p>
										<p className="text-sm text-gray-500">Customize your notifications</p>
									</div>
								</div>
								
								<div className="flex items-center p-4 bg-gray-50 rounded-lg">
									<Globe className="h-6 w-6 text-gray-400" />
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-900">Language & Region</p>
										<p className="text-sm text-gray-500">Set your language and timezone</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div className="mt-6 flex justify-end">
						<button className="bg-white mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
							Cancel
						</button>
						<button className="bg-blue-500 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-600">
							Save Changes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Settings;