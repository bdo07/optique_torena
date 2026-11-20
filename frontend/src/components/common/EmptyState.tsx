import React from 'react';
import { EyeOff } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 border border-dashed border-gray-300 rounded-sm bg-warm-white my-6">
      <div className="w-12 h-12 rounded-full bg-soft-beige flex items-center justify-center text-muted-gray mb-3">
        {icon || <EyeOff className="w-6 h-6 text-olive" />}
      </div>
      <h3 className="text-base font-medium text-dark-charcoal mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-muted-gray max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-semibold text-dark-charcoal bg-white border border-gray-300 hover:border-dark-charcoal rounded transition-colors shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
