import {
  LayoutDashboard,
  Building2,
  Users,
  MapPin,
  Laptop,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
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
  { name: 'Leave Management', to: '/coming-soon/leaves', icon: CalendarCheck },
  { name: 'Shifts', to: '/shifts', icon: CalendarDays },
  { name: 'Holiday Calendar', to: '/coming-soon/holiday-calendar', icon: CalendarRange },
  { name: 'Reports & Analytics', to: '/reports', icon: BarChart3 },
  { name: 'Settings & Roles', to: '/settings', icon: Settings },
  { name: 'Audit Logs', to: '/audit-logs', icon: ShieldAlert },
];
