import type React from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;
    return (
        <div
            className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'
            onClick={onClose} // close on outside click
        >
            <div
                className='relative bg-white rounded-lg p-6 max-w-lg w-full shadow-lg'
                onClick={(e) => e.stopPropagation()} // avoid to close on inside click
            >
                <button
                    className='absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer'
                    onClick={onClose}
                >
                    ✖
                </button>
                {children}               
            </div>
        </div>
    )
}

export default Modal;