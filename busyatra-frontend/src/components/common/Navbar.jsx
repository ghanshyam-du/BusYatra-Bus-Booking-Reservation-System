"use client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Navbar as ResizableNavbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "../ui/resizable-navbar";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const navItems = [
        { name: "Home", link: "/" },
        { name: "About", link: "/about" },
        { name: "Services", link: "/services" },
        { name: "Contact", link: "/contact" },
    ];

    return (
        <div className="relative w-full">
            <ResizableNavbar className="top-5">
                <NavBody>
                    <NavbarLogo />
                    <NavItems items={navItems} />
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
                </NavBody>

                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
                        <div className="flex flex-col gap-4 mb-6">
                            {navItems.map((item, idx) => (
                                <Link
                                    key={idx}
                                    to={item.link}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-medium text-gray-300 hover:text-teal-400 transition-colors"
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
                    </MobileNavMenu>
                </MobileNav>
            </ResizableNavbar>
        </div>
    );
};

export default Navbar;
