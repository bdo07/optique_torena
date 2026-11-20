import React from 'react';
import { Menu } from 'lucide-react';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

interface AdminHeaderProps {
  onOpenSidebar: () => void;
  title: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenSidebar,
  title,
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 text-dark-charcoal hover:bg-gray-100 rounded lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-semibold text-dark-charcoal">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher variant="full" />
      </div>
    </header>
  );
};
