import React from 'react';

export type BadgeVariant = 'present' | 'pending' | 'absent' | 'purple' | 'neutral' | 'late' | 'blue';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '' }) => {
  const variantStyles: Record<BadgeVariant, string> = {
    present: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    pending: 'bg-amber-50 text-amber-700 border-amber-200/80',
    late: 'bg-amber-50 text-amber-700 border-amber-200/80',
    absent: 'bg-red-50 text-red-700 border-red-200/80',
    purple: 'bg-[#F4F0FD] text-[#6534E8] border-purple-200/80',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200/80',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
