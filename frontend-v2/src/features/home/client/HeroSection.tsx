import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/features/auth/client/useAuth';
import { FadeInVariants } from '../types/animation.types';

export default function HeroSection({ fadeIn }: { fadeIn: FadeInVariants }) {
    const { user } = useAuth();

    return (
        <section className="min-h-screen bg-gradient-to-b from-blue-500 to-green-500 flex items-center">
            <motion.div
                className="container mx-auto px-6 text-center"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-5xl font-extrabold text-white mb-4">
                    Redo, Remake, Retake!
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                    Platform for teachers to assign retake work and tests, and for students to request and complete all in one place.
                </p>
                <div className="flex justify-center gap-4">
                    {!user ? (
                        <>
                            <Link
                                href="/auth"
                                className="px-6 py-3 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
                            >
                                Start Managing Retakes
                            </Link>
                            <Link
                                href="/auth"
                                className="px-6 py-3 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition"
                            >
                                Request a Retake Now
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/dashboard"
                            className="px-6 py-3 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition"
                        >
                            Go to Dashboard
                        </Link>
                    )}
                </div>
            </motion.div>
        </section>
    )
}