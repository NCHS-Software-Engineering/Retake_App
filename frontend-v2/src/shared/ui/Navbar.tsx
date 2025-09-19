"use client";

import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from "@/features/auth/client/useAuth";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const { user } = useAuth();
    const isSignedIn = !!user;

    return (
        <nav className="bg-white shadow fixed top-0 w-full z-10">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <img src="/NavBarLogo.png" alt="Retake App Logo" className="h-8 w-8" />
                        <span className="text-xl font-bold text-gray-800">Retake App</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-6">
                        <Link href="/about" className="text-gray-600 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                            About Us
                        </Link>
                        <Link href="/dashboard" className="text-gray-600 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Dashboard
                        </Link>
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:block">
                        {isSignedIn ? (
                            <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                                {!imgError ? (
                                    <img
                                        src={user.picture}
                                        alt={user.username}
                                        className="w-8 h-8 rounded-full object-cover bg-blue-500 text-white"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                                        {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <Link href="/auth" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-white z-50 md:hidden">
                    <div className="flex justify-end p-4">
                        <button onClick={() => setIsMenuOpen(false)} className="text-gray-600 focus:outline-none">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center h-full space-y-8">
                        <Link href="/about" className="text-gray-600 hover:text-blue-500 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                            About Us
                        </Link>
                        <Link href="/dashboard" className="text-gray-600 hover:text-blue-500 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Dashboard
                        </Link>
                        {isSignedIn ? (
                            <div className="text-gray-600 text-xl">Profile</div>
                        ) : (
                            <Link href="/auth" className="text-blue-500 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
        
    )
}