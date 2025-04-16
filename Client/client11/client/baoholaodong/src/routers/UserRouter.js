import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "../pages/register";
import Signin from "../pages/signin";
import Home from "../pages/Home";
import About from "../pages/About";
import BlogList from "../pages/BlogList";
import PrivateRoute from "../components/PrivateRoute";
import AdminLayout from "../layouts/AdminLayout";
import Users from "../pages/manager/Users/Users";
import { Orders } from "../pages/manager/OrderManager";
import { CreateProduct, Products, UpdateProduct } from "../pages/manager/ProductManager";
import { UpdateBlogs, CreateBlogs, BlogPosts } from "../pages/manager/BlogManager";
import Invoices from "../pages/manager/InvoiceManager/Invoices";
import { Notifications } from "../pages/manager/NotificationManager";
import Settings from "../pages/manager/Settings";
import ProductCategories from "../pages/manager/ProductCategoryManager/ProductCategories";
import React from "react";
import BlogCategories from "../pages/manager/BlogCategory/BlogCategories";
import CustomerLayout from "../layouts/CustomerLayout";
import Cart from "../pages/Cart";
import ProductList from "../pages/ProductList/PoductSearch";
import ProductDetail from "../pages/ProductDetails";
import { CustomerProductProvider } from "../contexts/CustomerProductContext";
import { BlogPostProvider } from "../contexts/BlogPostContext";
import { AdminProductProvider } from "../contexts/AdminProductContext";
import Taxes from "../pages/manager/TaxManager";
import VerificationPage from "../pages/register/Verification";
import Logout from "../pages/Logout";
import { AdminUserContextProvider } from "../contexts/AdminUserContext";
import Dashboard from "../pages/manager/Dashboard";
import ScrollToTop from "../components/ScrollToTop";
import { Error403, Error404, Error503 } from "../pages/Errors";
import Contact from "../pages/Contact";
import CustomerInfo from "../pages/CustomerInfo";
import Checkout from "../pages/Checkout";
import ProductListByCategory from "../pages/ProductList/ProductListByCategory";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ForgotPassword/ResetPassword";
import Employees from "../pages/manager/EmployeeManager";
import CreateEmployee from "../pages/manager/EmployeeManager/CreateEmployee";
import UpdateEmployee from "../pages/manager/EmployeeManager/UpdateEmployee";
import CreateOrder from "../pages/manager/OrderManager/CreateOrder";
import OrderDetail from "../pages/manager/OrderManager/OrderDetail";
import { ConfirmOrder } from "../pages/ConfirmOrder";
import ProductVariantSelector from "../pages/ProductDetails/ProductVariantSelector";
import BlogDetail from "../pages/BlogDetail";
import OrderHistory from "../pages/OrderHistory";
import FeedBack from "../pages/FeedBack";

const UserRouter = ({ config }) => {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/403" element={<Error403 />} />
                <Route path="/503" element={<Error503 />} />
                <Route path="/404" element={<Error404 />} />
                <Route path="*" element={<Error404 />} />
                <Route path="/forgot-password" element={<ForgotPassword config={config}/>} />
                <Route path="/reset-password" element={<ResetPassword config={config}/>} />
                <Route
                    path="/"
                    element={
                        <CustomerProductProvider config={config}>
                            <CustomerLayout  config={config}/>
                        </CustomerProductProvider>
                    }
                >
                    <Route path="/feedback/:slug" element={<FeedBack config={config} />} />
                    <Route index element={<Home config={config} />} />
                    <Route path="/register" element={<Register config={config}  />} />
                    <Route path="/login" element={<Signin  config={config}/>} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/products" element={<ProductList config={config} />} />
                    <Route path="/products/:slug" element={<ProductDetail config={config} />} />
                    <Route path="/blogs" element={<BlogList config={config} />} />
                    <Route path="/blogs/:slug" element={<BlogDetail config={config} />} />
                    <Route path="/about" element={<About config={config} />} />
                    <Route path="confirm-order" element={<ConfirmOrder config={config} />} />
                    <Route path="/checkout" element={<Checkout config={config} />} />
                    <Route path="/verification" element={<VerificationPage config={config} />} />
                    <Route path="/logout" element={<Logout config={config} />} />
                    <Route path="/contact" element={<Contact config={config} />} />
                    <Route path="/customerInfo" element={<CustomerInfo config={config} />} />
                    <Route path="/products/:group/:cate/:slug" element={<ProductListByCategory config={config} />} />
                    <Route path="/category/:categoryId" element={<ProductListByCategory config={config} />} />
                    <Route path="confirm-order" element={<ConfirmOrder config={config} />} />
                    <Route path="/order-history/:userId" element={<OrderHistory  config={config}/>} />
                </Route>
                {/* Admin Routes */}
                <Route
                    path="/manager"
                    element={
                        <AdminProductProvider config={config}>
                            <BlogPostProvider config={config} >
                                <AdminUserContextProvider config={config} >
                                    <PrivateRoute element={<AdminLayout config={config} />} roleRequired={['Admin', 'Manager']} />
                                </AdminUserContextProvider>
                            </BlogPostProvider>
                        </AdminProductProvider>
                    }
                >
                    <Route path="dashboard" element={<PrivateRoute element={<Dashboard config={config} />} roleRequired={['Admin']} />} />
                    <Route path="users" element={<PrivateRoute element={<Users  config={config}/>} roleRequired={['Admin']} />} />
                    <Route path="employees" element={<PrivateRoute element={<Employees config={config} />} roleRequired={['Admin']} />} />
                    <Route path="create-employee" element={<PrivateRoute element={<CreateEmployee config={config} />} roleRequired={['Admin']} />} />
                    <Route path="update-employee" element={<PrivateRoute element={<UpdateEmployee config={config} />} roleRequired={['Admin']} />} />
                    <Route path="orders" element={<Orders config={config} />} />
                    <Route path="create-order" element={<PrivateRoute element={<CreateOrder config={config} />} roleRequired={['Admin']} />} />
                    <Route path="order-detail/:id" element={<PrivateRoute element={<OrderDetail config={config} />} roleRequired={['Admin']} />} />
                    <Route path="products" element={<Products config={config}/>} />
                    <Route path="blog-posts" element={<PrivateRoute element={<BlogPosts config={config} />} roleRequired={['Admin','Manager']} />} />
                    <Route path="create-blog" element={<PrivateRoute element={<CreateBlogs config={config} />} roleRequired={['Admin','Manager']} />} />
                    <Route path="update-blog/:id" element={<PrivateRoute element={<UpdateBlogs   config={config}/>} roleRequired={['Admin','Manager']} />} />
                    <Route path="invoices" element={<PrivateRoute element={<Invoices config={config}/>} roleRequired={['Admin']} />} />
                    <Route path="notifications" element={<PrivateRoute element={<Notifications config={config}/>} roleRequired={['Admin']} />} />
                    <Route path="settings" element={<PrivateRoute element={<Settings config={config}/>} roleRequired={['Admin','Manager']} />} />
                    <Route path="createproduct" element={<PrivateRoute element={<CreateProduct config={config}/>} roleRequired={['Admin']} />} />
                    <Route path="update-product/:id/:slug" element={<PrivateRoute element={<UpdateProduct config={config} />} roleRequired={['Admin']} />} />
                    <Route path="product_categories" element={<PrivateRoute element={<ProductCategories config={config}/>} roleRequired={['Admin','Manager']} />} />
                    <Route path="blog-categories" element={<PrivateRoute element={<BlogCategories config={config}/>} roleRequired={['Admin','Manager']} />} />
                    <Route path="taxes" element={<PrivateRoute element={<Taxes config={config}/>} roleRequired={['Admin']} />} />

                </Route>
            </Routes>
        </Router>
    );
};

export default UserRouter;