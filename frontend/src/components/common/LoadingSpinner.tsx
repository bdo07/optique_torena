import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({
  size = 'md',
  text,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div
        className={`${sizeClasses[size]} border-gray-200 border-t-olive rounded-full animate-spin`}
      />
      {text && <p className="text-xs text-muted-gray tracking-wide">{text}</p>}
    </div>
  );
};
