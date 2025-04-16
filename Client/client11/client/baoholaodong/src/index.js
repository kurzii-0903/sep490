import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from "./contexts/AuthContext";
import CartProvider from "./contexts/CartContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { loadConfig ,getConfig} from './config';
const root = ReactDOM.createRoot(document.getElementById('root'));
loadConfig().then(()=>{
    const config = {
        baseUrl: getConfig("REACT_APP_BASE_URL_API"),
        clientId: getConfig("clientId"),
    };
    root.render(
        <React.StrictMode>
            <AuthProvider config={config}>
                <GoogleOAuthProvider clientId={config.clientId}>
                    <CartProvider>
                        <App config={config} />
                    </CartProvider>
                </GoogleOAuthProvider>
            </AuthProvider>
        </React.StrictMode>
    );
});
