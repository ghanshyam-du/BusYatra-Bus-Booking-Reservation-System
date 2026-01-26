import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Users, Shield, ArrowRight, MapPin, Calendar, Ticket } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bus className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">BusYatra</span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Your Journey Begins Here
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Book bus tickets across India with ease. Fast, secure, and convenient travel solutions at your fingertips.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white text-lg rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          Get Started <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <MapPin className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Pan-India Coverage</h3>
            <p className="text-gray-600">Travel to any destination across India</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <Calendar className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
            <p className="text-gray-600">Book your seats in just a few clicks</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <Ticket className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Instant Confirmation</h3>
            <p className="text-gray-600">Get booking confirmation immediately</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;