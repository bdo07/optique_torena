import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return t('admin.dashboard');
    if (path.startsWith('/admin/products')) return t('admin.products');
    if (path.startsWith('/admin/categories')) return t('admin.categories');
    if (path.startsWith('/admin/brands')) return t('admin.brands');
    if (path.startsWith('/admin/promotions')) return t('admin.promotions');
    if (path.startsWith('/admin/settings')) return t('admin.settings');
    if (path.startsWith('/admin/messages')) return t('admin.messages');
    return t('admin.dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={getPageTitle()}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
