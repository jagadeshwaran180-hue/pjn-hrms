import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // If visitor was redirected by a route guard, preserve destination
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const isDev = import.meta.env.DEV;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your Employee ID or email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    // Authority check strictly derived from backend / auth registry
    const result = login(trimmedEmail, password);
    setLoading(false);

    if (result.success) {
      navigate(fromLocation, { replace: true });
    } else {
      setError(result.error || 'Invalid credentials. Access denied.');
    }
  };

  const fillQuickDemo = (demoEmail: string, demoPass: string = 'pjn@2026') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8FE] overflow-x-hidden selection:bg-[#5B2FE3] selection:text-white">
      {/* ========================================================= */}
      {/* LEFT: Branding Panel (~46% width, Navy-Purple Gradient)   */}
      {/* ========================================================= */}
      <div
        className="hidden lg:flex lg:w-[46%] xl:w-[45%] text-white flex-col justify-between relative overflow-hidden select-none shrink-0"
        style={{
          background: 'linear-gradient(150deg, #110B35 0%, #191147 40%, #291666 100%)',
        }}
      >
        {/* Subtle dot pattern grid in top-right */}
        <div
          className="absolute top-6 right-6 w-72 h-72 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'radial-gradient(rgba(180, 155, 255, 0.45) 1.5px, transparent 1.5px)',
            backgroundSize: '18px 18px',
          }}
          aria-hidden="true"
        />

        {/* Ambient background glow */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Top Header & Branding */}
        <div className="relative z-10 p-10 xl:p-14 pb-0">
          <div className="flex items-center gap-3">
            {/* 3D Isometric Logo Icon */}
            <img
              src="/assets/pjn-logo-icon.png"
              alt="PJN Tech Logo"
              className="w-10 h-10 object-contain drop-shadow-md"
              onError={(e) => {
                // Fallback to SVG if PNG fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-xs">
              PJN Tech
            </span>
          </div>

          {/* Headline & Supporting Text */}
          <div className="mt-12 xl:mt-16 max-w-md">
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
              Your<br />
              workplace,<br />
              connected.
            </h1>
            <p className="text-base xl:text-lg text-slate-300/90 mt-5 leading-relaxed font-normal">
              Manage attendance, leave and your workday in one place.
            </p>
          </div>
        </div>

        {/* Bottom: Employees Check-In Illustration */}
        <div className="relative z-10 w-full mt-auto pt-6 flex flex-col justify-end">
          <img
            src="/assets/checkin-illustration.png"
            alt="Employees using attendance check-in terminal"
            className="w-full object-contain object-bottom pointer-events-none select-none max-h-[340px] xl:max-h-[380px]"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT: Sign-in Panel (Soft Lavender Gradient Background)  */}
      {/* ========================================================= */}
      <div
        className="w-full lg:w-[54%] xl:w-[55%] flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 xl:p-16 min-h-screen relative"
        style={{
          background: 'radial-gradient(120% 100% at 100% 0%, #DEC7FD 0%, #FAF8FE 40%, #F4F0FD 75%, #E6D8FE 100%)',
        }}
      >
        <div className="w-full max-w-[420px] mx-auto my-auto py-8">
          {/* Mobile-only compact brand logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img
              src="/assets/pjn-logo-icon.png"
              alt="PJN Tech Logo"
              className="w-9 h-9 object-contain drop-shadow-sm"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-2xl font-bold tracking-tight text-[#110B35]">
              PJN Tech
            </span>
          </div>

          {/* Heading & Subtitle */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-[36px] font-extrabold text-[#111827] tracking-tight leading-tight">
              Welcome back
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-2 font-normal">
              Sign in to PJN Tech HRMS
            </p>
          </div>

          {/* Inline Error Notice */}
          {error && (
            <div
              role="alert"
              className="mb-6 p-3.5 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200 shadow-xs"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1 leading-relaxed">
                <p className="font-semibold text-red-800">Authentication Error</p>
                <p className="mt-0.5 text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleLogin} noValidate className="space-y-5">
            {/* Employee ID / Email Input */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs sm:text-sm font-semibold text-[#111827] mb-2"
              >
                Employee ID / Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail size={18} />
                </span>
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  disabled={loading}
                  placeholder="Enter your employee ID or email"
                  autoComplete="username"
                  className="w-full h-[50px] pl-10 pr-3.5 bg-white/90 border border-[#E2E8F0] rounded-xl text-sm text-[#111827] placeholder:text-[#94A3B8] shadow-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B2FE3] focus:border-transparent transition-all disabled:opacity-60 disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs sm:text-sm font-semibold text-[#111827] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock size={18} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  disabled={loading}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full h-[50px] pl-10 pr-11 bg-white/90 border border-[#E2E8F0] rounded-xl text-sm text-[#111827] placeholder:text-[#94A3B8] shadow-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B2FE3] focus:border-transparent transition-all disabled:opacity-60 disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#5B2FE3] rounded-md transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Right-aligned Forgot Password Link */}
              <div className="flex justify-end mt-2.5">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs sm:text-sm font-semibold text-[#5B2FE3] hover:text-[#4C24C9] hover:underline focus:outline-none focus:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Full-width Vibrant Purple Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] bg-[#5B2FE3] hover:bg-[#4C24C9] text-white font-semibold rounded-xl text-sm sm:text-base shadow-md shadow-purple-500/20 transition-all active:scale-[0.99] motion-reduce:transform-none flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#5B2FE3] focus:ring-offset-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Secure Employee Access Footer */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#64748B] mt-8 select-none">
            <Lock size={14} className="text-[#64748B] shrink-0" />
            <span>Secure employee access</span>
          </div>

          {/* Collapsible Demo Accounts (Development & Demo Testing Only) */}
          {isDev && (
            <details className="mt-8 pt-5 border-t border-purple-200/50 group">
              <summary className="text-xs font-medium text-[#64748B] hover:text-[#111827] cursor-pointer select-none flex items-center justify-between list-none">
                <span>Demo Accounts (Development Only)</span>
                <span className="text-[10px] text-[#5B2FE3] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-3 grid grid-cols-2 gap-2 text-left">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin@pjntech.com', 'pjn@2026')}
                  className="p-2 border border-purple-100 rounded-lg bg-white/70 hover:border-[#5B2FE3] hover:bg-white text-left transition-all shadow-2xs"
                >
                  <p className="text-xs font-semibold text-[#111827]">Admin</p>
                  <p className="text-[10px] text-[#64748B] truncate">admin@pjntech.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('hr@pjntech.com', 'pjn@2026')}
                  className="p-2 border border-purple-100 rounded-lg bg-white/70 hover:border-[#5B2FE3] hover:bg-white text-left transition-all shadow-2xs"
                >
                  <p className="text-xs font-semibold text-[#111827]">HR Admin</p>
                  <p className="text-[10px] text-[#64748B] truncate">hr@pjntech.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('imran@pjntech.com', 'pjn@2026')}
                  className="p-2 border border-purple-100 rounded-lg bg-white/70 hover:border-[#5B2FE3] hover:bg-white text-left transition-all shadow-2xs"
                >
                  <p className="text-xs font-semibold text-[#111827]">Manager</p>
                  <p className="text-[10px] text-[#64748B] truncate">imran@pjntech.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('jagadeesh@pjntech.com', 'pjn@2026')}
                  className="p-2 border border-purple-100 rounded-lg bg-white/70 hover:border-[#5B2FE3] hover:bg-white text-left transition-all shadow-2xs"
                >
                  <p className="text-xs font-semibold text-[#111827]">Employee</p>
                  <p className="text-[10px] text-[#64748B] truncate">jagadeesh@pjntech.com</p>
                </button>
              </div>
            </details>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* Password Recovery Help Modal                              */}
      {/* ========================================================= */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-lg p-1 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-10 h-10 rounded-full bg-purple-50 text-[#5B2FE3] flex items-center justify-center mb-3">
              <CheckCircle2 size={20} />
            </div>

            <h3 id="forgot-modal-title" className="text-lg font-bold text-[#111827]">
              Password Recovery
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
              Enterprise accounts are provisioned and managed by your organization.
              To reset your password, please contact your HR department or IT Helpdesk
              at <span className="font-semibold text-[#111827]">admin@pjntech.com</span>.
            </p>

            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full h-10 mt-5 bg-[#5B2FE3] hover:bg-[#4C24C9] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
