// components/RoleWrapper.js
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const RoleWrapper = ({ allowedRoles, children }) => {
    const { user } = useContext(AuthContext);

    if (allowedRoles.includes(user.role)) {
        return <>{children}</>;
    }

    return null; // Không render gì nếu không đúng role
};

export default RoleWrapper;
