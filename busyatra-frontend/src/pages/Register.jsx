import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Calendar, Eye, EyeOff, Loader2, ArrowRight, Bus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile_number: '',
    gender: '',
    date_of_birth: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-950">
      {/* Left Side - Image & Brand Overlay (Consistent with Login) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-linear-to-t from-teal-900/90 via-slate-900/40 to-slate-900/30" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl w-fit">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img src="/logo.png" alt="BusYatra" className="w-8 h-8 relative brightness-200" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">BusYatra</span>
            </Link>
          </div>

          <div className="space-y-6 max-w-lg mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold leading-tight mb-4">
                Begin Your <br />
                <span className="text-teal-400">Journey Today</span>
              </h1>
              <p className="text-lg text-gray-200 leading-relaxed">
                Sign up to unlock exclusive deals, manage your bookings, and enjoy a premium travel experience.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-950 overflow-y-auto">
        <div className="max-w-[550px] w-full space-y-8 my-auto">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Create Account</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Enter your details to register as a new user.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="md:col-span-2 relative group">
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder=" "
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="peer w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 py-2.5 px-0 text-gray-900 dark:text-white focus:outline-none focus:border-teal-600 transition-colors placeholder-transparent"
                />
                <label className="absolute left-0 -top-3.5 text-sm font-medium text-teal-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-teal-600 dark:peer-placeholder-shown:text-gray-500">
                  Full Name
                </label>
                <div className="absolute right-0 top-2 text-gray-400 peer-focus:text-teal-600">
                  <User size={20} />
                </div>
              </div>

              {/* Email */}
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="peer w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 py-2.5 px-0 text-gray-900 dark:text-white focus:outline-none focus:border-teal-600 transition-colors placeholder-transparent"
                />
                <label className="absolute left-0 -top-3.5 text-sm font-medium text-teal-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-teal-600 dark:peer-placeholder-shown:text-gray-500">
                  Email Address
                </label>
                <div className="absolute right-0 top-2 text-gray-400 peer-focus:text-teal-600">
                  <Mail size={20} />
                </div>
              </div>

              {/* Mobile */}
              <div className="relative group">
                <input
                  id="mobile_number"
                  name="mobile_number"
                  type="tel"
                  placeholder=" "
                  value={formData.mobile_number}
                  onChange={handleChange}
                  required
                  className="peer w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 py-2.5 px-0 text-gray-900 dark:text-white focus:outline-none focus:border-teal-600 transition-colors placeholder-transparent"
                />
                <label className="absolute left-0 -top-3.5 text-sm font-medium text-teal-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-teal-600 dark:peer-placeholder-shown:text-gray-500">
                  Mobile Number
                </label>
                <div className="absolute right-0 top-2 text-gray-400 peer-focus:text-teal-600">
                  <Phone size={20} />
                </div>
              </div>

              {/* Gender */}
              <div className="relative group">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="peer w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 py-2.5 px-0 text-gray-900 dark:text-white focus:outline-none focus:border-teal-600 transition-colors appearance-none"
                >
                  <option value="" disabled hidden></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <label className={`absolute left-0 transition-all ${formData.gender ? '-top-3.5 text-sm text-teal-600' : 'top-2 text-base text-gray-500 dark:text-gray-500'}`}>
                  Gender
                </label>
              </div>

              {/* DOB */}
              <div className="relative group">
                <input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  placeholder=" "
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                  className="peer w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 py-2.5 px-0 text-gray-900 dark:text-white focus:outline-none focus:border-teal-600 transition-colors placeholder-transparent"
                />
                <label className="absolute left-0 -top-3.5 text-sm font-medium text-teal-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-teal-600 dark:peer-placeholder-shown:text-gray-500">
                  Date of Birth
                </label>
                <div className="absolute right-0 top-2 text-gray-400 peer-focus:text-teal-600">
                  <Calendar size={20} />
                </div>
              </div>

              {/* Password */}
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="peer w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 py-2.5 px-0 text-gray-900 dark:text-white focus:outline-none focus:border-teal-600 transition-colors placeholder-transparent"
                />
                <label className="absolute left-0 -top-3.5 text-sm font-medium text-teal-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-teal-600 dark:peer-placeholder-shown:text-gray-500">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-2 text-gray-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="peer w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 py-2.5 px-0 text-gray-900 dark:text-white focus:outline-none focus:border-teal-600 transition-colors placeholder-transparent"
                />
                <label className="absolute left-0 -top-3.5 text-sm font-medium text-teal-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-teal-600 dark:peer-placeholder-shown:text-gray-500">
                  Confirm Password
                </label>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 h-4 w-4 accent-teal-600 rounded border-gray-300 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-500 dark:text-gray-400 leading-tight">
                I agree to the <Link to="/terms" className="text-teal-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-950 px-2 text-gray-500">
                Or register with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
              <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24"><path d="M12.0003 20.45c-2.26 0-4.32-.73-5.96-1.98L3.58 20.33c2.46 2.21 5.92 3.56 9.87 3.56 2.37 0 4.54-.74 6.32-2l-2.48-1.93c-1.12.75-2.54 1.19-4.13 1.19-.04 0-.08 0-.12 0z" fill="#34A853" /><path d="M2.58 6.55L4.94 8.42c-.67 1.83-1.04 3.8-1.04 5.86 0 1.94.34 3.8.96 5.53l-2.36 1.83C.96 18.9 0 15.54 0 12c0-3.66 1.02-7.13 2.58-10.45z" fill="#FBBC05" /><path d="M12.0003 3.58c2.32 0 4.4.82 6.03 2.16l2.5-2.5C18.25 1.46 15.34 0 12.0003 0 7.97 0 4.43 1.62 1.96 4.09l2.42 1.93c1.55-1.57 3.7-2.43 5.93-2.43.08 0 .16.01.24.01z" fill="#EA4335" /><path d="M24 12c0-1.66-.18-3.26-.52-4.8H12v4.8h6.77c-.3 1.6-1.19 2.97-2.42 3.84l2.48 1.93C20.65 16.48 24 13.92 24 12z" fill="#4285F4" /></svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 h-11 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
              <svg className="h-5 w-5 text-gray-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.29-1.23 3.57-1.23.96 0 1.9.45 2.5.86-1.79 1.13-2.3 3.89-1.34 5.37a5.55 5.55 0 0 1-.95 2.21c-.57.85-1.16 1.76-1.86 1.76zM12.01 7.24c-.16-2.5 1.9-4.24 3.97-4.24.23 2.15-1.99 4.34-3.97 4.24z" /></svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Apple</span>
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
