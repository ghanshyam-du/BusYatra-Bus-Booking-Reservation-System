import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile_number: '',
    gender: 'male',
    date_of_birth: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, name, value, type } = e.target;
    // Handle both 'id' (from prompt HTML) and 'name' attributes for compatibility
    const fieldName = name || id;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-card-dark border border-white/10 shadow-xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">
                  Account Created!
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Welcome aboard. Please sign in to continue.
                </p>
              </div>
            </div>
          </div>
        </div>
      ));
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display bg-background-dark text-slate-100 antialiased min-h-screen flex flex-col md:flex-row h-full w-full overflow-hidden">
      {/* Left Side - Visuals */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative flex-col justify-between p-12 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-3Sr8nEhKbkT0xERB8IFz5pkBFAyzWtAXqMJfk_6Tc7cPcQlNeOarYWjQArNLU-ivtkc8xnt0vZ98f9w8XcmsnMHM3v8oazaxYhPBCYYls4Nrde1xyXk01yNORZD_L5CIJEgzlKHq4KBrKFm2xnNQK3HT8-5Q6h0nqEjwh1QmBA2SQskN8UeQ-K0n1WAMLM9cGH230e3ZxH4yMcGDw40n4q-M9tiMYivakIKwP08emc0qkezX6KGVE6tjdSZIn_0J4qabfkQqCnfn')" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/60 to-background-dark/80"></div>
        <div className="relative z-10">
          <Link to="/" className="block w-fit">
            <img
              src="/logo.png"
              alt="BusYatra"
              className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-8"
          >
            Experience the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">starlit path</span> in luxury.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="glass-panel rounded-2xl p-8 text-white transform transition hover:translate-y-[-4px] duration-500"
          >
            <div className="flex gap-1 text-primary mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="fill-current w-5 h-5" />
              ))}
            </div>
            <p className="text-lg leading-relaxed font-medium mb-6 text-slate-200 italic">
              "There's something magical about traveling at night with BusYatra. The cabins are premium, and waking up to a new sunrise is just breathtaking. Simply the best."
            </p>
            <div className="flex items-center gap-4">
              <img alt="Anjali P" className="w-12 h-12 rounded-full border-2 border-primary/50 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_eHqUQM_N2kYbKvijrvzW4-ZRTFuBgE3TwMC_vqIrN8V6xwYOgwnENY6ZCwUG2SXccMyA5Xhf8O0uYjeSVhYAl7abLBB1Sak1l3tA-SmLFiNvZafeW6hI8IlPfu57fArqoGZhWEjPxP7mIH--RAGz-aYL_udgMylpizWTERwlHseRGbMcbhbXahb3TCdWt69UpnPuw-f2Tl9nEGnUeGdZK7KWMXictOa8ASid-5_vOO54e7f08O6MQwx8RKAlmV5K13zALrLD7sd3" />
              <div>
                <p className="font-bold text-base text-white">Anjali P.</p>
                <p className="text-xs text-primary/80 uppercase tracking-widest font-semibold">Premium Member</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-white/30 text-sm">
          © 2024 BusYatra Luxury Lines. All rights reserved.
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full md:w-7/12 lg:w-1/2 h-full bg-background-dark overflow-y-auto border-l border-white/5">
        <div className="w-full max-w-xl mx-auto px-6 py-12 md:px-16 md:py-20 flex flex-col justify-center min-h-full">
          <div className="md:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <span className="text-white font-bold text-xl tracking-tight">BusYatra</span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-extrabold text-white mb-3">Begin Your Journey</h1>
            <p className="text-slate-400 text-lg">Create an account to access exclusive midnight routes and premium lounges.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider" htmlFor="full_name">Full Name</label>
              <input
                className="w-full px-5 py-4 rounded-xl border input-dark"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                type="text"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider" htmlFor="email">Email Address</label>
                <input
                  className="w-full px-5 py-4 rounded-xl border input-dark"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@luxury.com"
                  type="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider" htmlFor="mobile_number">Mobile Number</label>
                <input
                  className="w-full px-5 py-4 rounded-xl border input-dark"
                  id="mobile_number"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  placeholder="+91 90000 00000"
                  type="tel"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider" htmlFor="date_of_birth">Date of Birth</label>
                <input
                  className="w-full px-5 py-4 rounded-xl border input-dark"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  type="date"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Gender Preference</label>
                <div className="flex gap-2">
                  <label className="flex-1">
                    <input
                      className="peer sr-only"
                      name="gender"
                      type="radio"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleChange}
                    />
                    <div className="text-center py-4 rounded-xl border border-white/10 bg-white/5 text-slate-400 peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary cursor-pointer hover:bg-white/10 transition-all font-semibold text-sm">
                      Male
                    </div>
                  </label>
                  <label className="flex-1">
                    <input
                      className="peer sr-only"
                      name="gender"
                      type="radio"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleChange}
                    />
                    <div className="text-center py-4 rounded-xl border border-white/10 bg-white/5 text-slate-400 peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary cursor-pointer hover:bg-white/10 transition-all font-semibold text-sm">
                      Female
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  className="w-full px-5 py-4 rounded-xl border input-dark pr-12"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-slate-500 font-medium">Use 8 or more characters with a mix of letters & numbers.</p>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-extrabold py-5 rounded-xl shadow-2xl shadow-primary/20 transform transition-all duration-300 text-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Your Account</span>
                )}
              </motion.button>
            </div>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background-dark text-slate-500 font-bold uppercase tracking-widest">Or Secure Login With</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all group cursor-pointer">
              <img alt="Google" className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR3ikRphqULgzYtdgo5Drb3Z6SCj5au8wlaeHgGLlp1viBGQ4Zb60iffp2BqWGmkIFW4BsEJOl3hQkVrDQMeqFQ9yFq1-FXXDENoDduDUSh0y0qbOvgCnKjnLgjqU7Lxm-zoyyoADIOXHCgRJqIofroaOx7DADvmqjKsGFAgaTL3mKVOEj5PWuhwjGNlID_KTxnASLjtXzfA4VfPB4WdmdI5m6xiY8k6h8GgQx0fYld0eKW81y-z6AtwpIkprlURFJ5ivFSEoA47_U" />
              <span className="text-slate-300 font-bold group-hover:text-white">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all group cursor-pointer">
              <img alt="Facebook" className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfnLsQvGOIu-95xJWLos3LyImToc8f-Y7Pwmc4Avh1NBJqYkNlWkSw3_YFy7LAH0Z48Jui6YiZZ44x5Me5KWzPYEyaFGYNWaGpnoxkLwCmm4YIO0sB2vnDHej7aETTtd5XLKa4Y4oShz1ymjDEDtLmE01K9whiS-qRH_GG5KgUK0fnYM1m1H8qqkz23p9uLrsgTrkw2xxRNzmvjr0Tevg9laLdTfax6_DA4v3XBfdhFWNvmtQVKU9oXfxCnCuLWXNkGd8EcTN5p6Pu" />
              <span className="text-slate-300 font-bold group-hover:text-white">Facebook</span>
            </button>
          </div>

          <p className="mt-12 text-center text-slate-400 text-lg">
            Already part of the journey?{' '}
            <Link className="text-primary font-extrabold hover:text-accent transition-colors underline underline-offset-4 decoration-2" to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
