import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaUsers,
    FaShoppingCart,
    FaBoxOpen,
    FaMoneyBillWave,
    FaBell,
    FaSearch,
    FaChartLine,
    FaListAlt,
    FaUserCog,
    FaTags,
    FaComments,
    FaBlog,
    FaSignOutAlt
} from 'react-icons/fa';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import './style.css';

const Dashboard = () => {
    const [salesData, setSalesData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0
    });

    // Simulate fetching data
    useEffect(() => {
        // Mock data for demonstration
        const mockSalesData = [
            { name: 'T1', sales: 4000 },
            { name: 'T2', sales: 3000 },
            { name: 'T3', sales: 5000 },
            { name: 'T4', sales: 2780 },
            { name: 'T5', sales: 1890 },
            { name: 'T6', sales: 2390 },
            { name: 'T7', sales: 3490 },
            { name: 'T8', sales: 4000 },
            { name: 'T9', sales: 2000 },
            { name: 'T10', sales: 2500 },
            { name: 'T11', sales: 3800 },
            { name: 'T12', sales: 5000 }
        ];

        const mockProductData = [
            { name: 'Mũ bảo hộ', value: 400 },
            { name: 'Găng tay', value: 300 },
            { name: 'Áo phản quang', value: 300 },
            { name: 'Giày bảo hộ', value: 200 },
            { name: 'Kính bảo hộ', value: 100 }
        ];

        const mockCategoryData = [
            { name: 'Bảo vệ đầu', value: 35 },
            { name: 'Bảo vệ tay', value: 25 },
            { name: 'Bảo vệ thân', value: 20 },
            { name: 'Bảo vệ chân', value: 15 },
            { name: 'Khác', value: 5 }
        ];

        const mockRecentOrders = [
            { id: 1, customer: 'Nguyễn Văn A', date: '2023-10-15', total: 1500000, status: 'Completed' },
            { id: 2, customer: 'Trần Thị B', date: '2023-10-14', total: 2300000, status: 'Pending' },
            { id: 3, customer: 'Lê Văn C', date: '2023-10-13', total: 850000, status: 'Processing' },
            { id: 4, customer: 'Phạm Thị D', date: '2023-10-12', total: 3200000, status: 'Completed' },
            { id: 5, customer: 'Hoàng Văn E', date: '2023-10-11', total: 1750000, status: 'Completed' }
        ];

        const mockStats = {
            totalCustomers: 1250,
            totalOrders: 3568,
            totalProducts: 157,
            totalRevenue: 325000000
        };

        setSalesData(mockSalesData);
        setProductData(mockProductData);
        setCategoryData(mockCategoryData);
        setRecentOrders(mockRecentOrders);
        setStats(mockStats);
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed': return 'text-green-600';
            case 'Pending': return 'text-yellow-600';
            case 'Processing': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="main-content">
            <motion.div
                className="dashboard-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="stats-container"
                    variants={itemVariants}
                >
                    <motion.div
                        className="stat-card"
                        whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
                    >
                        <div className="stat-icon customers">
                            <FaUsers />
                        </div>
                        <div className="stat-details">
                            <h3>Khách Hàng</h3>
                            <p>{stats.totalCustomers.toLocaleString()}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
                    >
                        <div className="stat-icon orders">
                            <FaShoppingCart />
                        </div>
                        <div className="stat-details">
                            <h3>Đơn Hàng</h3>
                            <p>{stats.totalOrders.toLocaleString()}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
                    >
                        <div className="stat-icon products">
                            <FaBoxOpen />
                        </div>
                        <div className="stat-details">
                            <h3>Sản Phẩm</h3>
                            <p>{stats.totalProducts.toLocaleString()}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="stat-card"
                        whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
                    >
                        <div className="stat-icon revenue">
                            <FaMoneyBillWave />
                        </div>
                        <div className="stat-details">
                            <h3>Doanh Thu</h3>
                            <p>{stats.totalRevenue.toLocaleString()} VND</p>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="charts-container">
                    <motion.div
                        className="chart-card sales-chart"
                        variants={itemVariants}
                    >
                        <h3>Doanh Thu Theo Tháng</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={salesData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value.toLocaleString()} VND`, 'Doanh thu']} />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} name="Doanh thu" />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <div className="small-charts">
                        <motion.div
                            className="chart-card product-chart"
                            variants={itemVariants}
                        >
                            <h3>Top Sản Phẩm</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart
                                    data={productData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} />
                                    <Tooltip formatter={(value) => [`${value} sản phẩm`, 'Số lượng']} />
                                    <Bar dataKey="value" fill="#82ca9d" name="Số lượng" />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>

                        <motion.div
                            className="chart-card category-chart"
                            variants={itemVariants}
                        >
                            <h3>Phân Loại Sản Phẩm</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    className="recent-orders"
                    variants={itemVariants}
                >
                    <div className="section-header">
                        <h3>Đơn Hàng Gần Đây</h3>
                        <motion.button
                            className="view-all-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Xem Tất Cả
                        </motion.button>
                    </div>
                    <div className="orders-table">
                        <table>
                            <thead>
                            <tr>
                                <th>Mã Đơn</th>
                                <th>Khách Hàng</th>
                                <th>Ngày Đặt</th>
                                <th>Tổng Tiền</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentOrders.map((order) => (
                                <motion.tr
                                    key={order.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td>#{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.date}</td>
                                    <td>{order.total.toLocaleString()} VND</td>
                                    <td>
                            <span className={`status-badge ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                                    </td>
                                    <td>
                                        <motion.button
                                            className="action-btn view"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            Xem
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Dashboard;