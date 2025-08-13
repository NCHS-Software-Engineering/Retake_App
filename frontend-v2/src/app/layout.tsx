import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/features/auth/client/AuthContext";
import Navbar from "@/shared/ui/Navbar";

export const metadata: Metadata = {
    title: "Retake App",
    description: "Helps students learn.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* Metadata from Next.js */}
            </head>
            <body>
                <AuthProvider>
                    <Navbar />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
