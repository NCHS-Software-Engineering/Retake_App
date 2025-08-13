import { motion } from "framer-motion";
import Link from "next/link";

export default function LearnMore() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    className="bg-blue-100 rounded-xl shadow-lg p-10 flex flex-col items-center text-center hover:shadow-2xl transition"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <h3 className="text-2xl font-bold text-blue-700 mb-2">About Us</h3>
                    <p className="text-gray-600 mb-4">
                        Learn more about our mission to simplify retake management for teachers and students.
                    </p>
                    <Link href="/about" className="text-blue-600 font-semibold hover:underline">
                        Read More &rarr;
                    </Link>
                </motion.div>
                <motion.div
                    className="bg-green-100 rounded-xl shadow-lg p-10 flex flex-col items-center text-center hover:shadow-2xl transition"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h3 className="text-2xl font-bold text-green-700 mb-2">FAQs</h3>
                    <p className="text-gray-600 mb-4">
                        Find answers to common questions about using the platform and managing retakes.
                    </p>
                    <Link href="/faqs" className="text-green-600 font-semibold hover:underline">
                        View FAQs &rarr;
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}