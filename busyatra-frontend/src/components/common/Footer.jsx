import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0f0b09] border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent blur-sm" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-3xl h-48 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />


            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <img src="/logo.png" alt="BusYatra" className="h-12 w-auto object-contain" />
                        </Link>
                        <p className="text-gray-400 leading-relaxed max-w-xs text-sm">
                            Making your journey comfortable, safe, and memorable. Book your bus tickets across India with ease.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="p-3 bg-white/5 rounded-full text-gray-400 hover:bg-teal-500 hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-teal-500/25 group"
                                >
                                    <Icon size={18} className="group-hover:stroke-2" />
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
                                    <Link to="#" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-2 group text-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50 group-hover:bg-teal-400 transition-colors" />
                                        {item}
                                    </Link>
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
                                    <Link to="#" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-2 group text-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50 group-hover:bg-teal-400 transition-colors" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-lg text-white mb-6">Contact Us</h3>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-gray-400 group text-sm">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-teal-500/10 transition-colors shrink-0">
                                    <MapPin size={18} className="text-teal-500" />
                                </div>
                                <span className="leading-relaxed">123 Bus Terminal Road, Transport Nagar, New Delhi, India</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400 group text-sm">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-teal-500/10 transition-colors shrink-0">
                                    <Phone size={18} className="text-teal-500" />
                                </div>
                                <span className="group-hover:text-white transition-colors">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400 group text-sm">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-teal-500/10 transition-colors shrink-0">
                                    <Mail size={18} className="text-teal-500" />
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
                        <Link to="#" className="hover:text-teal-400 transition-colors">Privacy</Link>
                        <Link to="#" className="hover:text-teal-400 transition-colors">Terms</Link>
                        <Link to="#" className="hover:text-teal-400 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
