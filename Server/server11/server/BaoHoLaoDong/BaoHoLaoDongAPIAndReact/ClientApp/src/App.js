import React from 'react';
import './App.css';
import UserRouter from "./routers/UserRouter";

export default function App({baseUrl})  {

  return (
      <UserRouter baseUrl={baseUrl} />
  );
}
