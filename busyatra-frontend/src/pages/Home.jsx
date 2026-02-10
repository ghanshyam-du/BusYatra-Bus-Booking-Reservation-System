import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Calendar, Shield, Clock, Star, Zap, Search } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { cn } from '../utils/cn';

const HomePage = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  const features = [
    {
      icon: MapPin,
      title: 'Pan-India Coverage',
      desc: 'Connect with over 5,000 destinations across the country.',
      className: "col-span-1 md:col-span-2 lg:col-span-1 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 text-blue-600"
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      desc: 'Lightning fast booking process with instant confirmation.',
      className: "col-span-1 bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800 text-amber-600"
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      desc: 'Verified operators and sanitized buses for your safety.',
      className: "col-span-1 bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800 text-emerald-600"
    },
    {
      icon: Clock,
      title: 'Live Tracking',
      desc: 'Track your bus in real-time and share location.',
      className: "col-span-1 md:col-span-3 lg:col-span-2 bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800 text-purple-600"
    },
    {
      icon: Star,
      title: 'Top Rated',
      desc: '4.8/5 average rating from millions of travelers.',
      className: "col-span-1 bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800 text-rose-600"
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section ref={targetRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Modern Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-dot-pattern mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)] opacity-50" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-primary/5 to-transparent blur-3xl -z-10" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            style={{ opacity, y }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 text-sm font-medium text-muted-foreground backdrop-blur-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                No Booking Fees on First Trip
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground mb-6"
            >
              Travel India with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-500 to-pink-500 animate-gradient-x">
                BusYatra
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
            >
              Experience premium bus travel. Seamless booking, live tracking, and 24/7 support for your journey across 5,000+ routes.
            </motion.p>

            {/* Premium Search Widget */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-3xl"
            >
              <div className="p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <MapPin size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="From (e.g. Delhi)"
                      className="w-full h-14 pl-10 pr-4 bg-muted/50 rounded-xl border-transparent focus:bg-background focus:border-primary/20 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                  <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <MapPin size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="To (e.g. Manali)"
                      className="w-full h-14 pl-10 pr-4 bg-muted/50 rounded-xl border-transparent focus:bg-background focus:border-primary/20 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                  <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Calendar size={20} />
                    </div>
                    <input
                      type="date"
                      className="w-full h-14 pl-10 pr-4 bg-muted/50 rounded-xl border-transparent focus:bg-background focus:border-primary/20 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                  <Link to="/login" className="md:w-auto w-full">
                    <button className="w-full md:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-primary/25 active:scale-95 flex items-center justify-center gap-2">
                      <Search size={20} />
                      <span>Search</span>
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Travel With Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've reimagined the bus booking experience to make it simpler, safer, and more rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-8 rounded-3xl border transition-all duration-300 hover:shadow-lg group",
                  feature.className
                )}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-black/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Stats */}
      <section className="py-24 border-t border-border/50 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Daily Routes", value: "5,000+" },
              { label: "Happy Travelers", value: "10M+" },
              { label: "Bus Operators", value: "2,500+" },
              { label: "Cities Connected", value: "500+" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary opacity-[0.03]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto bg-foreground text-background rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to start your journey?</h2>
              <p className="text-lg text-background/80 mb-10 max-w-xl mx-auto">
                Join millions of travelers who choose BusYatra for their daily commute and vacation trips.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <button className="px-8 py-4 bg-background text-foreground rounded-full font-bold text-lg hover:bg-background/90 transition-colors">
                    Create Account
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-8 py-4 bg-transparent border border-background/20 text-background rounded-full font-bold text-lg hover:bg-background/10 transition-colors">
                    Bus Operator Login
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
