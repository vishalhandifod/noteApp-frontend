import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Edit, 
  Save, 
  X, 
  AlertCircle, 
  Loader,
  Type,
  AlignLeft
} from 'lucide-react';

const NoteForm = ({ onCancel, onSubmit, loading, initialData = null }) => {
  const [note, setNote] = useState({ title: '', content: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const titleInputRef = useRef(null);
  
  const isEditing = !!initialData;

  // Initialize form with data for editing
  useEffect(() => {
    if (initialData) {
      setNote({
        title: initialData.title || '',
        content: initialData.content || ''
      });
    } else {
      setNote({ title: '', content: '' });
    }
    setErrors({});
    setTouched({});
  }, [initialData]);

  // Focus title input when form opens
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) {
          return 'Title is required';
        }
        if (value.trim().length < 3) {
          return 'Title must be at least 3 characters long';
        }
        if (value.trim().length > 100) {
          return 'Title must be less than 100 characters';
        }
        return '';
      case 'content':
        if (value.length > 2000) {
          return 'Content must be less than 2000 characters';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    
    setNote(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = e => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(note).forEach(field => {
      const error = validateField(field, note[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched({ title: true, content: true });

    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      const trimmedNote = {
        title: note.title.trim(),
        content: note.content.trim()
      };
      onSubmit(trimmedNote);
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter / Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClasses = `w-full px-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 
                        focus:outline-none focus:ring-2 transition-all duration-200 resize-none`;
    
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClasses} border-red-500/50 focus:border-red-500 focus:ring-red-500/30`;
    }
    
    return `${baseClasses} border-gray-600 focus:border-blue-500 focus:ring-blue-500/30`;
  };

  const characterCount = note.content.length;
  const maxContentLength = 2000;
  const isContentNearLimit = characterCount > maxContentLength * 0.8;

  return (
    <div className="space-y-6">

      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
        
        {/* Title Field */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Type className="h-4 w-4 text-gray-400" />
            <label htmlFor="note-title" className="block text-sm font-medium text-gray-300">
              Title <span className="text-red-400">*</span>
            </label>
          </div>
          
          <input
            ref={titleInputRef}
            id="note-title"
            name="title"
            type="text"
            placeholder="Enter a descriptive title for your note..."
            value={note.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName('title')}
            disabled={loading}
            maxLength={100}
          />
          
          {errors.title && touched.title && (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errors.title}</span>
            </div>
          )}
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Use a clear, descriptive title</span>
            <span>{note.title.length}/100</span>
          </div>
        </div>

        {/* Content Field */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <AlignLeft className="h-4 w-4 text-gray-400" />
            <label htmlFor="note-content" className="block text-sm font-medium text-gray-300">
              Content
            </label>
          </div>
          
          <textarea
            id="note-content"
            name="content"
            placeholder="Write your note content here... (optional)"
            value={note.content}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName('content')}
            rows={6}
            disabled={loading}
            maxLength={maxContentLength}
          />
          
          {errors.content && touched.content && (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errors.content}</span>
            </div>
          )}
          
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Press Ctrl+Enter to save quickly</span>
            <span className={`${isContentNearLimit ? 'text-yellow-400' : 'text-gray-500'}`}>
              {characterCount}/{maxContentLength}
            </span>
          </div>
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
            disabled={loading || !note.title.trim() || Object.keys(errors).some(key => errors[key])}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                     hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 
                     font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 
                     disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isEditing ? 'Update Note' : 'Create Note'}</span>
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
};

export default NoteForm;