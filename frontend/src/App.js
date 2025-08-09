import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./ecommerce/HomePage";
import Cart from "./ecommerce/components/Cart";
import { LoginPage } from "./ecommerce/login/auth/LoginPage";
import { SignUpPage } from "./ecommerce/login/auth/SignUpPage";
import { AdminDashboard } from "./ecommerce/admin/AdminDashboard";
import { Profile } from "./ecommerce/Profile/Profile";
import { SocketProvider } from "./ecommerce/context/SocketContext";
import { NotificationSystem } from "./ecommerce/components/NotificationSystem";

const App = () => {
  return (
    <SocketProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<SignUpPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
        <NotificationSystem />
    </BrowserRouter>
    </SocketProvider>
  );
};

export default App;
