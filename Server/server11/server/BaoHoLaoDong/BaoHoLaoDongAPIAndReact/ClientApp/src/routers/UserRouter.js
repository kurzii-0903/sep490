import {BrowserRouter, Route, Routes} from "react-router-dom";
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
import { Error403, Error404, Error503 } from "../pages/Errors";
import Contact from "../pages/Contact";
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
import CustomerProfile from "../pages/CustomerProfile";
import BlogDetail from "../pages/BlogDetail";
import OrderHistory from "../pages/OrderHistory";
import FeedBack from "../pages/FeedBack";
import {AuthProvider} from "../contexts/AuthContext";
import CartProvider from "../contexts/CartContext";
import ScrollToTop from "../components/ScrollToTop";

const UserRouter = ({baseUrl}) => {
    return (
       <BrowserRouter baseUrl={baseUrl}>
           <ScrollToTop />
           <AuthProvider>
                   <CartProvider>
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
                                   <CustomerProductProvider >
                                       <CustomerLayout  />
                                   </CustomerProductProvider>
                               }
                           >
                               <Route path="/feedback/:slug" element={<FeedBack  />} />
                               <Route index element={<Home  />} />
                               <Route path="/register" element={<Register   />} />
                               <Route path="/login" element={<Signin  />} />
                               <Route path="/cart" element={<Cart />} />
                               <Route path="/products" element={<ProductList  />} />
                               <Route path="/products/:slug" element={<ProductDetail  />} />
                               <Route path="/blogs" element={<BlogList  />} />
                               <Route path="/blogs/:slug" element={<BlogDetail  />} />
                               <Route path="/about" element={<About  />} />
                               <Route path="/confirm-order" element={<ConfirmOrder />} />
                               <Route path="/checkout" element={<Checkout />} />
                               <Route path="/verification" element={<VerificationPage  />} />
                               <Route path="/logout" element={<Logout  />} />
                               <Route path="/contact" element={<Contact  />} />
                               <Route path="/customer-profile" element={<CustomerProfile />} />
                               <Route path="/products/:group/:cate/:slug" element={<ProductListByCategory  />} />
                               <Route path="/category/:categoryId" element={<ProductListByCategory />} />
                               <Route path="/order-history" element={<OrderHistory />} />
                           </Route>
                           {/* Admin Routes */}
                           <Route
                               path="/manager"
                               element={
                                   <AdminProductProvider >
                                       <BlogPostProvider  >
                                           <AdminUserContextProvider  >
                                               <PrivateRoute element={<AdminLayout  />} roleRequired={['Admin', 'Manager']} />
                                           </AdminUserContextProvider>
                                       </BlogPostProvider>
                                   </AdminProductProvider>
                               }
                           >
                               <Route path="dashboard" element={<PrivateRoute element={<Dashboard  />} roleRequired={['Admin']} />} />
                               <Route path="users" element={<PrivateRoute element={<Users  />} roleRequired={['Admin']} />} />
                               <Route path="employees" element={<PrivateRoute element={<Employees  />} roleRequired={['Admin']} />} />
                               <Route path="create-employee" element={<PrivateRoute element={<CreateEmployee  />} roleRequired={['Admin']} />} />
                               <Route path="update-employee" element={<PrivateRoute element={<UpdateEmployee  />} roleRequired={['Admin']} />} />
                               <Route path="orders" element={<Orders  />} />
                               <Route path="create-order" element={<PrivateRoute element={<CreateOrder  />} roleRequired={['Admin']} />} />
                               <Route path="order-detail/:id" element={<PrivateRoute element={<OrderDetail  />} roleRequired={['Admin']} />} />
                               <Route path="products" element={<Products />} />
                               <Route path="blog-posts" element={<PrivateRoute element={<BlogPosts  />} roleRequired={['Admin','Manager']} />} />
                               <Route path="create-blog" element={<PrivateRoute element={<CreateBlogs  />} roleRequired={['Admin','Manager']} />} />
                               <Route path="update-blog/:id" element={<PrivateRoute element={<UpdateBlogs   />} roleRequired={['Admin','Manager']} />} />
                               <Route path="invoices" element={<PrivateRoute element={<Invoices />} roleRequired={['Admin']} />} />
                               <Route path="notifications" element={<PrivateRoute element={<Notifications />} roleRequired={['Admin']} />} />
                               <Route path="settings" element={<PrivateRoute element={<Settings />} roleRequired={['Admin','Manager']} />} />
                               <Route path="createproduct" element={<PrivateRoute element={<CreateProduct />} roleRequired={['Admin']} />} />
                               <Route path="update-product/:id" element={<PrivateRoute element={<UpdateProduct  />} roleRequired={['Admin']} />} />
                               <Route path="product_categories" element={<PrivateRoute element={<ProductCategories />} roleRequired={['Admin','Manager']} />} />
                               <Route path="blog-categories" element={<PrivateRoute element={<BlogCategories />} roleRequired={['Admin','Manager']} />} />
                               <Route path="taxes" element={<PrivateRoute element={<Taxes />} roleRequired={['Admin']} />} />

                           </Route>
                       </Routes>
                   </CartProvider>
           </AuthProvider>
        
       </BrowserRouter>
    );
};

export default UserRouter;