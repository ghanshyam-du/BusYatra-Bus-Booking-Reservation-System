import React, { useState } from 'react';
import { Search, MapPin, Calendar, Bus, Clock, IndianRupee, ArrowRight, X } from 'lucide-react';
import bookingService from '../../services/bookingService';
import { formatCurrency, formatTime, formatDuration } from '../../utils/formatters';
import toast from 'react-hot-toast';
import SeatSelection from './SeatSelection';

const BusSearch = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: ''
  });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showSeatSelection, setShowSeatSelection] = useState(false);

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await bookingService.searchBuses(searchParams);
      setBuses(response.data || []);
      if (response.data?.length === 0) {
        toast.error('No buses found for this route');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to search buses');
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSeats = (bus) => {
    setSelectedBus(bus);
    setShowSeatSelection(true);
  };

  return (
    <div>
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6">Search Buses</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchParams.from}
                  onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g., Ahmedabad"
                  required
                />
              </div>
            </div>

            {/* To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchParams.to}
                  onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g., Mumbai"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Journey Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={searchParams.date}
                  onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                  min={today}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            {loading ? 'Searching...' : 'Search Buses'}
          </button>
        </form>
      </div>

      {/* Search Results */}
      {buses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Available Buses ({buses.length})</h3>
          {buses.map((bus) => (
            <div key={bus.schedule_id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <Bus className="w-6 h-6 text-primary-600" />
                    <div>
                      <h4 className="font-bold text-lg">{bus.bus_number}</h4>
                      <p className="text-sm text-gray-600">{bus.company_name}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {bus.bus_type}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-4">
                    {/* Departure */}
                    <div>
                      <p className="text-sm text-gray-600">Departure</p>
                      <p className="font-bold text-lg">{formatTime(bus.departure_time)}</p>
                      <p className="text-sm text-gray-600">{bus.from_location}</p>
                    </div>

                    {/* Duration */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Duration</p>
                      <div className="flex items-center justify-center gap-2 my-2">
                        <div className="w-16 h-px bg-gray-300"></div>
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div className="w-16 h-px bg-gray-300"></div>
                      </div>
                      <p className="text-sm font-medium">
                        {formatDuration(bus.departure_time, bus.arrival_time)}
                      </p>
                    </div>

                    {/* Arrival */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Arrival</p>
                      <p className="font-bold text-lg">{formatTime(bus.arrival_time)}</p>
                      <p className="text-sm text-gray-600">{bus.to_location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{bus.available_seats} seats available</span>
                  </div>
                </div>

                {/* Price & Book Button */}
                <div className="text-right ml-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Starts from</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(bus.fare)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectSeats(bus)}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center gap-2"
                  >
                    Select Seats <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Seat Selection Modal */}
      {showSeatSelection && selectedBus && (
        <SeatSelection
          bus={selectedBus}
          onClose={() => {
            setShowSeatSelection(false);
            setSelectedBus(null);
          }}
          onBookingComplete={() => {
            setShowSeatSelection(false);
            setSelectedBus(null);
            setBuses([]);
            toast.success('Booking completed! Check My Bookings');
          }}
        />
      )}
    </div>
  );
};

export default BusSearch;