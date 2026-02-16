import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Facebook, Twitter, Instagram, Linkedin,
    Mail, Phone, MapPin,
    Bus, Shield, Headphones,
    Star, Heart, Smartphone, ChevronRight
} from 'lucide-react';

const footerLinks = {
    company: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '#' },
        { name: 'Press', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Contact Us', href: '/contact' },
    ],
    support: [
        { name: 'Help Center', href: '#' },
        { name: 'Safety', href: '#' },
        { name: 'Cancellation', href: '#' },
        { name: 'Refund Policy', href: '#' },
        { name: 'Report Issue', href: '#' },
    ],
    legal: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
        { name: 'Sitemap', href: '#' },
    ],
};

const stats = [
    { icon: Bus, value: '5,000+', label: 'Routes' },
    { icon: Star, value: '4.8★', label: 'Rating' },
    { icon: Shield, value: '100%', label: 'Secure' },
    { icon: Headphones, value: '24/7', label: 'Support' },
];

const socials = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
];

const Footer = () => {
    return (
        <footer className="relative bg-[#0a0a0a] overflow-hidden">
            {/* Top Glow Bar */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-primary/8 blur-[120px] pointer-events-none" />

            {/* Stats Row */}
            <div className="border-b border-white/5">
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 hover:bg-white/4 transition-colors group"
                            >
                                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                                    <stat.icon size={20} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-lg leading-tight">{stat.value}</p>
                                    <p className="text-gray-500 text-xs font-medium">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Footer Grid */}
            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 text-left">
                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="inline-flex items-center gap-2 group">
                            <img
                                src="/logo.png"
                                alt="BusYatra"
                                className="h-12 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm max-w-xs">
                            India's most trusted bus booking platform. Safe, comfortable, and affordable travel across 5,000+ routes nationwide.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-3">
                            {socials.map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                                    aria-label={social.label}
                                >
                                    <social.icon size={18} />
                                </motion.a>
                            ))}
                        </div>

                        {/* App Download Hint */}
                        <div className="p-4 rounded-2xl bg-white/3 ring-1 ring-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-orange-500 flex items-center justify-center shrink-0">
                                    <Smartphone size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-bold">Get the App</p>
                                    <p className="text-gray-500 text-xs">Coming soon on iOS &amp; Android</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Company</h4>
                        <ul className="space-y-3.5">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-gray-400 hover:text-primary text-sm font-medium transition-colors flex items-center gap-2 group"
                                    >
                                        <ChevronRight size={14} className="text-gray-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Support</h4>
                        <ul className="space-y-3.5">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-gray-400 hover:text-primary text-sm font-medium transition-colors flex items-center gap-2 group"
                                    >
                                        <ChevronRight size={14} className="text-gray-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="lg:col-span-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Get in Touch</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
                                    <MapPin size={18} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm font-medium">123 Bus Terminal Road</p>
                                    <p className="text-gray-500 text-xs">Transport Nagar, New Delhi, India</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
                                    <Phone size={18} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">+91 98765 43210</p>
                                    <p className="text-gray-500 text-xs">Mon - Sat, 9am - 8pm</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
                                    <Mail size={18} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">support@busyatra.com</p>
                                    <p className="text-gray-500 text-xs">We reply within 24 hours</p>
                                </div>
                            </div>
                        </div>

                        {/* Legal Links */}
                        <div className="mt-8">
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Legal</h4>
                            <div className="flex flex-wrap gap-2">
                                {footerLinks.legal.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-primary bg-white/3 hover:bg-primary/5 rounded-lg ring-1 ring-white/5 hover:ring-primary/20 transition-all"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5">
                <div className="container mx-auto px-4 md:px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-600 text-xs font-medium">
                            © {new Date().getFullYear()} BusYatra. All rights reserved. Made with{' '}
                            <Heart size={10} className="inline text-primary fill-primary" /> in India.
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                All systems operational
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom-right decorative blob */}
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        </footer>
    );
};

export default Footer;
