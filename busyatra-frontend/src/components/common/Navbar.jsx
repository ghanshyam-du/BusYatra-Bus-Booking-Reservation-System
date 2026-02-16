"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "../../utils/cn";

const NavbarContext = createContext({ isScrolled: false });

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Home", link: "/" },
        { name: "About", link: "/about" },
        { name: "Services", link: "/services" },
        { name: "Contact", link: "/contact" },
    ];

    return (
        <div className="relative w-full">
            <NavbarContext.Provider value={{ isScrolled }}>
                <motion.nav
                    initial={{ width: "100%", top: 0 }}
                    animate={{
                        width: isScrolled ? "80%" : "100%",
                        top: isScrolled ? 20 : 0,
                        borderRadius: isScrolled ? "9999px" : "0px",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={cn(
                        "fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-300 top-5",
                        isScrolled
                            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-primary/15"
                            : "bg-transparent border-b border-white/5"
                    )}
                >
                    <div className="flex items-center justify-between px-6 py-4 w-full">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <img
                                src="/logo.png"
                                alt="BusYatra"
                                className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                        </Link>

                        {/* Desktop Nav Items */}
                        <div className="hidden md:flex items-center gap-6">
                            {navItems.map((item, idx) => (
                                <Link
                                    key={idx}
                                    to={item.link}
                                    className={cn(
                                        "text-sm font-medium transition-colors relative group",
                                        isScrolled ? "text-black hover:text-primary" : "text-black hover:text-primary"
                                    )}
                                >
                                    {item.name}
                                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            <NavbarButton
                                variant="secondary"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </NavbarButton>
                            <NavbarButton
                                variant="primary"
                                onClick={() => navigate("/register")}
                            >
                                Sign Up
                            </NavbarButton>
                        </div>

                        {/* Mobile Nav Toggle */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={cn("p-2 transition-colors", isScrolled ? "text-black hover:text-primary" : "text-black")}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Nav Menu */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl rounded-b-2xl mt-2 md:hidden"
                            >
                                <div className="p-6 flex flex-col gap-4">
                                    <div className="flex flex-col gap-4 mb-6">
                                        {navItems.map((item, idx) => (
                                            <Link
                                                key={idx}
                                                to={item.link}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="text-lg font-medium text-gray-800 dark:text-gray-300 hover:text-primary transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <NavbarButton
                                            onClick={() => {
                                                navigate("/login");
                                                setIsMobileMenuOpen(false);
                                            }}
                                            variant="secondary"
                                            className="w-full justify-center text-center"
                                        >
                                            Login
                                        </NavbarButton>
                                        <NavbarButton
                                            onClick={() => {
                                                navigate("/register");
                                                setIsMobileMenuOpen(false);
                                            }}
                                            variant="primary"
                                            className="w-full justify-center text-center"
                                        >
                                            Sign Up
                                        </NavbarButton>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>
            </NavbarContext.Provider>
        </div>
    );
};

const NavbarButton = ({ children, onClick, variant = "primary", className }) => {
    const { isScrolled } = useContext(NavbarContext);
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-5 py-2 rounded-full text-sm font-bold transition-all transform active:scale-95",
                variant === "primary"
                    ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25"
                    : cn(
                        "border hover:bg-black/5 transition-colors",
                        isScrolled
                            ? "text-black border-black/10 hover:bg-black/5 hover:text-primary"
                            : "text-black border-gray-200 dark:border-white/10 dark:hover:bg-white/10"
                    ),
                className
            )}
        >
            {children}
        </button>
    );
};

export default Navbar;
