import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Glasses,
  FolderTree,
  Tag,
  Percent,
  Settings,
  Mail,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const { logout, user } = useAuth();
  const isRtl = i18n.language === 'ar';

  const menuItems = [
    { to: '/admin', end: true, label: t('admin.dashboard'), icon: LayoutDashboard },
    { to: '/admin/products', label: t('admin.products'), icon: Glasses },
    { to: '/admin/categories', label: t('admin.categories'), icon: FolderTree },
    { to: '/admin/brands', label: t('admin.brands'), icon: Tag },
    { to: '/admin/promotions', label: t('admin.promotions'), icon: Percent },
    { to: '/admin/settings', label: t('admin.settings'), icon: Settings },
    { to: '/admin/messages', label: t('admin.messages'), icon: Mail },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 start-0 z-50 w-64 bg-dark-charcoal text-gray-300 flex flex-col justify-between transition-transform duration-200 border-e border-gray-800 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo / Admin Title */}
          <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <span className="font-serif tracking-wider text-base font-bold text-warm-white uppercase">
              Optique Torena
            </span>
            <span className="ms-2 px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-olive text-warm-white rounded">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-olive text-warm-white font-semibold'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: User info, public site & logout */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            <span>{t('admin.view_site')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="pt-2 flex items-center justify-between text-xs">
            <div className="truncate me-2">
              <span className="block font-medium text-white truncate">
                {user?.name || 'Administrateur'}
              </span>
              <span className="text-[10px] text-gray-500 truncate block">
                {user?.email}
              </span>
            </div>

            <button
              onClick={() => logout()}
              title={t('admin.logout')}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
