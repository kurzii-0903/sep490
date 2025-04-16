import Loading from "../../../components/Loading/Loading";
import ErrorList from "../../../components/ErrorList/ErrorList";
import React, {useContext, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../../../contexts/AuthContext";
import axiosInstance, {setAxiosInstance} from "../../../axiosInstance";


export default function UpdateEmployee({config}) {
    const {user} = useContext(AuthContext);
    useEffect(() => {
        if (user && user.token) {
            setAxiosInstance(user.token);
        }
    }, [user]);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [employee, setEmployee] = useState({
        id:0,
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        gender: true,
        role: "Manager",
        isEmailVerified: false,
        createdAt: "",
        imageUrl: "",
        updateAt: "",
        status: ""
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'gender') {
            newValue = value === '1';
        }
        setEmployee((prev) => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Call API update employee here
            const response = await axiosInstance.put(`/User/update-employee`,employee )
            setEmployee(response.data);
        } catch (error) {
            console.error("Lỗi khi cập nhật nhân viên:", error);
            if (error.response && error.response.data) {
                const { message, errors } = error.response.data;
                setErrors(Array.isArray(errors) ? errors : [message || "Có lỗi xảy ra. Vui lòng thử lại sau."]);
            } else {
                setErrors(["Có lỗi xảy ra. Vui lòng thử lại sau."]);
            }
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchEmployee = async () => {
            if (!id) {
                return;
            }
            try {
                const response = await axiosInstance.get(`/User/get-employee-by-id/${id}`);
                setEmployee(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu nhân viên:", error);
                setErrors(["Không thể lấy dữ liệu nhân viên"]);
            }
        };
        if(id){
            fetchEmployee();
        }

    }, [id]);

    return (
        <div className="container mx-auto p-4">
            <Loading isLoading={loading} />
            <ErrorList errors={errors} />
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Update Employee</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="name" name="name"
                                   value={employee.name} onChange={handleChange}
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" name="email"
                                   value={employee.email} onChange={handleChange}
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="text" id="phoneNumber" name="phoneNumber"
                                   value={employee.phoneNumber} onChange={handleChange}
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input type="text" id="address" name="address"
                                   value={employee.address} onChange={handleChange}
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth"
                                   value={employee.dateOfBirth} onChange={handleChange}
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                            <select id="gender" name="gender"
                                    value={employee.gender ? '1' : '0'} onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="1">Nam</option>
                                <option value="0">Nữ</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                id="status" name="status"
                                value={employee.status}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value={'Active'}>Active</option>
                                <option value={'InActive'}>InActive</option>
                            </select>

                        </div>
                        <div>
                            <label htmlFor="isEmailVerified" className="block text-sm font-medium text-gray-700">Email Verified</label>
                            <input type="text" id="isEmailVerified" name="isEmailVerified"
                                   disabled='true'
                                   value={employee.isEmailVerified ? 'Yes' : 'No'} readOnly
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-200 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">Created At</label>
                            <input type="text" id="createdAt" name="createdAt"
                                   disabled
                                   value={employee.createdAt ? new Date(employee.createdAt).toLocaleString() : 'N/A'}
                                   readOnly
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-200 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="updateAt" className="block text-sm font-medium text-gray-700">Updated At</label>
                            <input type="text" id="updateAt" name="updateAt"
                                   disabled
                                   value={employee.updateAt ? new Date(employee.updateAt).toLocaleString() : 'N/A'}
                                   readOnly
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-200 sm:text-sm"/>
                        </div>

                    </div>
                    <div className="mt-6">
                        <button type="submit"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>


    );
}
