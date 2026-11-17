import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="py-12 px-4 text-center max-w-sm mx-auto flex flex-col items-center select-none">
      <div className="w-12 h-12 rounded-full bg-[#F4F0FD] border border-purple-100 flex items-center justify-center text-[#6534E8] mb-3 shadow-xs">
        {icon || <AlertCircle size={22} />}
      </div>
      <h4 className="font-semibold text-[#111827] text-sm">{title}</h4>
      {description && <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
