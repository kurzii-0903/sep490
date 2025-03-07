import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL_API;
export const UserContext = createContext();

export const AdminUserContextProvider = ({ children }) => {
    const [pageUser, setPageUsers] = useState({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
        items: []
    });

    const fetchUser = useCallback(async (role) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/User/get-users`, {
                params: {
                    page: pageUser.currentPage,
                    size: pageUser.pageSize,
                    role: role
                }
            });
            setPageUsers(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        }
    }, [pageUser.currentPage, pageUser.pageSize]);

    useEffect(() => {
        fetchUser("Customer");
    }, [fetchUser]);

    return (
        <UserContext.Provider value={{ pageUser }}>
            {children}
        </UserContext.Provider>
    );
};
