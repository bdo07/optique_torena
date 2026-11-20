import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  badge,
}) => {
  return (
    <div className="bg-white p-5 rounded-sm border border-gray-200/90 shadow-xs flex items-center justify-between">
      <div>
        <span className="text-xs text-muted-gray block mb-1 font-medium">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-dark-charcoal tracking-tight">
            {value}
          </span>
          {badge && (
            <span className="text-[10px] px-1.5 py-0.5 bg-soft-beige text-dark-charcoal rounded font-semibold">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <span className="text-[11px] text-muted-gray mt-1 block">
            {subtitle}
          </span>
        )}
      </div>

      <div className="p-3 bg-soft-beige rounded text-olive shrink-0">
        {icon}
      </div>
    </div>
  );
};
