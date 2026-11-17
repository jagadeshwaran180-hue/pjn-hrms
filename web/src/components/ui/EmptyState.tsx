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
  action
}) => {
  return (
    <div className="py-12 px-4 text-center max-w-sm mx-auto flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
        {icon || <AlertCircle size={24} />}
      </div>
      <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
