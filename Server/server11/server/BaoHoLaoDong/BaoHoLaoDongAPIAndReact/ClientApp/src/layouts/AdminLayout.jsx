﻿import React, { useState, useMemo, useContext, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Users,
    ShoppingBag,
    Package,
    FileText,
    Bell,
    LayoutDashboard,
    LogOut,
    Menu,
    ChevronLeft,
    Boxes,
    Percent,
    Briefcase,
    BookOpen
} from 'lucide-react';
import { AuthContext } from "../contexts/AuthContext";
import NotificationBell from "../components/notifications/Notification";
import { HubConnectionBuilder } from '@microsoft/signalr';
import axios from "axios";
import adminAvatar from "../images/adminAvatar.jpg";

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [connection, setConnection] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch notifications when user is available
    useEffect(() => {
        if (user?.userId) {
            fetchNotifications();
        }
    }, [user?.userId]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`/api/Notification/getall-noti`, {
                params: { recipientId: user.userId },
            });
            const formattedNotifications = response.data.map(notification => ({
                id: notification.id,
                title: notification.title,
                message: notification.message,
                isRead: notification.isRead,
                createdAt: new Date(notification.createdAt).toLocaleString(),
                recipientId: notification.recipientId,
                orderId: notification.orderId,
            }));
            setNotifications(formattedNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Initialize SignalR connection
    useEffect(() => {
        if (!connection) {
            const newConnection = new HubConnectionBuilder()
                .withUrl(`/notificationHub`)
                .withAutomaticReconnect()
                .build();
            setConnection(newConnection);
        }
    }, [connection]);

    // Start SignalR connection and handle notifications
    useEffect(() => {
        if (connection && connection.state === 'Disconnected' && user?.userId) {
            connection.start()
                .then(() => {
                    console.log('Connected to SignalR hub!');
                    connection.invoke('JoinEmployeeGroup')
                        .catch(err => console.error('Error joining group:', err));
                    connection.on('ReceiveNotification', (notification) => {
                        if (notification.recipientId === user.userId) {
                            setNotifications(prev => [notification, ...prev]);
                        }
                    });
                })
                .catch(err => console.error('Connection failed:', err));
        }

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, [connection, user?.userId]);

    // Mark notification as read
    const markAsRead = async (id, orderId) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notif) =>
                notif.id === id ? { ...notif, isRead: true } : notif
            )
        );
        try {
            await axios.put(`/api/Notification/mask-as-read`, null, {
                params: {
                    notificationId: id,
                    readAll: false,
                }
            });
            navigate(`/manager/order-detail/${orderId}`);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Define navigation items based on user role
    const navItems = useMemo(() => {
        if (user?.role === 'Admin') {
            return [
                { path: '/manager/dashboard', icon: LayoutDashboard, label: 'Thông tin chung' },
                { path: '/manager/employees', icon: Briefcase, label: 'Nhân viên' },
                { path: '/manager/users', icon: Users, label: 'Khách hàng' },
                { path: '/manager/orders', icon: ShoppingBag, label: 'Các đơn hàng' },
                { path: '/manager/products', icon: Package, label: 'Quản lý sản phẩm' },
                { path: '/manager/product_categories', icon: Boxes, label: 'Danh mục sản phẩm' },
                { path: '/manager/blog-categories', icon: BookOpen, label: 'Danh mục bài viết' },
                { path: '/manager/blog-posts', icon: FileText, label: 'Các bài viết' },
                { path: '/manager/taxes', icon: Percent, label: 'Thuế' },
            ];
        } else if (user?.role === 'Manager') {
            return [
                { path: '/manager/orders', icon: ShoppingBag, label: 'Các đơn hàng' },
                { path: '/manager/products', icon: Package, label: 'Quản lý sản phẩm' },
                { path: '/manager/product_categories', icon: Boxes, label: 'Danh mục sản phẩm' },
                { path: '/manager/blog-categories', icon: BookOpen, label: 'Danh mục bài viết' },
                { path: '/manager/blog-posts', icon: FileText, label: 'Các bài viết' },
            ];
        }
        return [];
    }, [user?.role]);

    // Set loading state based on user availability
    useEffect(() => {
        if (user) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [user]);

    // Redirect to login if no user
    useEffect(() => {
        if (!user && !isLoading) {
            navigate('/login');
        }
    }, [user, isLoading, navigate]);

    return (
        <div className="flex h-screen bg-gray-100">
            {isLoading ? (
                <div className="flex items-center justify-center w-full h-full">
                    <span>Loading...</span>
                </div>
            ) : (
                <>
                    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300 z-20`}>
                        <div className="p-4 border-b flex justify-between items-center">
                            {!isCollapsed && (
                                <h1 className="text-2xl font-bold text-gray-800">{user?.role}</h1>
                            )}
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="p-2 text-gray-600 hover:text-gray-800"
                            >
                                {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                            </button>
                        </div>
                        <nav className="p-4">
                            <ul className="space-y-2">
                                {navItems.map((item) => (
                                    <li key={item.path}>
                                        <button
                                            onClick={() => navigate(item.path)}
                                            className={`flex items-center p-2 rounded-lg ${location.pathname === item.path
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {!isCollapsed && <span className="ml-3">{item.label}</span>}
                                        </button>
                                    </li>
                                ))}
                                <li className="mt-auto">
                                    <button
                                        onClick={() => logout()}
                                        className="flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        {!isCollapsed && <span className="ml-3">Logout</span>}
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <header
                            className={`bg-white shadow-sm fixed top-0 left-${isCollapsed ? '16' : '64'} w-[calc(100%-${isCollapsed ? '4rem' : '16rem'})] z-10 transition-all duration-300`}
                        >
                            <div className="flex items-center justify-between px-6 py-4">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {navItems.find((item) => location.pathname.includes(item.path))?.label || 'Quản lý'}
                                </h2>
                                <div className="flex items-center space-x-4">
                                    <button className="p-2 text-gray-600 hover:text-gray-800">
                                        <NotificationBell notifications={notifications} onMarkAsRead={markAsRead} />
                                    </button>
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={user?.imageUrl || adminAvatar}
                                            alt="Admin"
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <main className="transition-all duration-300 pt-20 px-6">
                            <Outlet />
                        </main>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminLayout;