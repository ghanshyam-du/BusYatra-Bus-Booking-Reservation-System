// List all schedules with add/edit/cancel
// ----------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Bus as BusIcon, MapPin, Clock, Users } from 'lucide-react';
import travelerService from '../../services/travelerService';
import { formatDate, formatTime, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await travelerService.getSchedules();
      setSchedules(response.data || []);
    } catch (error) {
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSchedule = async (scheduleId) => {
    if (!confirm('Are you sure you want to cancel this schedule? Active bookings will be affected.')) return;

    try {
      await travelerService.cancelSchedule(scheduleId);
      toast.success('Schedule cancelled successfully');
      fetchSchedules();
    } catch (error) {
      toast.error(error.message || 'Failed to cancel schedule');
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const journeyDate = new Date(schedule.journey_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') return journeyDate >= today && schedule.schedule_status === 'ACTIVE';
    if (filter === 'past') return journeyDate < today || schedule.schedule_status !== 'ACTIVE';
    return true;
  });

  if (loading) {
    return <div className="bg-white rounded-lg shadow-sm p-8 text-center">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Bus Schedules</h2>
          <p className="text-gray-600 mt-1">Manage your bus schedules</p>
        </div>
        <Link
          to="/traveler/add-schedule"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Create Schedule
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All ({schedules.length})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'past' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Past/Cancelled
        </button>
      </div>

      {/* Schedule List */}
      {filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No schedules found</h3>
          <p className="text-gray-600 mb-6">Create your first schedule to start accepting bookings</p>
          <Link
            to="/traveler/add-schedule"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Create Schedule
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSchedules.map((schedule) => (
            <div key={schedule.schedule_id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <BusIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{schedule.bus_number}</h3>
                    <p className="text-sm text-gray-600">
                      {schedule.from_location} → {schedule.to_location}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schedule.schedule_status)}`}>
                  {schedule.schedule_status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Journey Date</p>
                    <p className="font-medium">{formatDate(schedule.journey_date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Departure</p>
                    <p className="font-medium">{formatTime(schedule.departure_time)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Available</p>
                    <p className="font-medium">{schedule.available_seats}/{schedule.total_seats}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Booked</p>
                    <p className="font-medium">{schedule.booked_seats || 0} seats</p>
                  </div>
                </div>
              </div>

              {schedule.schedule_status === 'ACTIVE' && schedule.booked_seats === 0 && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleCancelSchedule(schedule.schedule_id)}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium"
                  >
                    Cancel Schedule
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleList;
