import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, Lock, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';

export const Forbidden: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const state = location.state as { attemptedPath?: string; requiredRoles?: string[] } | null;
  const attemptedPath = state?.attemptedPath;
  const requiredRoles = state?.requiredRoles;

  return (
    <div className="min-h-screen bg-[#F6F5FC] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Brand Header */}
      <div className="w-full max-w-lg text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#6534E8] text-white shadow-lg shadow-purple-500/20 mb-3">
          <span className="font-bold text-2xl tracking-tight">P</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#151936] tracking-tight">
          PJN Tech HRMS
        </h1>
        <p className="text-xs font-semibold text-[#6534E8] uppercase tracking-wider mt-0.5">
          Access Authorization Gateway
        </p>
      </div>

      {/* 403 Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 sm:p-8 text-center">
        {/* Warning Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-4 border border-red-100">
          <ShieldAlert size={32} />
        </div>

        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 tracking-wide uppercase mb-3">
          Error 403 • HTTP Forbidden
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Access Restricted
        </h2>

        <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
          You do not have administrative clearance to access this module. Your current enterprise role is restricted by organization policy.
        </p>

        {/* Current User Session Identity Card */}
        {user ? (
          <div className="mt-5 p-4 rounded-xl bg-gray-50 border border-gray-200/80 text-left space-y-2">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Logged in identity:</span>
              <span className="font-bold text-gray-900">{user.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Employee ID:</span>
              <span className="font-mono text-gray-700">{user.id}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Assigned Role:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                user.role === 'ADMIN' ? 'bg-purple-100 text-[#6534E8]' :
                user.role === 'HR' ? 'bg-blue-100 text-blue-700' :
                user.role === 'MANAGER' ? 'bg-amber-100 text-amber-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {user.role}
              </span>
            </div>
            {attemptedPath && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Attempted URL:</span>
                <span className="font-mono text-red-600 font-semibold truncate max-w-[200px]">{attemptedPath}</span>
              </div>
            )}
            {requiredRoles && requiredRoles.length > 0 && (
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-500 font-medium">Required Roles:</span>
                <span className="font-semibold text-gray-700">{requiredRoles.join(' or ')}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 p-3 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200">
            No active session detected.
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-5 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-800 text-left flex items-start gap-2.5">
          <Lock size={15} className="shrink-0 mt-0.5 text-blue-600" />
          <p>
            Enterprise RBAC rules deny unprivileged navigation by default. If your team duties require higher access, please contact HR Operations or your Department Head.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard')}
            icon={<LayoutDashboard size={16} />}
          >
            Go to My Dashboard
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            icon={<UserCheck size={16} />}
          >
            Switch Account / Login
          </Button>
        </div>
      </div>
    </div>
  );
};
