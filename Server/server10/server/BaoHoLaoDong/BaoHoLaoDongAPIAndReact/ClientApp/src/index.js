import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import "./Index.css"
import {GoogleOAuthProvider} from "@react-oauth/google";

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "161366778808-n0525adskad7lqt9qngv1j9mq6ap8v0k.apps.googleusercontent.com";
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
    
    <GoogleOAuthProvider clientId={clientId}>
        <App baseUrl={baseUrl}/>
    </GoogleOAuthProvider>
);

serviceWorkerRegistration.unregister();
