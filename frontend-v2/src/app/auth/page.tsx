"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/client/useAuth";
import { FcGoogle } from "react-icons/fc";
import { API_BASE } from "@/constants/env";

export default function AuthPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace("/");
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="pt-16 flex justify-center items-center min-h-[calc(100vh-4rem)]">Loading...</div>;
    }

    return (
        <div className="pt-16 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
            <div className="rounded-lg p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-6">Sign in or up to Your Account</h1>
                <button
                    type="button"
                    onClick={() => window.location.href = (API_BASE + "/api/auth/google")}
                    className="flex items-center justify-center space-x-2 w-full border border-gray-300 px-4 py-2 rounded hover:shadow transition cursor-pointer"
                >
                    <FcGoogle className="h-5 w-5" />
                    <span className="font-medium">Continue with Google</span>
                </button>
            </div>
        </div>
    );
}