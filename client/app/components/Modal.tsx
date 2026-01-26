'use client';

import { useEffect } from 'react';

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    title?: string; // Optional simple title if not using custom header
    className?: string; // For customizing the panel width/max-width
}

export default function Modal({ children, onClose, className = 'max-w-2xl' }: ModalProps) {
    // Lock body scroll when modal is open
    useEffect(() => {
        // Store original overflow style
        const originalStyle = window.getComputedStyle(document.body).overflow;
        
        // Lock scroll
        document.body.style.overflow = 'hidden';

        // Cleanup: unlock scroll on unmount
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
            data-lenis-prevent
        >
            <div className="flex min-h-full items-center justify-center p-4">
                <div 
                    className={`bg-white rounded-3xl w-full relative shadow-xl transform transition-all my-8 ${className}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
