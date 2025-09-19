import React from "react";
import { AssignmentInfo, StudentInfo } from "../services/attemptService";

interface HeaderProps {
    assignment: AssignmentInfo;
    student: StudentInfo;
}

export const Header: React.FC<HeaderProps> = ({ assignment, student }) => {
    const [imgError, setImgError] = React.useState(false);

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold truncate">{assignment.title}</h1>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="font-semibold">{student.username}</p>
                        <p className="text-sm text-gray-500 truncate" title={student.email}>
                            {student.email}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">
                        {student.profile?.profilePictureUrl && !imgError ? (
                            <img
                                src={student.profile.profilePictureUrl}
                                alt={student.username}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                                {student.username ? student.username.charAt(0).toUpperCase() : 'U'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Assignment Type */}
            <h3 className="text-sm uppercase text-gray-500">
                TYPE: {assignment.type}
            </h3>

            {/* Assignment Description */}
            {assignment.description && (
                <p className="italic text-base text-gray-600">
                    {assignment.description}
                </p>
            )}
        </div>
    );
};
