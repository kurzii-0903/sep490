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
import BlogPosts from "../pages/manager/BlogManager/BlogPosts";
import Invoices from "../pages/manager/InvoiceManager/Invoices";
import { Notifications } from "../pages/manager/NotificationManager";
import Settings from "../pages/manager/Settings";
import ProductCategories from "../pages/manager/ProductCategoryManager/ProductCategories";
import React from "react";
import CustomerLayout from "../layouts/CustomerLayout";
import Cart from "../pages/Cart";
import ProductList from "../pages/ProductList";
import ProductDetail from "../pages/ProductDetail";
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

const UserRouter = () => {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/403" element={<Error403 />} />
                <Route path="/503" element={<Error503 />} />
                <Route path="/404" element={<Error404 />} />
                <Route path="*" element={<Error404 />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                    path="/"
                    element={
                        <CustomerProductProvider>
                            <CustomerLayout />
                        </CustomerProductProvider>
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Signin />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/product/:id/:slug" element={<ProductDetail />} />
                    <Route path="/blog" element={<BlogList />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/verification" element={<VerificationPage />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/customer-info" element={<CustomerInfo />} />
                    <Route path="/products/:group/:cate/:slug" element={<ProductListByCategory />} />
                    <Route path="/category/:categoryId" element={<ProductListByCategory />} />
                </Route>

                {/* Admin Routes */}
                <Route
                    path="/manager"
                    element={
                        <AdminProductProvider>
                            <BlogPostProvider>
                                <AdminUserContextProvider>
                                    <PrivateRoute element={<AdminLayout />} roleRequired={['Admin', 'Manager']} />
                                </AdminUserContextProvider>
                            </BlogPostProvider>
                        </AdminProductProvider>
                    }
                >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="products" element={<Products />} />
                    <Route path="blog-posts" element={<BlogPosts />} />
                    <Route path="invoices" element={<Invoices />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="createproduct" element={<CreateProduct />} />
                    <Route path="update-product/:id/:slug" element={<UpdateProduct />} />
                    <Route path="product_categories" element={<ProductCategories />} />
                    <Route path="taxes" element={<Taxes />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default UserRouter;