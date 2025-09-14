import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Note",
  message = "Are you sure you want to delete this note? This action cannot be undone.",
  confirmText = "Delete Note",
  cancelText = "Cancel",
  isLoading = false
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Enhanced Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
        <div className="bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          
          {/* Header with Warning Icon */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gradient-to-r from-red-900/20 to-orange-900/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 id="delete-modal-title" className="text-lg font-bold text-white">
                  {title}
                </h3>
                <p className="text-red-300 text-sm">Destructive Action</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 
                       rounded-xl transition-all duration-200 transform hover:scale-110
                       disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close confirmation dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-red-900/30 rounded-lg mt-1">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-gray-300 leading-relaxed mb-4">
                  {message}
                </p>
                
                {/* Warning Box */}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-700/50 bg-gray-800/30">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 
                       text-gray-300 hover:text-white rounded-xl transition-all duration-200 
                       font-medium disabled:opacity-50 disabled:cursor-not-allowed
                       transform hover:scale-105"
            >
              <X className="h-4 w-4" />
              <span>{cancelText}</span>
            </button>
            
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 
                       hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 
                       font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 
                       disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>{confirmText}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;