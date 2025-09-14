import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../config/config';
import toast from 'react-hot-toast';
import Modal from '../components/Modal.jsx';
import NoteForm from '../components/AddNote.jsx';
import InviteUserForm from '../components/InviteUser.jsx';
import DeleteConfirmationModal from '../components/DeleteModal.jsx';
import { 
  Plus, 
  UserPlus, 
  LogOut,
  Edit,
  Trash2,
  Sparkles,
  FileText,
  Crown,
  User,
  Calendar,
  TrendingUp,
  Loader,
  AlertCircle,
  Check
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [tenant , setTenant] = useState([]);
  const[btnClicked,setbtnClicked]= useState(false)
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [subscriptionPlan ,setSubscriptionPlan] = useState("free");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [noteToDelete, setNoteToDelete] = useState(null);

  // Modal state
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [inviteUserOpen, setInviteUserOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Limit for Free plan
  const noteLimit = 3;
  const isFreePlan = subscriptionPlan === 'free';
  const remainingNotes = Math.max(0, noteLimit - notes.length);
  const isProPlan = subscriptionPlan === 'pro';

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/');
      } else {
        fetchNotes();
      }
    }
  }, [loading, user, navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate( '/');
    } catch (err) {
      console.log(err);
      toast.error('Logout failed');
    }
  };

  const fetchNotes = async () => {
    setError('');
    try {
      setLoadingNotes(true);
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (err) {
      setError('Failed to fetch notes.');
      if (err.response?.status === 401) {
        navigate('/');
      }
    } finally {
      setLoadingNotes(false);
    }
  };
  useEffect (()=>{
  const fetchTenant = async ()=>{
    try{
      const getTenant = await api.get('/tenants/tenant')
      setTenant(getTenant.data)
      setSubscriptionPlan(getTenant.data.subscriptionPlan);
    }catch(err){
      toast.error("failed to fetch tenant info")
      console.log("tenant error" ,err)
    }
  }
  fetchTenant()
  },[btnClicked])
  console.log("tenant info", tenant)
  const handleAddNoteSubmit = async note => {
    setModalLoading(true);
    try {
      const response = await api.post('/notes', note);
      setAddNoteOpen(false);
      toast.success('Note created successfully!', {
        icon: <Check className="h-4 w-4 text-green-500" />
      });
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create note.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setAddNoteOpen(true);
  };

  const handleUpdateNote = async (updatedNote) => {
    setModalLoading(true);
    try {
      await api.put(`/notes/${editingNote._id}`, updatedNote);
      setAddNoteOpen(false);
      setEditingNote(null);
      toast.success('Note updated successfully!', {
        icon: <Check className="h-4 w-4 text-green-500" />
      });
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update note.');
    } finally {
      setModalLoading(false);
    }
  };

const handleDeleteNote = (note) => {
  setNoteToDelete(note);
  setDeleteModalOpen(true);
};

const confirmDeleteNote = async () => {
  if (!noteToDelete) return;
  
  setDeletingNoteId(noteToDelete._id);
  try {
    await api.delete(`/notes/${noteToDelete._id}`);
    toast.success('Note deleted successfully!');
    setDeleteModalOpen(false);
    setNoteToDelete(null);
    fetchNotes();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to delete note.');
  } finally {
    setDeletingNoteId(null);
  }
};

// Add this function to handle modal close:
const handleDeleteModalClose = () => {
  setDeleteModalOpen(false);
  setNoteToDelete(null);
};

  const handleInviteUserSubmit = async email => {
    setModalLoading(true);
    try {
      await api.post('/invite', { email, role: 'member' });
      toast.success('Invitation sent successfully!', {
        icon: <Check className="h-4 w-4 text-green-500" />
      });
      setInviteUserOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send invite.');
    } finally {
      setModalLoading(false);
    }
  };

const handleUpgrade = async () => {
  setModalLoading(true);

  try {
    await api.post(`/tenants/${tenant.slug}/upgrade`);

    toast.success('Subscription upgraded to Pro! 🎉', {
      icon: <Crown className="h-4 w-4 text-yellow-500" />,
    });

    setbtnClicked(true)

    // Refetch and update tenant info to trigger UI update
    const updatedTenantResponse = await api.get(`/tenants/tenant`);
    setTenant(updatedTenantResponse.data);  // assuming setTenant updates your tenant state

    // Optionally refetch user if subscription info is there too
    // const updatedUserResponse = await api.get('/auth/profile');
    // setUser(updatedUserResponse.data);

    fetchNotes(); // refresh notes if needed
  } catch (err) {
    toast.error(err.response?.data?.message || 'Upgrade failed.');
  } finally {
    setModalLoading(false);
  }
};


  const closeModal = () => {
    setAddNoteOpen(false);
    setEditingNote(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 120) => {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-white">
          <Loader className="h-12 w-12 animate-spin text-blue-500" />
          <div className="text-center">
            <h2 className="text-xl font-semibold">Loading Dashboard</h2>
            <p className="text-gray-400 mt-1">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-2xl border-b border-gray-700">
        <div className=" px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Welcome back!
                </h1>
                <div className="flex items-center space-x-3 mt-2">
                  <User className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300 font-medium">{user.email}</span>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'admin' ? 'bg-purple-900 text-purple-300' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {user.role?.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-6 py-3 bg-red-600 hover:bg-red-700 
                       text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl
                       transform hover:scale-105 font-medium"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-8xl  px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Subscription Plan Card */}
        <div className={`mb-8 p-8 rounded-2xl border-2 shadow-2xl backdrop-blur-sm relative overflow-hidden ${
          isFreePlan 
            ? 'bg-gradient-to-br from-yellow-900/40 via-orange-900/40 to-red-900/40 border-yellow-500/50' 
            : 'bg-gradient-to-br from-green-900/40 via-emerald-900/40 to-teal-900/40 border-green-500/50'
        }`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl ${
                isProPlan ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' : 'bg-gradient-to-br from-yellow-600 to-orange-600'
              }`}>
                {isProPlan ? (
                  <Crown className="h-10 w-10 text-white" />
                ) : (
                  <Sparkles className="h-10 w-10 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-2xl font-bold">
                    {subscriptionPlan.toUpperCase() || "FREE"} Plan
                  </h3>
                  {isProPlan && <TrendingUp className="h-6 w-6 text-green-400" />}
                </div>
                {isFreePlan ? (
                  <div className="mt-2 space-y-1">
                    <p className="text-yellow-200">
                      {remainingNotes} of {noteLimit} notes remaining
                    </p>
                    <div className="w-48 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((noteLimit - remainingNotes) / noteLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <p className="text-green-200 mt-2 flex items-center space-x-2">
                    <Check className="h-4 w-4" />
                    <span>Unlimited notes available</span>
                  </p>
                )}
              </div>
            </div>
            
            {isFreePlan && user.role === "admin" && (
             <button
  onClick={handleUpgrade}
  disabled={modalLoading}
  className="px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 
            hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white rounded-xl 
            transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50
            font-bold text-lg transform hover:scale-105 flex items-center space-x-2"
>
  {modalLoading ? (
    <>
      <Loader className="h-5 w-5 animate-spin" />
      <span>Upgrading...</span>
    </>
  ) : (
    <>
      <Crown className="h-5 w-5" />
      <span>Upgrade to Pro</span>
    </>
  )}
</button>

            )}
          </div>
        </div>

        {/* Enhanced Admin Controls */}
        {user.role === "admin" && (
          <div className="mb-8 p-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl border border-gray-600/50 shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <span>Admin Dashboard</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setInviteUserOpen(true)}
                className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 
                         hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 
                         shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                disabled={modalLoading}
              >
                <UserPlus className="h-5 w-5" />
                <span>Invite User</span>
              </button>
              
              <div className="flex items-center space-x-2 px-4 py-3 bg-gray-700/50 rounded-xl">
                <FileText className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Total Notes: <strong className="text-white">{notes.length}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Add Note Section */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setAddNoteOpen(true)}
            disabled={modalLoading || (isFreePlan && notes.length >= noteLimit)}
            className={`group inline-flex items-center space-x-4 px-10 py-5 rounded-2xl text-xl font-bold
                     transition-all duration-300 shadow-xl hover:shadow-2xl ${
              isFreePlan && notes.length >= noteLimit
                ? "bg-gray-600/50 cursor-not-allowed text-gray-400 border border-gray-600"
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white transform hover:scale-105 border border-blue-500/30"
            }`}
          >
            <div className={`p-2 rounded-lg ${
              isFreePlan && notes.length >= noteLimit 
                ? 'bg-gray-700' 
                : 'bg-white/10 group-hover:bg-white/20'
            }`}>
              <Plus className="h-6 w-6" />
            </div>
            <span>Create New Note</span>
          </button>
          
          {isFreePlan && notes.length >= noteLimit && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-600/50 rounded-xl inline-block">
              <div className="flex items-center space-x-2 text-red-300">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">You've reached your Free plan limit!</span>
              </div>
              <p className="text-red-400 mt-1">Upgrade to Pro to create unlimited notes.</p>
            </div>
          )}
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-300">Error</h4>
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Enhanced Notes Grid */}
        {loadingNotes ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center space-y-4 text-gray-300">
              <Loader className="h-12 w-12 animate-spin text-blue-500" />
              <div className="text-center">
                <h3 className="text-xl font-semibold">Loading your notes...</h3>
                <p className="text-gray-500 mt-1">This won't take long</p>
              </div>
            </div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative">
              <div className="p-8 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full mx-auto w-32 h-32 flex items-center justify-center mb-8">
                <FileText className="h-16 w-16 text-gray-400" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-3">No notes yet</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Start your journey by creating your first note. Capture your thoughts, ideas, and inspirations!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div
                key={note._id}
                className="group bg-gradient-to-br from-gray-800 via-gray-800 to-gray-700 rounded-2xl 
                         border border-gray-600/50 shadow-xl hover:shadow-2xl transition-all duration-300 
                         hover:border-gray-500/50 overflow-hidden transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors leading-tight">
                      {note.title}
                    </h3>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/30 
                                 rounded-lg transition-all duration-200 transform hover:scale-110"
                        title="Edit note"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        disabled={deletingNoteId === note._id}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/30 
                                 rounded-lg transition-all duration-200 transform hover:scale-110
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete note"
                      >
                        {deletingNoteId === note._id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {note.content && (
                    <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                      {truncateContent(note.content)}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(note.createdAt || Date.now())}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {note.updatedAt && note.updatedAt !== note.createdAt && (
                        <div className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs font-medium">
                          Updated
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Card bottom gradient */}
                <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Modals */}
      <Modal 
        isOpen={addNoteOpen} 
        onClose={closeModal} 
        title={
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${editingNote ? 'bg-blue-600' : 'bg-green-600'}`}>
              {editingNote ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
            </div>
            <span>{editingNote ? "Edit Note" : "Create New Note"}</span>
          </div>
        }
      >
        <NoteForm 
          onCancel={closeModal} 
          onSubmit={editingNote ? handleUpdateNote : handleAddNoteSubmit} 
          loading={modalLoading}
          initialData={editingNote}
        />
      </Modal>

      <Modal 
        isOpen={inviteUserOpen} 
        onClose={() => setInviteUserOpen(false)} 
        title={
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <span>Invite New User</span>
          </div>
        }
      >
        <InviteUserForm 
          onCancel={() => setInviteUserOpen(false)} 
          onSubmit={handleInviteUserSubmit} 
          loading={modalLoading} 
        />
      </Modal>
      <DeleteConfirmationModal
  isOpen={deleteModalOpen}
  onClose={handleDeleteModalClose}
  onConfirm={confirmDeleteNote}
  title="Delete Note"
  message={`Are you sure you want to delete "${noteToDelete?.title}"? This action cannot be undone and the note will be permanently removed.`}
  confirmText="Delete Note"
  cancelText="Keep Note"
  isLoading={deletingNoteId === noteToDelete?._id}
/>
    </div>
  );
};

export default Dashboard;