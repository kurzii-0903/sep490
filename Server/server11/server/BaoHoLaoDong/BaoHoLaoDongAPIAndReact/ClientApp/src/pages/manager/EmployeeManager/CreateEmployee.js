import React, { useContext, useEffect, useState } from "react";
import ErrorList from "../../../components/ErrorList/ErrorList";
import Loading from "../../../components/Loading/Loading";
import { UserContext } from "../../../contexts/AdminUserContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import axiosInstance, { setAxiosInstance } from "../../../axiosInstance";

export default function CreateEmployee() {
    const { user } = useContext(AuthContext);
    const { pushEmployee } = useContext(UserContext);
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

    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.token) {
            setAxiosInstance(user.token); 
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = name === "gender" ? value === "1" : value;
        setEmployee((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

        try {
            const response = await axiosInstance.post(`/api/User/create-employee`, employee);
            pushEmployee(response.data);
            navigate("/manager/employees");
        } catch (error) {
            console.error(error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setErrors([error.response.data.message]);
            } else {
                setErrors(["Tạo nhân viên thất bại."]);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Loading isLoading={loading} />
            <ErrorList errors={errors} />
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Create Employee</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Full Name" name="fullName" value={employee.fullName} onChange={handleChange} />
                        <InputField label="Email" name="email" type="email" value={employee.email} onChange={handleChange} />
                        <InputField label="Password" name="password" type="password" value={employee.password} onChange={handleChange} />
                        <InputField label="Phone Number" name="phoneNumber" value={employee.phoneNumber} onChange={handleChange} />
                        <InputField label="Address" name="address" value={employee.address} onChange={handleChange} />
                        <InputField label="Date of Birth" name="dateOfBirth" type="date" value={employee.dateOfBirth} onChange={handleChange} />
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                value={employee.gender ? "1" : "0"}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="1">Nam</option>
                                <option value="0">Nữ</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full md:w-auto bg-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function InputField({ label, name, type = "text", value, onChange }) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>
    );
}
