import React from 'react';
import toast from 'react-hot-toast';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * Shows a confirmation toast.
 * @param {string} message - The message to display.
 * @param {Function} onConfirm - Function to run on confirmation.
 * @param {Function} onCancel - Function to run on cancellation (optional).
 */
export const showConfirmToast = (message, onConfirm, onCancel) => {
    toast.custom((t) => (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-[#1C1C1E] shadow-2xl rounded-2xl pointer-events-auto border border-white/10 flex ring-1 ring-black ring-opacity-5`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <FaExclamationTriangle className="h-10 w-10 text-amber-500 bg-amber-500/10 p-2 rounded-full" />
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-white">
                            Confirmation Required
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-white/10">
                <div className="w-full flex flex-col divide-y divide-white/10">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            onConfirm();
                        }}
                        className="w-full border border-transparent rounded-none rounded-tr-2xl px-4 py-3 flex items-center justify-center text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors focus:outline-none"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            if (onCancel) onCancel();
                        }}
                        className="w-full border border-transparent rounded-none rounded-br-2xl px-4 py-3 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    ), {
        duration: 5000,
    });
};
