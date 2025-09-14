import React, { useState, useEffect, useRef } from 'react';
import { 
  UserPlus, 
  Mail, 
  Send, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Loader,
  Users,
  Shield,
  Crown
} from 'lucide-react';

const InviteUserForm = ({ onCancel, onSubmit, loading }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const emailInputRef = useRef(null);

  // Focus email input when form opens
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email address is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    
    if (email.trim().length > 254) {
      return 'Email address is too long';
    }
    
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setSuccessMessage('');
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handleEmailBlur = () => {
    setTouched(true);
    const error = validateEmail(email);
    setErrors(prev => ({ ...prev, email: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    setTouched(true);

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    try {
      await onSubmit(email.trim(), role);
      setSuccessMessage(`Invitation sent successfully to ${email.trim()}!`);
      setEmail('');
      setRole('member');
      setTouched(false);
      setErrors({});
    } catch (err) {
      setErrors({ 
        submit: err.response?.data?.message || 'Failed to send invitation. Please try again.' 
      });
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter if form is valid
    if (e.key === 'Enter' && !errors.email && email.trim()) {
      handleSubmit(e);
    }
  };

  const getInputClassName = () => {
    const baseClasses = `w-full pl-12 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 
                        focus:outline-none focus:ring-2 transition-all duration-200`;
    
    if (errors.email && touched) {
      return `${baseClasses} border-red-500/50 focus:border-red-500 focus:ring-red-500/30`;
    }
    
    if (email && !errors.email && touched) {
      return `${baseClasses} border-green-500/50 focus:border-green-500 focus:ring-green-500/30`;
    }
    
    return `${baseClasses} border-gray-600 focus:border-blue-500 focus:ring-blue-500/30`;
  };

  const roleOptions = [
    {
      value: 'member',
      label: 'Member',
      description: 'Can create and manage their own notes',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      value: 'admin',
      label: 'Admin',
      description: 'Full access including user management',
      icon: Crown,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="space-y-6">


      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-900/20 border border-green-600/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-300">Invitation Sent!</h4>
              <p className="text-green-200 text-sm">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-4 bg-red-900/20 border border-red-600/30 rounded-xl">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-300">Invitation Failed</h4>
              <p className="text-red-200 text-sm">{errors.submit}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
        
        {/* Email Field */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <label htmlFor="invite-email" className="block text-sm font-medium text-gray-300">
              Email Address <span className="text-red-400">*</span>
            </label>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={emailInputRef}
              id="invite-email"
              type="email"
              placeholder="Enter user's email address..."
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              className={getInputClassName()}
              disabled={loading}
              autoComplete="email"
            />
            {email && !errors.email && touched && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            )}
          </div>
          
          {errors.email && touched && (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errors.email}</span>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            The user will receive an email invitation to join your workspace
          </p>
        </div>
        

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700/50">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 
                     text-gray-300 hover:text-white rounded-xl transition-all duration-200 
                     font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
          
          <button
            type="submit"
            disabled={loading || !email.trim() || errors.email}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 
                     hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 
                     font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 
                     disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Sending Invitation...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Send Invitation</span>
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
};

export default InviteUserForm;