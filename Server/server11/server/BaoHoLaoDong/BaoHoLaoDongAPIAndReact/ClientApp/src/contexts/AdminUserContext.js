import React, {createContext, useState, useEffect, useCallback, useContext} from "react";
import {setAxiosInstance} from '../axiosInstance';
import axiosInstance from '../axiosInstance';
import {AuthContext} from "./AuthContext";
import axios from "axios";
export const UserContext = createContext();

export const AdminUserContextProvider = ({ children }) => {
    const {user} = useContext(AuthContext);
    const [pageUser, setPageUsers] = useState({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
        items: []
    });
    const [pageEmployee, setPageEmployee] = useState({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
        items: []
    });
    const pushEmployee = (emp) => {
        setPageEmployee((prev) => ({
            ...prev,
            items: [...prev.items, emp], // Thêm nhân viên mới vào danh sách
            totalItems: prev.totalItems + 1, // Cập nhật tổng số nhân viên
        }));
    };
    // const updateListEmployee = (emp) => {
    //     setPageEmployee((prev) => ({
    //         ...prev,
    //         items: prev.items.map((e) =>
    //             e.id === emp.id ? emp : e
    //         ),
    //     }));
    // };

    const fetchUser = useCallback(async (role, setState) => {
        try {
            const response = await axios.get(`/api/User/get-users`, {
                params: {
                    page: 1, // Reset về trang 1 khi fetch lại
                    size: 10,
                    role: role
                }
            });
            setState(response.data);
        } catch (error) {
            console.error(`Lỗi khi lấy dữ liệu ${role}:`, error);
        }
    }, []);

    useEffect(() => {
        fetchUser("Customer", setPageUsers);
        fetchUser("Employee", setPageEmployee);
    }, [fetchUser]);

    return (
        <UserContext.Provider value={{ pageUser, pageEmployee,pushEmployee }}>
            {children}
        </UserContext.Provider>
    );
};
