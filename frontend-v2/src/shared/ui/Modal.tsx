"use client";

import { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-300 relative">
            <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                onClick={onClose}
                aria-label="Close"
                type="button"
            >
                {/* Heroicons XMarkIcon (Outline) */}
                <XMarkIcon className="w-6 h-6 text-red-500 hover:cursor-pointer" />
            </button>
            {children}
            </div>
        </div>
    );
}