import { motion } from "framer-motion";

import { FadeInVariants } from "../types/animation.types";

export default function HowWorks({ fadeIn }: { fadeIn: FadeInVariants }) {

    const numbers = [
        'Set Up Classes/Sections',
        'Request Retake',
        'Assign Retake Work/Test',
        'Complete Work/Test',
        'Grade & Provide Feedback',
        'Resolve Request',
    ];

    return (
        <section className="py-20 bg-green-50">
            <div className="container mx-auto px-6 flex flex-col items-center">
                <motion.h2
                    className="text-4xl font-bold text-center text-gray-800 mb-12"
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeIn}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    How It Works
                </motion.h2>
                <ol className="space-y-8 max-w-xl mx-auto">
                    {numbers.map((step, idx) => (
                        <motion.li
                            key={idx}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                    {idx + 1}
                                </div>
                            </div>
                            <p className="ml-4 p-1 text-lg text-gray-700">{step}</p>
                        </motion.li>
                    ))}
                </ol>
            </div>
        </section>
    )
}