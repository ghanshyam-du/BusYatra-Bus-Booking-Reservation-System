"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import { Menu, X, Bus } from "lucide-react";

const NavbarContext = createContext({ isScrolled: false });

export const Navbar = ({ children, className }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
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
                    "fixed z-50 left-1/2 -translate-x-1/2 transition-all duration-300",
                    isScrolled
                        ? "bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg shadow-teal-900/20"
                        : "bg-transparent border-b border-white/5",
                    className
                )}
            >
                {children}
            </motion.nav>
        </NavbarContext.Provider>
    );
};

export const NavBody = ({ children, className }) => {
    return (
        <div className={cn("flex items-center justify-between px-6 py-4 w-full", className)}>
            {children}
        </div>
    );
};

export const NavbarLogo = () => {
    const { isScrolled } = useContext(NavbarContext);
    return (
        <Link to="/" className="flex items-center gap-2 group">
            <div className="relative group-hover:scale-110 transition-transform duration-300">
                <div className="absolute -inset-1 bg-linear-to-r from-teal-500 to-emerald-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-200"></div>
                <img src="/logo-light.png" alt="BusYatra" className="relative w-8 h-8 object-contain" />
            </div>
            <span className={cn(
                "text-xl font-bold bg-clip-text text-transparent bg-linear-to-r transition-colors duration-300 hidden sm:block",
                isScrolled
                    ? "from-teal-400 via-emerald-400 to-teal-200"
                    : "from-slate-800 via-teal-700 to-slate-800 dark:from-white dark:via-gray-200 dark:to-white"
            )}>
                BusYatra
            </span>
        </Link>
    );
};

export const NavItems = ({ items, className }) => {
    const { isScrolled } = useContext(NavbarContext);
    return (
        <div className={cn("hidden md:flex items-center gap-6", className)}>
            {items.map((item, idx) => (
                <Link
                    key={idx}
                    to={item.link}
                    className={cn(
                        "text-sm font-medium transition-colors relative group",
                        isScrolled ? "text-gray-300 hover:text-teal-400" : "text-gray-600 dark:text-gray-300 hover:text-teal-600"
                    )}
                >
                    {item.name}
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
            ))}
        </div>
    );
};

export const NavbarButton = ({ children, onClick, variant = "primary", className }) => {
    const { isScrolled } = useContext(NavbarContext);
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-5 py-2 rounded-full text-sm font-bold transition-all transform active:scale-95",
                variant === "primary"
                    ? "bg-linear-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-500/25"
                    : cn(
                        "border hover:bg-black/5 transition-colors",
                        isScrolled
                            ? "text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"
                            : "text-gray-700 border-gray-200 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/10"
                    ),
                className
            )}
        >
            {children}
        </button>
    );
};

export const MobileNav = ({ children, className }) => {
    return <div className={cn("md:hidden", className)}>{children}</div>;
};

export const MobileNavHeader = ({ children, className }) => {
    return <div className={cn("flex items-center justify-between px-4 py-3", className)}>{children}</div>;
};

export const MobileNavToggle = ({ isOpen, onClick }) => {
    const { isScrolled } = useContext(NavbarContext);
    return (
        <button onClick={onClick} className={cn("p-2 transition-colors", isScrolled ? "text-gray-300 hover:text-white" : "text-gray-700 dark:text-white")}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
    );
};

export const MobileNavMenu = ({ children, isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl rounded-b-2xl mt-2"
                >
                    <div className="p-6 flex flex-col gap-4">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
