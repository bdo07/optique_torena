import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export const AdminLoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides.');
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-warm-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher variant="full" />
        </div>

        <span className="font-serif tracking-widest text-2xl sm:text-3xl font-bold text-dark-charcoal uppercase block">
          Optique Torena
        </span>
        <h2 className="mt-2 text-sm uppercase tracking-widest text-muted-gray font-semibold">
          {t('admin.login_title')}
        </h2>
        <p className="mt-1 text-xs text-muted-gray">
          {t('admin.login_subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card border border-gray-200/80 rounded-sm">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                {t('admin.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-muted-gray">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@optiquetorena.ma"
                  className="w-full ps-9 pe-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded focus:outline-none focus:border-olive bg-warm-white/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                {t('admin.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-muted-gray">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ps-9 pe-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded focus:outline-none focus:border-olive bg-warm-white/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-olive hover:bg-olive-dark text-warm-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs disabled:opacity-50"
            >
              <span>
                {loading ? t('admin.signing_in') : t('admin.sign_in')}
              </span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <a
              href="/"
              className="text-xs text-muted-gray hover:text-dark-charcoal transition-colors"
            >
              ← {t('admin.view_site')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
