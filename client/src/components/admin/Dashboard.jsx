import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  LineElement,
  PointElement,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import {
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingCartIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/solid';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatsCard = ({ title, value, icon, change, changeType }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <IconComponent className="h-6 w-6 text-gray-400" />
          </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
      {change && (
        <div className="mt-2">
          <span className={`text-sm font-medium ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'increase' ? '+' : ''}{change}
          </span>
          <span className="text-sm text-gray-500"> from last month</span>
        </div>
      )}
    </div>
  </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, salesRes] = await Promise.all([
        axios.get('/api/admin/reports/dashboard'),
        axios.get('/api/admin/reports/sales?period=month')
      ]);
      
      setStats(dashboardRes.data);
      setSalesData(salesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const salesChartData = {
    labels: salesData?.salesData?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Revenue ($)',
        data: salesData?.salesData?.map(item => item.revenue) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const categoryChartData = {
    labels: salesData?.categorySales?.map(item => item._id) || [],
    datasets: [
      {
        data: salesData?.categorySales?.map(item => item.revenue) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Overview',
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${stats?.overview?.totalRevenue?.toLocaleString() || 0}`}
          icon={CurrencyDollarIcon}
          change={stats?.thisMonth?.revenue ? `$${stats.thisMonth.revenue.toLocaleString()}` : null}
          changeType="increase"
        />
        <StatsCard
          title="Total Orders"
          value={stats?.overview?.totalOrders?.toLocaleString() || 0}
          icon={ShoppingCartIcon}
          change={stats?.thisMonth?.orders || null}
          changeType="increase"
        />
        <StatsCard
          title="Total Customers"
          value={stats?.overview?.totalCustomers?.toLocaleString() || 0}
          icon={UsersIcon}
          change={stats?.thisMonth?.customers || null}
          changeType="increase"
        />
        <StatsCard
          title="Total Products"
          value={stats?.overview?.totalProducts?.toLocaleString() || 0}
          icon={ShoppingBagIcon}
          change={stats?.thisMonth?.products || null}
          changeType="increase"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Sales (Last 30 Days)</h3>
          {salesData?.salesData?.length > 0 ? (
            <Bar data={salesChartData} options={chartOptions} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No sales data available
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h3>
          {salesData?.categorySales?.length > 0 ? (
            <div className="h-64">
              <Doughnut 
                data={categoryChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No category data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
          <div className="mt-5">
            {stats?.recentOrders?.length > 0 ? (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order._id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.user?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${order.totalAmount?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No recent orders</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;