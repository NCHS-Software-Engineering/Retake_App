"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/client/useAuth";
import { logout } from "@/features/auth/client/logout";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const router = useRouter();
    const { user, setUser } = useAuth();
    const isSignedIn = !!user;

    async function handleSignOut() {
        try {
            setIsLoggingOut(true);
            await logout();
            setUser(null);
            setIsMenuOpen(false);
            router.push("/auth");
            router.refresh();
        } finally {
            setIsLoggingOut(false);
        }
    }

    return (
        <nav className="bg-white shadow fixed top-0 w-full z-10">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Image src="/NavBarLogo.png" alt="Retake App Logo" className="h-8 w-8" width={32} height={32} />
                        <span className="text-xl font-bold text-gray-800">Retake App</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-6">
                        <Link
                            href="/about"
                            className="text-gray-600 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            About Us
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-gray-600 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Dashboard
                        </Link>
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:block">
                        {isSignedIn ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                                {!imgError ? (
                                <Image
                                    src={user.picture}
                                    alt={user.username}
                                    className="w-8 h-8 rounded-full object-cover bg-blue-500 text-white"
                                    onError={() => setImgError(true)}
                                    width={32}
                                    height={32}
                                />
                                ) : (
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                                    {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                                </span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleSignOut}
                                disabled={isLoggingOut}
                                className="cursor-pointer text-gray-600 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isLoggingOut ? "Signing out..." : "Sign Out"}
                            </button>
                        </div>
                        ) : (
                        <Link
                            href="/auth"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
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
                <Link
                    href="/about"
                    className="text-gray-600 hover:text-blue-500 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setIsMenuOpen(false)}
                >
                    About Us
                </Link>
                <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-blue-500 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Dashboard
                </Link>

                {isSignedIn ? (
                <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="text-gray-600 hover:text-blue-500 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isLoggingOut ? "Signing out..." : "Sign Out"}
                </button>
                ) : (
                <Link
                    href="/auth"
                    className="text-blue-500 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Sign In
                </Link>
                )}
                </div>
        </div>
        )}
    </nav>
    );
}