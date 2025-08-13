import { FC } from "react";
import { motion } from "framer-motion";

type Props = {
    question: {
        id: number;
        sequence: number;
        questionText: string;
        answer: {
            id: number;
            answerText: string;
            feedback?: string | null;
            isCorrect?: boolean | null;
        };
    };
    score?: number | null;
    onChange: (id: number, text: string) => void;
};

const QuestionCard: FC<Props> = ({ question, score, onChange }) => {
    const { sequence, questionText, answer } = question;
    const { id, answerText, feedback, isCorrect } = answer;

    // determine badge styling
    let badgeText: string | null = null;
    let badgeClasses = "";
    if (isCorrect === true) {
        badgeText = "Correct";
        badgeClasses = "bg-green-100 text-green-800";
    } else if (isCorrect === false) {
        badgeText = "Incorrect";
        badgeClasses = "bg-red-100 text-red-800";
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white shadow-sm rounded-2xl p-6 mb-4"
        >
            {/* Correct/Incorrect badge */}
            {badgeText !== null && typeof score === "number" && (
                <span
                    className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-semibold ${badgeClasses}`}
                >
                    {badgeText}
                </span>
            )}

            {/* Question */}
            <label className="block text-gray-800 font-medium mb-2">
                {sequence}. {questionText}
            </label>

            {/* Answer input */}
            <textarea
                value={answerText}
                onChange={(e) => onChange(id, e.currentTarget.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            {/* Feedback */}
            {feedback && feedback.trim() !== "" && (
                <div className="mt-3 text-sm text-gray-700 italic">
                    Feedback: {feedback} 
                </div>
            )}
        </motion.div>
    );
};

export default QuestionCard;
