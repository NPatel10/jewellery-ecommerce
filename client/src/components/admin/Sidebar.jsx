import React from 'react';
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UsersIcon,
  TicketIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout }) => {
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
    { id: 'products', name: 'Products', icon: ShoppingBagIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingCartIcon },
    { id: 'customers', name: 'Customers', icon: UsersIcon },
    { id: 'coupons', name: 'Coupons', icon: TicketIcon },
    { id: 'site-content', name: 'Site Content', icon: DocumentTextIcon },
    { id: 'payments', name: 'Payments', icon: CreditCardIcon },
    { id: 'reports', name: 'Reports', icon: ChartBarIcon },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 flex-1">
          <div className="px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false); // Close mobile sidebar
                  }}
                  className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;