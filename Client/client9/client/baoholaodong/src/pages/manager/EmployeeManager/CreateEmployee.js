import React, {useContext, useState} from "react";
import ErrorList from "../../../components/ErrorList/ErrorList";
import Loading from "../../../components/Loading/Loading";
import axios from "axios";
import {UserContext} from "../../../contexts/AdminUserContext";
import {useNavigate} from "react-router-dom";
const BASE_URL = process.env.REACT_APP_BASE_URL_API;
export default function CreateEmployee() {
    const {pushEmployee} = useContext(UserContext);
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        gender: true,
        role: "Manager"
    });
    const handleChange =(e)=>{
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'gender') {
            newValue = value === '1';
        }
        setEmployee((prev)=>({
            ...prev, [name]: newValue
        }));
    }
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/api/User/create-employee`, employee);
            pushEmployee(response.data);
            navigate('/manager/employees');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Loading isLoading={loading}/>
            <ErrorList errors={errors}/>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Create Employee</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full
                                Name</label>
                            <input type="text" id="fullName" name="fullName"
                                   value={employee.fullName}
                                   onChange={(e)=>handleChange(e)}
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" name="email"
                                   value={employee.email}
                                   onChange={(e)=>handleChange(e)}
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" id="password" name="password"
                                   value={employee.password}
                                   onChange={(e)=>handleChange(e)}
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone
                                Number</label>
                            <input type="text" id="phoneNumber" name="phoneNumber"
                                   value={employee.phoneNumber}
                                   onChange={(e)=>handleChange(e)}
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input type="text" id="address" name="address"
                                   value={employee.address}
                                   onChange={(e)=>handleChange(e)}
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of
                                Birth</label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth"
                                   value={employee.dateOfBirth}
                                   onChange={(e)=>handleChange(e)}
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                            <select id="gender" name="gender"
                                    value={employee.gender ? '1' :'0'}
                                    onChange={(e)=>handleChange(e)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="1">Nam</option>
                                <option value="0">Nữ</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button type="submit"
                                className="w-full md:w-auto bg-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Create Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}