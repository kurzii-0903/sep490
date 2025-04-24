import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import "./Index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// ✅ Component dùng để fetch clientId và render App
function AppWithGoogleProvider() {
    const [clientId, setClientId] = useState(null);

    useEffect(() => {
        const fetchClientId = async () => {
            try {
                const response = await fetch('/api/configs');
                const data = await response.json();
                setClientId(data.clientId);
            } catch (error) {
                console.error("Failed to fetch clientId:", error);
            }
        };

        fetchClientId();
    }, []);
    
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <App baseUrl={baseUrl} />
        </GoogleOAuthProvider>
    );
}

// Render component chính
root.render(<AppWithGoogleProvider />);

// Đăng ký/deregister service worker
serviceWorkerRegistration.unregister();
