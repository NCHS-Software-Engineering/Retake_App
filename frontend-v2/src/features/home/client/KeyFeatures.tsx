import { motion } from 'framer-motion';
import {
    AcademicCapIcon,
    PencilSquareIcon,
    ClipboardDocumentCheckIcon,
    ChatBubbleLeftRightIcon,
    UserPlusIcon,
    ClockIcon,
    DocumentTextIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { FadeInVariants } from '../types/animation.types';

export default function KeyFeatures({ fadeIn }: { fadeIn: FadeInVariants }) {

    const features = [
        { title: 'Manage Classes & Sections', desc: 'Create, edit, and delete classes and sections effortlessly.', icon: AcademicCapIcon },
        { title: 'Assign Retake Work & Tests', desc: 'Quickly assign retake work or tests within each section.', icon: PencilSquareIcon },
        { title: 'Track Retake Requests', desc: 'Monitor all requests with a search feature and view resolved ones.', icon: ClipboardDocumentCheckIcon },
        { title: 'Grade & Provide Feedback', desc: 'Review submitted work, offer feedback, and grade tests.', icon: ChatBubbleLeftRightIcon },
        { title: 'Request Retakes', desc: 'Submit a retake request for any test or quiz.', icon: DocumentTextIcon },
        { title: 'Track Progress', desc: 'Check the status of your retake work.', icon: ClockIcon },
        { title: 'Complete & Submit', desc: 'Finish and submit retake assignments in one place.', icon: CheckBadgeIcon },
        { title: 'Add Students Manually', desc: 'Add students and assign retake work directly.', icon: UserPlusIcon },
    ];

    return (
        <section className="py-20 bg-blue-50">
            <div className="container mx-auto px-6">
                <motion.h2
                    className="text-4xl font-bold text-center text-gray-800 mb-12"
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeIn}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Key Features
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feat, idx) => (
                        <motion.div
                            key={idx}
                            className="p-6 border rounded-lg hover:shadow-lg transition bg-white transform hover:scale-105"
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeIn}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <feat.icon className="h-10 w-10 mb-4 text-blue-600" />
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                {feat.title}
                            </h3>
                            <p className="text-gray-600">{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}