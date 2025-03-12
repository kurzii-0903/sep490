import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from "./contexts/AuthContext";
import CartProvider from "./contexts/CartContext";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "389645565421-f4i91jcfq910iulpmps1go62ounqbnt4.apps.googleusercontent.com";
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <AuthProvider>
            <GoogleOAuthProvider clientId={clientId}>
                <CartProvider>
                    <App />
                </CartProvider>
            </GoogleOAuthProvider>
        </AuthProvider>
    </React.StrictMode>
);

reportWebVitals();