import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@pjntech.com');
  const [password, setPassword] = useState('pjn@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // If visitor was redirected by a route guard, preserve destination
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Employee ID / Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);

    // Simulate network authentication request
    setTimeout(() => {
      setLoading(false);
      // NOTICE: No client-supplied role or employee ID is passed!
      // The auth service derives identity and permissions strictly from the server registry.
      const result = login(email.trim(), password);

      if (result.success) {
        navigate(fromLocation, { replace: true });
      } else {
        setError(result.error || 'Authentication rejected. Access denied.');
      }
    }, 500);
  };

  const fillQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demoPass123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F7FC] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Brand Header */}
      <div className="w-full max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#6338DF] text-white shadow-lg shadow-purple-500/20 mb-3">
          <span className="font-bold text-2xl tracking-tight">P</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161A3D] tracking-tight">
          PJN Tech
        </h1>
        <p className="text-sm font-semibold text-[#6338DF] uppercase tracking-wider mt-0.5">
          Human Resource Management System
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Enterprise Role-Based Access Control (RBAC) Portal
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="text-xs text-gray-500 mt-1">
            Permissions are derived from your authenticated enterprise role
          </p>
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication Notice</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Employee ID / Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Employee ID / Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                placeholder="e.g. admin@pjntech.com or EMP-001"
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6338DF] focus:border-transparent transition-all"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password with eye toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); alert('For demo verification, click any of the Quick Fill buttons below.'); }}
                className="text-xs font-medium text-[#6338DF] hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6338DF] focus:border-transparent transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Login CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-[#6338DF] hover:bg-[#5229cb] text-white font-semibold rounded-xl text-sm shadow-md shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-[#6338DF] focus:ring-offset-2 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Verifying Authorization...</span>
              </>
            ) : (
              <>
                <span>Sign In with Role</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Role Tester Switcher */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Test Role Personas
            </p>
            <span className="text-[10px] text-[#6338DF] font-medium">Click to populate</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('admin@pjntech.com')}
              className={`p-2.5 text-xs border rounded-xl font-medium text-left transition-all ${
                email === 'admin@pjntech.com'
                  ? 'border-[#6338DF] bg-purple-50/60 ring-2 ring-[#6338DF]/20'
                  : 'border-gray-200 bg-gray-50/70 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Admin</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-purple-100 text-[#6338DF]">Full Org</span>
              </div>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">admin@pjntech.com</p>
            </button>

            <button
              type="button"
              onClick={() => fillQuickDemo('hr@pjntech.com')}
              className={`p-2.5 text-xs border rounded-xl font-medium text-left transition-all ${
                email === 'hr@pjntech.com'
                  ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                  : 'border-gray-200 bg-gray-50/70 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">HR Admin</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-blue-100 text-blue-700">HR Ops</span>
              </div>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">hr@pjntech.com</p>
            </button>

            <button
              type="button"
              onClick={() => fillQuickDemo('imran@pjntech.com')}
              className={`p-2.5 text-xs border rounded-xl font-medium text-left transition-all ${
                email === 'imran@pjntech.com'
                  ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                  : 'border-gray-200 bg-gray-50/70 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Manager</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-700">Team Leads</span>
              </div>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">imran@pjntech.com</p>
            </button>

            <button
              type="button"
              onClick={() => fillQuickDemo('jagadeesh@pjntech.com')}
              className={`p-2.5 text-xs border rounded-xl font-medium text-left transition-all ${
                email === 'jagadeesh@pjntech.com'
                  ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                  : 'border-gray-200 bg-gray-50/70 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Employee</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-700">Self Only</span>
              </div>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">jagadeesh@pjntech.com</p>
            </button>
          </div>
        </div>
      </div>

      {/* Security Architecture Note */}
      <div className="mt-6 text-center max-w-md">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-[#6338DF] border border-purple-100">
          <ShieldCheck size={14} />
          Role-Based Access Control Active â€¢ Deny by Default
        </span>
      </div>
    </div>
  );
};
