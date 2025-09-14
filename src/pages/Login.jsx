import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../config/config'; 
import { 
  Mail, 
  Lock, 
  LogIn, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader,
  FileText,
  Shield,
  Users,
  Crown,
  CheckCircle
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', form);
      await fetchUser();
      // Small delay to ensure the auth state is updated properly
      setTimeout(() => {
        setLoading(false);
        // Force a page refresh to ensure proper auth state loading
        navigate( '/dashboard');
      }, 500);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const testAccounts = [
    {
      email: 'admin@acme.test',
      password: 'password',
      role: 'Admin',
      company: 'ACME Corp',
      icon: Crown,
      color: 'from-purple-500 to-pink-500'
    },
    {
      email: 'user@acme.test',
      password: 'password',
      role: 'User',
      company: 'ACME Corp',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      email: 'admin@globex.test',
      password: 'password',
      role: 'Admin',
      company: 'Globex Inc',
      icon: Crown,
      color: 'from-green-500 to-emerald-500'
    },
    {
      email: 'user@globex.test',
      password: 'password',
      role: 'User',
      company: 'Globex Inc',
      icon: Users,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const fillTestAccount = (account) => {
    setForm({ email: account.email, password: account.password });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl animate-ping delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding & Features */}
          <div className="hidden lg:block space-y-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  multi-tenant SaaS Notes Application
                </h1>
              </div>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Your digital workspace for capturing ideas, managing projects, and collaborating with your team.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Secure & Private</h3>
                  <p className="text-gray-400 text-sm">End-to-end encryption for all your notes</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Team Collaboration</h3>
                  <p className="text-gray-400 text-sm">Share and collaborate on notes with your team</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Premium Features</h3>
                  <p className="text-gray-400 text-sm">Advanced organization and unlimited storage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/50 shadow-2xl">
              
              {/* Mobile Header */}
              <div className="lg:hidden text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">multi-tenant SaaS Notes Application</h1>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
                <p className="text-gray-400">Sign in to continue to your dashboard</p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-600/50 rounded-xl flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-300">Login Failed</h4>
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl 
                               text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                               focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-xl 
                               text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                               focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 
                           hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 
                           shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 
                           disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Test Accounts Section */}
            <div className="mt-8">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Test Accounts</h3>
                <p className="text-gray-500 text-sm">Click any account to auto-fill the form</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {testAccounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => fillTestAccount(account)}
                    className="group p-4 bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/50 
                             hover:border-gray-600/50 rounded-xl transition-all duration-200 text-left
                             transform hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-gradient-to-br ${account.color} rounded-lg group-hover:scale-110 transition-transform`}>
                        <account.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-white text-sm truncate">{account.company}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            account.role === 'Admin' 
                              ? 'bg-purple-900/50 text-purple-300' 
                              : 'bg-blue-900/50 text-blue-300'
                          }`}>
                            {account.role}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs truncate">{account.email}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
                <div className="flex items-center space-x-2 text-green-300 text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">All accounts use password: "password"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;