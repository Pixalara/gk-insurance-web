'use client';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    onConfirm,
    onCancel
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-600 text-sm">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}
