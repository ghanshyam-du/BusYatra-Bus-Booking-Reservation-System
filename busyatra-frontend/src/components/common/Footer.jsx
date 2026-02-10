import React from 'react';
import { Bus, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-teal-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <img src="/logo.png" alt="BusYatra" className="w-8 h-8 relative" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-teal-400 to-emerald-400">
                                BusYatra
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed max-w-xs">
                            Making your journey comfortable, safe, and memorable. Book your bus tickets across India with ease.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="p-3 bg-white/5 rounded-full text-gray-400 hover:bg-teal-500 hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-teal-500/25"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg text-white mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            {['About Us', 'My Bookings', 'Bus Routes', 'Blog', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50 group-hover:bg-teal-400 transition-colors" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-lg text-white mb-6">Support</h3>
                        <ul className="space-y-4">
                            {['FAQs', 'Privacy Policy', 'Terms & Conditions', 'Cancellation Policy', 'Sitemap'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50 group-hover:bg-teal-400 transition-colors" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-lg text-white mb-6">Contact Us</h3>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-gray-400 group">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-teal-500/10 transition-colors shrink-0">
                                    <MapPin size={20} className="text-teal-500" />
                                </div>
                                <span className="leading-relaxed">123 Bus Terminal Road, Transport Nagar, New Delhi, India</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400 group">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-teal-500/10 transition-colors shrink-0">
                                    <Phone size={20} className="text-teal-500" />
                                </div>
                                <span className="group-hover:text-white transition-colors">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400 group">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-teal-500/10 transition-colors shrink-0">
                                    <Mail size={20} className="text-teal-500" />
                                </div>
                                <span className="group-hover:text-white transition-colors">support@busyatra.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} BusYatra. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-teal-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-teal-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-teal-400 transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
