import React, { useState, useRef } from 'react';
import {
  Mail,
  Calendar,
  Briefcase,
  MapPin,
  Clock,
  Shield,
  Award,
  Camera,
  Edit3,
  Lock,
  FileText,
  CalendarPlus,
  Laptop,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  User,
  Save,
  X,
  Download,
  ClipboardList
} from 'lucide-react';
import { Card, Badge, Button, Modal } from '../components/ui';

/* ─────────────────────────── types ─────────────────────────── */
type ModalKey =
  | 'editProfile'
  | 'changePassword'
  | 'downloadReport'
  | 'applyLeave'
  | 'requestHybrid'
  | 'viewAttendance'
  | null;

/* ─────────────────────────── mock attendance data ─────────────── */
const mockAttendanceHistory = [
  { date: '15 Nov 2026', checkIn: '09:02 AM', checkOut: '06:11 PM', hours: '9h 09m', status: 'Present', mode: 'In-House' },
  { date: '14 Nov 2026', checkIn: '09:18 AM', checkOut: '06:05 PM', hours: '8h 47m', status: 'Present', mode: 'Hybrid' },
  { date: '13 Nov 2026', checkIn: '08:58 AM', checkOut: '06:00 PM', hours: '9h 02m', status: 'Present', mode: 'In-House' },
  { date: '12 Nov 2026', checkIn: '—', checkOut: '—', hours: '—', status: 'On Leave', mode: '—' },
  { date: '11 Nov 2026', checkIn: '09:05 AM', checkOut: '06:15 PM', hours: '9h 10m', status: 'Present', mode: 'In-House' },
  { date: '10 Nov 2026', checkIn: '09:30 AM', checkOut: '06:00 PM', hours: '8h 30m', status: 'Late', mode: 'Hybrid' },
  { date: '09 Nov 2026', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', status: 'Present', mode: 'In-House' },
];

const mockLeaveBalance = [
  { type: 'Annual Leave', total: 18, used: 4, remaining: 14, color: '#6338DF' },
  { type: 'Sick Leave', total: 10, used: 2, remaining: 8, color: '#EF4444' },
  { type: 'Casual Leave', total: 7, used: 2, remaining: 5, color: '#F59E0B' },
];

/* ─────────────────────────── component ─────────────────────── */
export const UserProfile: React.FC = () => {
  /* profile photo */
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* edit-profile form */
  const [profile, setProfile] = useState({
    name: 'Jagadeesh K',
    email: 'jagadeesh@pjntech.com',
    phone: '+91 98765 43210',
    designation: 'Frontend Lead (React + TS)',
    department: 'Engineering',
    location: 'Bangalore Headquarters (EcoWorld)',
  });
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
  const strengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

  /* save edit profile */
  const saveProfile = () => {
    setProfile({ ...editForm });
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
  const submitLeave = () => {
    if (!leaveForm.from || !leaveForm.to || !leaveForm.reason) return;
    setLeaveSubmitted(true);
  };

  /* submit hybrid */
  const submitHybrid = () => {
    if (!hybridForm.from || !hybridForm.to || !hybridForm.reason) return;
    setHybridSubmitted(true);
  };

  /* download report (mock CSV) */
  const downloadReport = () => {
    const csv = `Report Type,${reportType}\nPeriod,${reportMonth}\nEmployee,${profile.name}\nEmployee ID,EMP-001\n\nDate,Check-In,Check-Out,Hours,Status\n${mockAttendanceHistory.map(r => `${r.date},${r.checkIn},${r.checkOut},${r.hours},${r.status}`).join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType.replace(/ /g, '_')}_${reportMonth.replace(/ /g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setReportDownloaded(true);
  };

  const statusColor: Record<string, string> = {
    Present: 'text-emerald-600 bg-emerald-50',
    Late: 'text-amber-600 bg-amber-50',
    'On Leave': 'text-blue-600 bg-blue-50',
    Absent: 'text-red-600 bg-red-50',
  };

  /* ─── render ─── */
  return (
    <div className="space-y-6">

      {/* ── Profile Hero ── */}
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
              <div className="w-24 h-24 rounded-2xl bg-[#6338DF] text-white flex items-center justify-center font-extrabold text-3xl shadow-lg shadow-purple-500/25 border-2 border-white select-none">
                {profile.name.charAt(0)}
              </div>
            )}
            {/* camera overlay */}
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
            {/* green active dot */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" title="Active" />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-bold text-[#161A3D]">{profile.name}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <Badge variant="purple">Web Frontend Lead</Badge>
                <Badge variant="present">Active</Badge>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Employee ID: <span className="font-mono font-semibold text-[#6338DF]">EMP-001</span> • {profile.department} • BLR-HQ
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1.5"><Mail size={13} className="text-[#6338DF]" />{profile.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={13} className="text-emerald-600" />{profile.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin size={13} className="text-red-500" />{profile.location}</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} className="text-amber-500" />Joined 12 Jan 2023</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2 justify-center">
            <Button size="sm" icon={<Edit3 size={14} />} onClick={() => { setEditForm({ ...profile }); openModal('editProfile'); }}>
              Edit Profile
            </Button>
            <Button size="sm" variant="outline" icon={<Lock size={14} />} onClick={() => openModal('changePassword')}>
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Metric KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase">Monthly Attendance</p>
            <Clock size={16} className="text-[#6338DF]" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">98.2%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">21 of 22 working days logged</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase">Available Time-Off</p>
            <Calendar size={16} className="text-emerald-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">27 Days</h3>
          <p className="text-xs text-gray-500 mt-1">14 Annual • 8 Sick • 5 Casual</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase">Punctuality Score</p>
            <Award size={16} className="text-amber-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#161A3D] mt-1">99.0%</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">Avg. Check-In: 09:14 AM</p>
        </Card>
      </div>

      {/* ── Quick Action Buttons ── */}
      <Card>
        <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            variant="secondary"
            icon={<Download size={14} />}
            onClick={() => openModal('downloadReport')}
          >
            Download Report
          </Button>
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

      {/* ── Detail Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employment */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Briefcase size={18} className="text-[#6338DF]" />
            <h3 className="font-bold text-gray-900 text-sm">Employment & Roster Details</h3>
          </div>
          <div className="space-y-3 text-xs">
            {[
              ['Designation', profile.designation],
              ['Department', profile.department],
              ['Assigned Shift', 'General Corporate (09:00 AM – 06:00 PM)'],
              ['Reporting Manager', 'Imran M (Project Lead)'],
              ['Work Mode', 'Hybrid Permitted (On Approval)'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className={`font-semibold ${label === 'Work Mode' ? 'text-[#6338DF]' : 'text-gray-800'}`}>{value}</span>
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
            <div className="flex justify-between py-1.5">
              <span className="text-gray-500">System Role</span>
              <Badge variant="purple">ADMIN & HR ACCESS</Badge>
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
            <FileText size={18} className="text-blue-500" />
            <h3 className="font-bold text-gray-900 text-sm">Recent Activity</h3>
          </div>
          <div className="space-y-3 text-xs">
            {[
              { icon: <CheckCircle2 size={14} className="text-emerald-500" />, text: 'Checked in at 09:02 AM — 15 Nov 2026', sub: 'In-House • BLR-HQ' },
              { icon: <CheckCircle2 size={14} className="text-blue-500" />, text: 'Hybrid approval granted — 14 Nov 2026', sub: 'Approved by Imran M' },
              { icon: <AlertCircle size={14} className="text-amber-500" />, text: 'Leave Request submitted — 12 Nov 2026', sub: 'Annual Leave · 1 day' },
              { icon: <CheckCircle2 size={14} className="text-emerald-500" />, text: 'Checked in at 09:05 AM — 11 Nov 2026', sub: 'In-House • BLR-HQ' },
              { icon: <XCircle size={14} className="text-red-500" />, text: 'Late check-in — 10 Nov 2026', sub: 'Arrived at 09:30 AM' },
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

      {/* ═══════════════ MODALS ═══════════════ */}

      {/* 1. Edit Profile */}
      <Modal
        isOpen={activeModal === 'editProfile'}
        onClose={closeModal}
        title="Edit Profile"
        subtitle="Update your personal and contact information"
        badge="EMP-001"
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={closeModal}>Cancel</Button>
            <Button size="sm" icon={<Save size={14} />} onClick={saveProfile}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* avatar inside modal */}
          <div className="flex items-center gap-4 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile" className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-[#6338DF] text-white flex items-center justify-center text-2xl font-extrabold shadow">
                {editForm.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Profile Picture</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#6338DF] font-semibold hover:underline flex items-center gap-1"
              >
                <Camera size={12} /> Upload new photo
              </button>
              <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG up to 2 MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              [
                { label: 'Full Name', key: 'name', icon: <User size={13} /> },
                { label: 'Email Address', key: 'email', icon: <Mail size={13} /> },
                { label: 'Phone Number', key: 'phone', icon: <Phone size={13} /> },
                { label: 'Designation', key: 'designation', icon: <Briefcase size={13} /> },
                { label: 'Department', key: 'department', icon: <Shield size={13} /> },
                { label: 'Location', key: 'location', icon: <MapPin size={13} /> },
              ] as { label: string; key: keyof typeof editForm; icon: React.ReactNode }[]
            ).map(({ label, key, icon }) => (
              <div key={key} className={key === 'location' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                  {icon} {label}
                </label>
                <input
                  type="text"
                  value={editForm[key]}
                  onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6338DF]/30 focus:border-[#6338DF]"
                />
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* 2. Change Password */}
      <Modal
        isOpen={activeModal === 'changePassword'}
        onClose={closeModal}
        title="Change Password"
        subtitle="Choose a strong password with 8+ characters"
        maxWidth="sm"
        footer={
          pwSaved ? undefined : (
            <>
              <Button variant="outline" size="sm" onClick={closeModal}>Cancel</Button>
              <Button
                size="sm"
                icon={<Lock size={14} />}
                disabled={pwForm.newPw !== pwForm.confirm || pwForm.newPw.length < 8}
                onClick={savePassword}
              >
                Update Password
              </Button>
            </>
          )
        }
      >
        {pwSaved ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
            <p className="font-semibold text-gray-800">Password updated successfully!</p>
            <p className="text-xs text-gray-500">Your new password is now active.</p>
            <Button size="sm" onClick={closeModal}>Close</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { label: 'Current Password', key: 'current' as const },
              { label: 'New Password', key: 'newPw' as const },
              { label: 'Confirm New Password', key: 'confirm' as const },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                <input
                  type="password"
                  value={pwForm[key]}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPwForm((f) => ({ ...f, [key]: val }));
                    if (key === 'newPw') setPwStrength(calcStrength(val));
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6338DF]/30 focus:border-[#6338DF]"
                  placeholder="••••••••"
                />
              </div>
            ))}
            {/* strength bar */}
            {pwForm.newPw.length > 0 && (
              <div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-1.5 rounded-full transition-colors"
                      style={{ backgroundColor: i <= pwStrength ? strengthColor[pwStrength] : '#E5E7EB' }}
                    />
                  ))}
                </div>
                <p className="text-[11px]" style={{ color: strengthColor[pwStrength] }}>
                  {strengthLabel[pwStrength]} password
                </p>
              </div>
            )}
            {pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
              <p className="text-xs text-red-500 flex items-center gap-1"><XCircle size={12} /> Passwords do not match</p>
            )}
          </div>
        )}
      </Modal>

      {/* 3. Download Report */}
      <Modal
        isOpen={activeModal === 'downloadReport'}
        onClose={closeModal}
        title="Download Attendance Report"
        subtitle="Select report type and period to export"
        maxWidth="sm"
        footer={
          reportDownloaded ? undefined : (
            <>
              <Button variant="outline" size="sm" onClick={closeModal}>Cancel</Button>
              <Button size="sm" icon={<Download size={14} />} onClick={downloadReport}>Download CSV</Button>
            </>
          )
        }
      >
        {reportDownloaded ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
            <p className="font-semibold text-gray-800">Report downloaded!</p>
            <p className="text-xs text-gray-500">{reportType} — {reportMonth}</p>
            <Button size="sm" onClick={closeModal}>Close</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6338DF]/30 focus:border-[#6338DF]"
              >
                <option>Monthly Attendance</option>
                <option>Leave Summary</option>
                <option>Punctuality Report</option>
                <option>Hybrid Usage Report</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Period</label>
              <select
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6338DF]/30 focus:border-[#6338DF]"
              >
                <option>November 2026</option>
                <option>October 2026</option>
                <option>September 2026</option>
                <option>August 2026</option>
              </select>
            </div>
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-gray-600">
              <p className="font-semibold text-[#6338DF] mb-1">Preview</p>
              <p>Employee: <span className="font-semibold">{profile.name}</span></p>
              <p>Report: <span className="font-semibold">{reportType}</span></p>
              <p>Period: <span className="font-semibold">{reportMonth}</span></p>
              <p>Format: <span className="font-semibold">CSV</span></p>
            </div>
          </div>
        )}
      </Modal>

      {/* 4. Apply Leave */}
      <Modal
        isOpen={activeModal === 'applyLeave'}
        onClose={closeModal}
        title="Apply for Leave"
        subtitle="Submit a leave request for HR approval"
        maxWidth="sm"
        footer={
          leaveSubmitted ? undefined : (
            <>
              <Button variant="outline" size="sm" onClick={closeModal}>Cancel</Button>
              <Button
                size="sm"
                icon={<CalendarPlus size={14} />}
                disabled={!leaveForm.from || !leaveForm.to || !leaveForm.reason}
                onClick={submitLeave}
              >
                Submit Request
              </Button>
            </>
          )
        }
      >
        {leaveSubmitted ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
            <p className="font-semibold text-gray-800">Leave request submitted!</p>
            <p className="text-xs text-gray-500">Your request is pending HR approval.</p>
            <div className="text-xs text-left bg-gray-50 rounded-xl p-3 space-y-1">
              <p><span className="text-gray-500">Type:</span> <span className="font-semibold">{leaveForm.type}</span></p>
              <p><span className="text-gray-500">From:</span> <span className="font-semibold">{leaveForm.from}</span></p>
              <p><span className="text-gray-500">To:</span> <span className="font-semibold">{leaveForm.to}</span></p>
              <p><span className="text-gray-500">Reason:</span> <span className="font-semibold">{leaveForm.reason}</span></p>
            </div>
            <Button size="sm" onClick={closeModal}>Close</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Leave Type</label>
              <select
                value={leaveForm.type}
                onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6338DF]/30 focus:border-[#6338DF]"
              >
                <option>Annual Leave</option>
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Maternity/Paternity Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
                <input
                  type="date"
                  value={leaveForm.from}
                  onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6338DF]/30 focus:border-[#6338DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
                <input
                  type="date"
                  value={leaveForm.to}
                  onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6338DF]/30 focus:border-[#6338DF]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Reason</label>
              <textarea
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                rows={3}
                placeholder="Briefly describe the reason for leave…"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6338DF]/30 focus:border-[#6338DF] resize-none"
              />
            </div>
            {/* balance info */}
            <div className="grid grid-cols-3 gap-2">
              {mockLeaveBalance.map((lb) => (
                <div key={lb.type} className="text-center p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-[10px] text-gray-500">{lb.type.split(' ')[0]}</p>
                  <p className="text-sm font-bold" style={{ color: lb.color }}>{lb.remaining}d</p>
                  <p className="text-[10px] text-gray-400">left</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* 5. Request Hybrid */}
      <Modal
        isOpen={activeModal === 'requestHybrid'}
        onClose={closeModal}
        title="Request Hybrid Work"
        subtitle="Submit request for remote/WFH attendance approval"
        maxWidth="sm"
        footer={
          hybridSubmitted ? undefined : (
            <>
              <Button variant="outline" size="sm" onClick={closeModal}>Cancel</Button>
              <Button
                size="sm"
                icon={<Laptop size={14} />}
                disabled={!hybridForm.from || !hybridForm.to || !hybridForm.reason}
                onClick={submitHybrid}
              >
                Submit Request
              </Button>
            </>
          )
        }
      >
        {hybridSubmitted ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
            <p className="font-semibold text-gray-800">Hybrid request submitted!</p>
            <p className="text-xs text-gray-500">Awaiting HR approval. You will be notified once reviewed.</p>
            <div className="text-xs text-left bg-gray-50 rounded-xl p-3 space-y-1">
              <p><span className="text-gray-500">From:</span> <span className="font-semibold">{hybridForm.from}</span></p>
              <p><span className="text-gray-500">To:</span> <span className="font-semibold">{hybridForm.to}</span></p>
              <p><span className="text-gray-500">Reason:</span> <span className="font-semibold">{hybridForm.reason}</span></p>
            </div>
            <Button size="sm" onClick={closeModal}>Close</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
              <p className="font-semibold mb-0.5">⚠ Approval Required</p>
              <p>Hybrid attendance must be pre-approved by HR before the requested dates.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
                <input
                  type="date"
                  value={hybridForm.from}
                  onChange={(e) => setHybridForm({ ...hybridForm, from: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6338DF]/30 focus:border-[#6338DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
                <input
                  type="date"
                  value={hybridForm.to}
                  onChange={(e) => setHybridForm({ ...hybridForm, to: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6338DF]/30 focus:border-[#6338DF]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Reason / Justification</label>
              <textarea
                value={hybridForm.reason}
                onChange={(e) => setHybridForm({ ...hybridForm, reason: e.target.value })}
                rows={3}
                placeholder="Explain your reason for working remotely…"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6338DF]/30 focus:border-[#6338DF] resize-none"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 6. View Attendance */}
      <Modal
        isOpen={activeModal === 'viewAttendance'}
        onClose={closeModal}
        title="Attendance History"
        subtitle="Your recent check-in and check-out records"
        badge="Last 7 Days"
        maxWidth="lg"
        footer={
          <Button variant="outline" size="sm" onClick={closeModal} icon={<X size={14} />}>Close</Button>
        }
      >
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                {['Date', 'Check-In', 'Check-Out', 'Hours', 'Mode', 'Status'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockAttendanceHistory.map((row) => (
                <tr key={row.date} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 py-2.5 font-medium text-gray-800 whitespace-nowrap">{row.date}</td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{row.checkIn}</td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{row.checkOut}</td>
                  <td className="px-3 py-2.5 font-semibold text-gray-700 whitespace-nowrap">{row.hours}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-[#6338DF]">{row.mode}</span>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColor[row.status] ?? 'text-gray-500 bg-gray-100'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* summary row */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-xl bg-emerald-50 border border-emerald-100">
            <p className="text-xs text-emerald-600 font-semibold">Present</p>
            <p className="text-lg font-extrabold text-emerald-700">5</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-amber-50 border border-amber-100">
            <p className="text-xs text-amber-600 font-semibold">Late</p>
            <p className="text-lg font-extrabold text-amber-700">1</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-xs text-blue-600 font-semibold">On Leave</p>
            <p className="text-lg font-extrabold text-blue-700">1</p>
          </div>
        </div>
      </Modal>

    </div>
  );
};
