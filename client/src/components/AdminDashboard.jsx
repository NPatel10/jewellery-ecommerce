import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from './admin/Sidebar';
import TopBar from './admin/TopBar';
import Dashboard from './admin/Dashboard';
import axios from 'axios';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set up axios interceptor for JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <div className="p-6">Products Management - Coming Soon</div>;
      case 'orders':
        return <div className="p-6">Orders Management - Coming Soon</div>;
      case 'customers':
        return <div className="p-6">Customer Management - Coming Soon</div>;
      case 'coupons':
        return <div className="p-6">Coupon Management - Coming Soon</div>;
      case 'site-content':
        return <div className="p-6">Site Content Management - Coming Soon</div>;
      case 'payments':
        return <div className="p-6">Payment Tracking - Coming Soon</div>;
      case 'reports':
        return <div className="p-6">Reports - Coming Soon</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <TopBar
          setSidebarOpen={setSidebarOpen}
          currentUser={currentUser}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;