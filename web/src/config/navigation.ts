import {
  LayoutDashboard,
  Building2,
  Users,
  MapPin,
  Laptop,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  FileCheck2,
  BarChart3,
  Settings,
  ShieldAlert,
  LucideIcon
} from 'lucide-react';

export interface NavItemConfig {
  name: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

export const navigationConfig: NavItemConfig[] = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Company & Branches', to: '/company', icon: Building2 },
  { name: 'Employees', to: '/employees', icon: Users },
  { name: 'GPS Attendance', to: '/attendance', icon: MapPin },
  { name: 'Hybrid Approvals', to: '/hybrid-approvals', icon: Laptop, badge: 'HR' },
  { name: 'Leave Management', to: '/leaves', icon: CalendarCheck },
  { name: 'Shift Rostering', to: '/shifts', icon: CalendarDays },
  { name: 'Holiday Calendar', to: '/holiday-calendar', icon: CalendarRange },
  { name: 'Regularization', to: '/regularization', icon: FileCheck2 },
  { name: 'Reports & Analytics', to: '/reports', icon: BarChart3 },
  { name: 'Settings & Roles', to: '/settings', icon: Settings },
  { name: 'Audit Logs', to: '/audit-logs', icon: ShieldAlert },
];
