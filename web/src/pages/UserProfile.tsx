import React, { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Calendar,
  Briefcase,
  MapPin,
  Shield,
  Award,
  Camera,
  Edit3,
  Lock,
  CalendarPlus,
  Laptop,
  CheckCircle2,
  XCircle,
  Phone,
  Save,
  Download,
  ClipboardList
} from 'lucide-react';
import { Card, Badge, Button, Modal } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

type ModalKey =
  | 'editProfile'
  | 'changePassword'
  | 'downloadReport'
  | 'applyLeave'
  | 'requestHybrid'
  | 'viewAttendance'
  | null;

const mockAttendanceHistory = [
  { date: '15 Nov 2026', checkIn: '09:02 AM', checkOut: '06:11 PM', hours: '9h 09m', status: 'Present', mode: 'In-House' },
  { date: '14 Nov 2026', checkIn: '09:18 AM', checkOut: '06:05 PM', hours: '8h 47m', status: 'Present', mode: 'Hybrid' },
  { date: '13 Nov 2026', checkIn: '08:58 AM', checkOut: '06:00 PM', hours: '9h 02m', status: 'Present', mode: 'In-House' },
  { date: '12 Nov 2026', checkIn: '-', checkOut: '-', hours: '-', status: 'On Leave', mode: '-' },
  { date: '11 Nov 2026', checkIn: '09:05 AM', checkOut: '06:15 PM', hours: '9h 10m', status: 'Present', mode: 'In-House' },
  { date: '10 Nov 2026', checkIn: '09:30 AM', checkOut: '06:00 PM', hours: '8h 30m', status: 'Late', mode: 'Hybrid' },
  { date: '09 Nov 2026', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', status: 'Present', mode: 'In-House' },
];

const mockLeaveBalance = [
  { type: 'Annual Leave', total: 18, used: 4, remaining: 14, color: '#6534E8' },
  { type: 'Sick Leave', total: 12, used: 4, remaining: 8, color: '#EF4444' },
  { type: 'Casual Leave', total: 6, used: 1, remaining: 5, color: '#F59E0B' },
];

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* User profile state derived from authenticated session */
  const [profile, setProfile] = useState({
    name: user?.name || 'Authorized User',
    email: user?.email || 'user@pjntech.com',
    phone: '+91 98765 43210',
    designation: user?.designation || 'Team Member',
    department: user?.department || 'Engineering',
    location: 'Bangalore Headquarters (EcoWorld, BLR-HQ)',
  });

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        designation: user.designation,
        department: user.department,
      }));
    }
  }, [user]);

  const [editForm, setEditForm] = useState({ ...profile });

  /* password form */
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwStrength, setPwStrength] = useState(0);
  const [pwSaved, setPwSaved] = useState(false);

  /* leave form */
  const [leaveForm, setLeaveForm] = useState({
    type: 'Annual Leave',
    from: '',
    to: '',
    reason: '',
  });
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  /* hybrid form */
  const [hybridForm, setHybridForm] = useState({
    from: '',
    to: '',
    reason: '',
  });
  const [hybridSubmitted, setHybridSubmitted] = useState(false);

  /* report download */
  const [reportType, setReportType] = useState('Monthly Attendance');
  const [reportMonth, setReportMonth] = useState('November 2026');
  const [reportDownloaded, setReportDownloaded] = useState(false);

  /* active modal */
  const [activeModal, setActiveModal] = useState<ModalKey>(null);
  const openModal = (key: ModalKey) => {
    setPwSaved(false);
    setLeaveSubmitted(false);
    setHybridSubmitted(false);
    setReportDownloaded(false);
    setActiveModal(key);
  };
  const closeModal = () => setActiveModal(null);

  /* avatar upload */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* password strength */
  const calcStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  /* Save profile: Enforces that role, id, and permissions cannot be changed! */
  const saveProfile = () => {
    setProfile({
      ...profile,
      phone: editForm.phone,
      location: editForm.location,
    });
    closeModal();
  };

  /* save password */
  const savePassword = () => {
    if (pwForm.newPw !== pwForm.confirm || pwForm.newPw.length < 8) return;
    setPwSaved(true);
    setPwForm({ current: '', newPw: '', confirm: '' });
    setPwStrength(0);
  };

  /* submit leave */
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  const submitLeave = async () => {
    setLeaveError(null);
    if (!leaveForm.from.trim() || !leaveForm.to.trim() || !leaveForm.reason.trim()) {
      setLeaveError('Please fill out all required fields.');
      return;
    }

    setLeaveLoading(true);
    try {
      await api.createLeave({
        leaveType: leaveForm.type,
        startDate: leaveForm.from.trim(),
        endDate: leaveForm.to.trim(),
        days: 1,
        reason: leaveForm.reason.trim(),
      });
      setLeaveSubmitted(true);
    } catch (err: any) {
      console.error('Submit leave error:', err);
      setLeaveError(err.message || 'Failed to submit leave.');
    } finally {
      setLeaveLoading(false);
    }
  };

  /* submit hybrid */
  const [hybridLoading, setHybridLoading] = useState(false);
  const [hybridError, setHybridError] = useState<string | null>(null);

  const submitHybrid = async () => {
    setHybridError(null);
    if (!hybridForm.from.trim() || !hybridForm.to.trim() || !hybridForm.reason.trim()) {
      setHybridError('Please fill out all required fields.');
      return;
    }

    setHybridLoading(true);
    try {
      await api.createHybridRequest({
        startDate: hybridForm.from.trim(),
        endDate: hybridForm.to.trim(),
        reason: hybridForm.reason.trim(),
      });
      setHybridSubmitted(true);
    } catch (err: any) {
      console.error('Submit hybrid error:', err);
      setHybridError(err.message || 'Failed to submit hybrid request.');
    } finally {
      setHybridLoading(false);
    }
  };

  /* download report */
  const downloadReport = () => {
    const csv = `Report Type,${reportType}\nPeriod,${reportMonth}\nEmployee,${profile.name}\nEmployee ID,${user?.id}\nRole,${user?.role}\n\nDate,Check-In,Check-Out,Hours,Status\n${mockAttendanceHistory.map(r => `${r.date},${r.checkIn},${r.checkOut},${r.hours},${r.status}`).join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType.replace(/ /g, '_')}_${reportMonth.replace(/ /g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setReportDownloaded(true);
  };

  const getRoleBadgeVariant = (role?: string): 'purple' | 'present' | 'pending' | 'absent' => {
    switch (role) {
      case 'ADMIN':
        return 'purple';
      case 'HR':
        return 'present';
      case 'MANAGER':
        return 'pending';
      default:
        return 'present';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Hero */}
      <Card className="bg-gradient-to-r from-white via-purple-50/20 to-indigo-50/30 border border-purple-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with upload overlay */}
          <div className="relative shrink-0 group">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover shadow-lg shadow-purple-500/20 border-2 border-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-[#6534E8] text-white flex items-center justify-center font-extrabold text-3xl shadow-lg shadow-purple-500/25 border-2 border-white select-none">
                {profile.name.charAt(0)}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
              title="Change profile picture"
            >
              <Camera size={20} className="text-white" />
              <span className="text-white text-[10px] font-semibold">Change</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" title="Active" />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-bold text-[#151936]">{profile.name}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <Badge variant={getRoleBadgeVariant(user?.role)}>
                  ROLE: {user?.role || 'EMPLOYEE'}
                </Badge>
                <Badge variant="present">Active Status</Badge>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Employee ID: <span className="font-mono font-semibold text-[#6534E8]">{user?.id || 'EMP-001'}</span> • {profile.department} • BLR-HQ
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1.5"><Mail size={13} className="text-[#6534E8]" />{profile.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={13} className="text-emerald-600" />{profile.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin size={13} className="text-red-500" />{profile.location}</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} className="text-amber-500" />Joined 12 Jan 2023</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2 justify-center">
            <Button
              size="sm"
              variant="outline"
              icon={<Edit3 size={14} />}
              onClick={() => {
                setEditForm({ ...profile });
                openModal('editProfile');
              }}
            >
              Edit Contact
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon={<Lock size={14} />}
              onClick={() => openModal('changePassword')}
            >
              Password
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon={<Download size={14} />}
              onClick={() => openModal('downloadReport')}
            >
              Attendance Report
            </Button>
          </div>
        </div>

        {/* Quick action strip */}
        <div className="mt-6 pt-4 border-t border-purple-100 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={<CalendarPlus size={14} />}
            onClick={() => openModal('applyLeave')}
          >
            Apply Leave
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={<Laptop size={14} />}
            onClick={() => openModal('requestHybrid')}
          >
            Request Hybrid
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={<ClipboardList size={14} />}
            onClick={() => openModal('viewAttendance')}
          >
            View Attendance
          </Button>
        </div>
      </Card>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employment */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Briefcase size={18} className="text-[#6534E8]" />
            <h3 className="font-bold text-gray-900 text-sm">Employment & Roster Details</h3>
          </div>
          <div className="space-y-3 text-xs">
            {[
              ['Designation', profile.designation],
              ['Department', profile.department],
              ['Assigned Shift', 'General Corporate (09:00 AM to 06:00 PM)'],
              ['Reporting Manager', user?.role === 'MANAGER' ? 'Engineering Director' : 'Imran M (Project Lead)'],
              ['Work Mode', 'Hybrid Permitted (On Approval)'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className={`font-semibold ${label === 'Work Mode' ? 'text-[#6534E8]' : 'text-gray-800'}`}>{value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Branch & Security */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Shield size={18} className="text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-sm">Branch & Security Parameters</h3>
          </div>
          <div className="space-y-3 text-xs">
            {[
              ['Assigned Physical Office', 'PJN Tech Headquarters (BLR-HQ)'],
              ['Office Coordinates', '12.9238° N, 77.6834° E'],
              ['Check-In Geofence Policy', '100m Radius Enforced'],
              ['Tenant Code', 'TENANT-PJN-2026'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className={`font-semibold ${label === 'Check-In Geofence Policy' ? 'text-emerald-700' : 'font-mono text-gray-800'}`}>{value}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5 items-center">
              <span className="text-gray-500">System Role (Immutable)</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-[#6534E8]">
                {user?.role} ACCESS
              </span>
            </div>
          </div>
        </Card>

        {/* Leave Balance */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Calendar size={18} className="text-amber-500" />
            <h3 className="font-bold text-gray-900 text-sm">Leave Balance (Nov 2026)</h3>
          </div>
          <div className="space-y-4">
            {mockLeaveBalance.map((lb) => (
              <div key={lb.type}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-gray-700">{lb.type}</span>
                  <span className="text-gray-500">{lb.remaining} / {lb.total} remaining</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(lb.remaining / lb.total) * 100}%`, backgroundColor: lb.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Award size={18} className="text-[#6534E8]" />
            <h3 className="font-bold text-gray-900 text-sm">Recent Activity Log</h3>
          </div>
          <div className="space-y-3 text-xs">
            {[
              { icon: <CheckCircle2 size={14} className="text-emerald-500" />, text: 'GPS Check-In Verified at 09:02 AM - Today', sub: 'Within 14m radius • BLR-HQ' },
              { icon: <Award size={14} className="text-[#6534E8]" />, text: 'Annual Leave allocation verified - 15 Nov 2026', sub: '14 days remaining' },
              { icon: <CheckCircle2 size={14} className="text-emerald-500" />, text: 'Checked in at 09:05 AM - 11 Nov 2026', sub: 'In-House • BLR-HQ' },
              { icon: <XCircle size={14} className="text-red-500" />, text: 'Late check-in - 10 Nov 2026', sub: 'Arrived at 09:30 AM' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-gray-50 last:border-0">
                <div className="mt-0.5 shrink-0">{item.icon}</div>
                <div>
                  <p className="text-gray-800 font-medium">{item.text}</p>
                  <p className="text-gray-400 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 1. Edit Profile Modal - Strict RBAC Enforcement (No role change permitted) */}
      <Modal
        isOpen={activeModal === 'editProfile'}
        onClose={closeModal}
        title="Edit Contact Profile"
        subtitle="Update your personal contact phone and location"
        badge={user?.id || 'EMP-001'}
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={closeModal}>Cancel</Button>
            <Button size="sm" icon={<Save size={14} />} onClick={saveProfile}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500 block">System Role (Immutable):</span>
              <span className="font-bold text-[#6534E8]">{user?.role}</span>
            </div>
            <span className="text-[10px] text-gray-500 bg-white px-2 py-1 rounded border border-purple-200">
              Role changes restricted to HR Admin
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Full Name (Read-Only)
              </label>
              <input
                type="text"
                disabled
                value={profile.name}
                className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Official Email (Read-Only)
              </label>
              <input
                type="text"
                disabled
                value={profile.email}
                className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6534E8]/30 focus:border-[#6534E8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Designation (Read-Only)
              </label>
              <input
                type="text"
                disabled
                value={profile.designation}
                className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Location / Work Office
              </label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6534E8]/30 focus:border-[#6534E8]"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* 2. Change Password Modal */}
      <Modal
        isOpen={activeModal === 'changePassword'}
        onClose={closeModal}
        title="Change Account Password"
        subtitle="Choose a secure password with 8+ characters"
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={closeModal}>Cancel</Button>
            <Button size="sm" onClick={savePassword} disabled={pwSaved || pwForm.newPw.length < 8}>
              Update Password
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          {pwSaved ? (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs text-emerald-800">
              <CheckCircle2 size={24} className="mx-auto text-emerald-600 mb-2" />
              <p className="font-bold">Password Updated Successfully</p>
              <p className="text-gray-500 mt-1">Your new credentials are now active.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Current Password *</label>
                <input
                  type="password"
                  value={pwForm.current}
                  onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6534E8]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">New Password *</label>
                <input
                  type="password"
                  value={pwForm.newPw}
                  onChange={(e) => {
                    setPwForm({ ...pwForm, newPw: e.target.value });
                    setPwStrength(calcStrength(e.target.value));
                  }}
                  placeholder="At least 8 characters"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6534E8]/30"
                />
                {pwForm.newPw && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 h-full rounded-full transition-colors ${
                            pwStrength >= step ? 'bg-emerald-500' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-500">{strengthLabel[pwStrength]}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  placeholder="Re-type new password"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6534E8]/30"
                />
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* 3. Download Report Modal */}
      <Modal
        isOpen={activeModal === 'downloadReport'}
        onClose={closeModal}
        title="Download Attendance Report"
        subtitle="Export personal attendance history for audit and claims"
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={closeModal}>Close</Button>
            <Button size="sm" icon={<Download size={14} />} onClick={downloadReport}>Download CSV</Button>
          </>
        }
      >
        <div className="space-y-3.5">
          {reportDownloaded && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Report CSV downloaded successfully to your local storage.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Report Format</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50/50"
            >
              <option value="Monthly Attendance">Monthly Attendance Ledger</option>
              <option value="Detailed Punches">Detailed Geofence GPS Log</option>
              <option value="Leave Entitlements">Leave Accrual & Balance Statement</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Billing Period</label>
            <select
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50/50"
            >
              <option value="November 2026">November 2026 (Current Cycle)</option>
              <option value="October 2026">October 2026</option>
              <option value="September 2026">September 2026</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* 4. Apply Leave Quick Modal */}
      <Modal
        isOpen={activeModal === 'applyLeave'}
        onClose={closeModal}
        title="Quick Apply Leave"
        subtitle="Submit time-off dates for manager approval"
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={closeModal} disabled={leaveLoading}>Cancel</Button>
            <Button size="sm" onClick={submitLeave} disabled={leaveSubmitted || leaveLoading}>
              {leaveLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          {leaveError && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {leaveError}
            </div>
          )}
          {leaveSubmitted ? (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs text-emerald-800">
              <CheckCircle2 size={24} className="mx-auto text-emerald-600 mb-2" />
              <p className="font-bold">Leave Application Submitted</p>
              <p className="text-gray-500 mt-1">Routed to your designated reporting manager.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Leave Type</label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50/50"
                >
                  <option value="Annual Leave">Annual Leave (14 available)</option>
                  <option value="Sick Leave">Sick Leave (8 available)</option>
                  <option value="Casual Leave">Casual Leave (5 available)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
                  <input
                    type="text"
                    value={leaveForm.from}
                    onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })}
                    placeholder="e.g. 24 Nov 2026"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
                  <input
                    type="text"
                    value={leaveForm.to}
                    onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })}
                    placeholder="e.g. 25 Nov 2026"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Reason</label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="State reason for absence..."
                  rows={2}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-lg"
                />
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* 5. Request Hybrid Quick Modal */}
      <Modal
        isOpen={activeModal === 'requestHybrid'}
        onClose={closeModal}
        title="Request Hybrid Work Window"
        subtitle="Mandatory verification before remote check-in is unlocked"
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={closeModal} disabled={hybridLoading}>Cancel</Button>
            <Button size="sm" onClick={submitHybrid} disabled={hybridSubmitted || hybridLoading}>
              {hybridLoading ? 'Submitting...' : 'Request Window'}
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          {hybridError && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {hybridError}
            </div>
          )}
          {hybridSubmitted ? (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs text-emerald-800">
              <CheckCircle2 size={24} className="mx-auto text-emerald-600 mb-2" />
              <p className="font-bold">Hybrid Request Submitted</p>
              <p className="text-gray-500 mt-1">Pending approval from your manager / HR.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
                  <input
                    type="text"
                    value={hybridForm.from}
                    onChange={(e) => setHybridForm({ ...hybridForm, from: e.target.value })}
                    placeholder="e.g. 20 Nov 2026"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
                  <input
                    type="text"
                    value={hybridForm.to}
                    onChange={(e) => setHybridForm({ ...hybridForm, to: e.target.value })}
                    placeholder="e.g. 21 Nov 2026"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Remote Work Justification</label>
                <textarea
                  value={hybridForm.reason}
                  onChange={(e) => setHybridForm({ ...hybridForm, reason: e.target.value })}
                  placeholder="Explain why off-site work is required..."
                  rows={2}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-lg"
                />
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* 6. View Attendance Modal */}
      <Modal
        isOpen={activeModal === 'viewAttendance'}
        onClose={closeModal}
        title="Personal Attendance Ledger"
        subtitle={`Audit records for ${user?.name} (${user?.id})`}
        maxWidth="lg"
        footer={
          <Button variant="outline" size="sm" onClick={closeModal}>Close</Button>
        }
      >
        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-3.5 py-2.5 font-semibold text-gray-600">Date</th>
                <th className="px-3.5 py-2.5 font-semibold text-gray-600">Check In</th>
                <th className="px-3.5 py-2.5 font-semibold text-gray-600">Check Out</th>
                <th className="px-3.5 py-2.5 font-semibold text-gray-600">Logged Hours</th>
                <th className="px-3.5 py-2.5 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockAttendanceHistory.map((row, i) => (
                <tr key={i} className="hover:bg-purple-50/20">
                  <td className="px-3.5 py-2.5 font-medium text-gray-900">{row.date}</td>
                  <td className="px-3.5 py-2.5 font-mono text-emerald-700 font-semibold">{row.checkIn}</td>
                  <td className="px-3.5 py-2.5 font-mono text-gray-600">{row.checkOut}</td>
                  <td className="px-3.5 py-2.5 text-gray-600">{row.hours}</td>
                  <td className="px-3.5 py-2.5">
                    <Badge variant={row.status === 'Present' ? 'present' : row.status === 'Late' ? 'late' : 'pending'}>
                      {row.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};
