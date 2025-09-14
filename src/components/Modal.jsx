import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md', closeOnOverlay = true }) => {
  const modalRef = useRef(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  const handleOverlayClick = (e) => {
    if (closeOnOverlay && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Size configurations
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl mx-4'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Enhanced Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={handleOverlayClick}
        aria-hidden="true"
      >
        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Modal Container */}
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} transform transition-all duration-300 scale-100 opacity-100`}
        tabIndex="-1"
      >
        {/* Modal Content */}
        <div className="bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/50">
            <div className="flex-1">
              {typeof title === 'string' ? (
                <h3 
                  id="modal-title"
                  className="text-xl font-bold text-white"
                >
                  {title}
                </h3>
              ) : (
                <div id="modal-title" className="text-xl font-bold text-white">
                  {title}
                </div>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="ml-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 
                       rounded-xl transition-all duration-200 transform hover:scale-110
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 text-white">
            {children}
          </div>

          {/* Optional Footer Gradient */}
          <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-30"></div>
        </div>
      </div>

      {/* Custom Styles for Animation */}
      <style jsx>{`
        .modal-enter {
          opacity: 0;
          transform: scale(0.95);
        }
        .modal-enter-active {
          opacity: 1;
          transform: scale(1);
          transition: opacity 300ms, transform 300ms;
        }
        .modal-exit {
          opacity: 1;
          transform: scale(1);
        }
        .modal-exit-active {
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
    </div>
  );
};

export default Modal;