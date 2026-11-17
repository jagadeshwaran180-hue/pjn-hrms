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
import { UserRole } from '../types';

export interface NavItemConfig {
  name: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
  roles: UserRole[]; // Roles authorized to see and access this nav item
}

export const navigationConfig: NavItemConfig[] = [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  },
  {
    name: 'Company & Branches',
    to: '/company',
    icon: Building2,
    roles: ['ADMIN', 'HR'],
  },
  {
    name: 'Employees',
    to: '/employees',
    icon: Users,
    roles: ['ADMIN', 'HR'],
  },
  {
    name: 'GPS Attendance',
    to: '/attendance',
    icon: MapPin,
    roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  },
  {
    name: 'Hybrid Approvals',
    to: '/hybrid-approvals',
    icon: Laptop,
    badge: 'Approvals',
    roles: ['ADMIN', 'HR', 'MANAGER'],
  },
  {
    name: 'Leave Management',
    to: '/leaves',
    icon: CalendarCheck,
    roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  },
  {
    name: 'Shift Rostering',
    to: '/shifts',
    icon: CalendarDays,
    roles: ['ADMIN', 'HR'],
  },
  {
    name: 'Holiday Calendar',
    to: '/holiday-calendar',
    icon: CalendarRange,
    roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  },
  {
    name: 'Regularization',
    to: '/regularization',
    icon: FileCheck2,
    roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'],
  },
  {
    name: 'Reports & Analytics',
    to: '/reports',
    icon: BarChart3,
    roles: ['ADMIN', 'HR'],
  },
  {
    name: 'Settings & Roles',
    to: '/settings',
    icon: Settings,
    roles: ['ADMIN'], // Restricted to Administrator only
  },
  {
    name: 'Audit Logs',
    to: '/audit-logs',
    icon: ShieldAlert,
    roles: ['ADMIN', 'HR'],
  },
];
