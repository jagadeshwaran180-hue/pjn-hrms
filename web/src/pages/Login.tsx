import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@pjntech.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation state
    if (!email.trim()) {
      setError('Employee ID / Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);

    // Simulate mock authentication delay
    setTimeout(() => {
      setLoading(false);
      if (email.toLowerCase().includes('pjntech.com') || email.startsWith('EMP-')) {
        localStorage.setItem('pjn_demo_auth', JSON.stringify({ email, role: 'ADMIN' }));
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Use any @pjntech.com email for mock login.');
      }
    }, 700);
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
          Secure enterprise workforce & attendance portal
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="text-xs text-gray-500 mt-1">
            Enter your employee credentials to access the portal
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
                onClick={(e) => { e.preventDefault(); alert('Demo mode: Use admin@pjntech.com / any password to sign in.'); }}
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
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Mock quick switcher */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center mb-2.5">
            Quick Fill Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('admin@pjntech.com')}
              className="px-2.5 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium text-center truncate transition-colors"
            >
              Admin / HR
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('jagadeesh@pjntech.com')}
              className="px-2.5 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium text-center truncate transition-colors"
            >
              Employee (Jagadeesh)
            </button>
          </div>
        </div>
      </div>

      {/* Scope disclaimer pill */}
      <div className="mt-6 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-[#6338DF] border border-purple-100">
          <CheckCircle2 size={13} />
          Day 1 UI Specification • Mock Data Mode Only
        </span>
      </div>
    </div>
  );
};
