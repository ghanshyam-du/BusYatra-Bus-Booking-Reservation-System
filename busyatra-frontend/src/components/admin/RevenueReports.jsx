
import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Award, BarChart3 } from 'lucide-react';
import adminService from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const RevenueReports = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [topTravelers, setTopTravelers] = useState([]);
  const [bookingStats, setBookingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: '',
    groupBy: 'day'
  });

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    try {
      const [revenue, travelers, stats] = await Promise.all([
        adminService.getRevenueReport({ groupBy: 'month' }),
        adminService.getTopTravelers(10),
        adminService.getBookingStats()
      ]);

      setRevenueData(revenue.data || []);
      setTopTravelers(travelers.data || []);
      setBookingStats(stats.data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async () => {
    if (!dateRange.start_date || !dateRange.end_date) {
      toast.error('Please select both start and end dates');
      return;
    }

    try {
      const response = await adminService.getRevenueReport(dateRange);
      setRevenueData(response.data || []);
      toast.success('Report updated!');
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  if (loading) {
    return <div className="bg-white rounded-lg shadow-sm p-8 text-center">Loading reports...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Revenue Reports & Analytics</h2>
        <p className="text-gray-600 mt-1">Financial insights and performance metrics</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="font-bold mb-4">Custom Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group By</label>
            <select
              value={dateRange.groupBy}
              onChange={(e) => setDateRange({ ...dateRange, groupBy: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleFilterChange}
              className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold">Revenue Trend</h3>
        </div>
        
        {revenueData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No revenue data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Revenue</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Bookings</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Seats</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {revenueData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{item.date}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-green-600">
                      {formatCurrency(item.revenue)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">{item.bookings}</td>
                    <td className="px-4 py-3 text-sm text-right">{item.seats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Travelers */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-yellow-600" />
          <h3 className="text-lg font-bold">Top Performing Travelers</h3>
        </div>

        {topTravelers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data available</p>
        ) : (
          <div className="space-y-3">
            {topTravelers.map((traveler, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold">{traveler.company_name}</p>
                    <p className="text-sm text-gray-600">{traveler._id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(traveler.total_revenue)}</p>
                  <p className="text-sm text-gray-600">{traveler.total_bookings} bookings, {traveler.total_seats} seats</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Statistics */}
      {bookingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold">By Status</h3>
            </div>
            <div className="space-y-3">
              {bookingStats.by_status?.map((stat, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{stat._id}</span>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(stat.total_amount)}</p>
                    <p className="text-sm text-gray-600">{stat.count} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold">By Payment</h3>
            </div>
            <div className="space-y-3">
              {bookingStats.by_payment?.map((stat, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{stat._id}</span>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(stat.total_amount)}</p>
                    <p className="text-sm text-gray-600">{stat.count} transactions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueReports;