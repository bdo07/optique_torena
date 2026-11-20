import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Check, Trash2, Phone, Calendar } from 'lucide-react';
import {
  deleteAdminMessage,
  getAdminMessages,
  markAdminMessageAsRead,
} from '../../api/endpoints';
import { ContactMessage, PaginatedResponse } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Pagination } from '../../components/common/Pagination';

export const AdminMessagesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [messagesData, setMessagesData] = useState<PaginatedResponse<ContactMessage>>({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getAdminMessages(page);
      setMessagesData(data);
    } catch (e) {
      console.error('Failed to load messages', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [page]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAdminMessageAsRead(id);
      loadMessages();
    } catch (e) {
      alert('Erreur.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      await deleteAdminMessage(id);
      loadMessages();
    } catch (e) {
      alert('Erreur.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-dark-charcoal">
            {t('admin.messages')}
          </h2>
          <p className="text-xs text-muted-gray">
            {isRtl
              ? 'الرسائل واستفسارات الحجز والتواصل الواردة من زوار الموقع'
              : 'Messages et demandes de contact envoyés depuis le site public'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Chargement des messages..." />
        ) : messagesData.data.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {messagesData.data.map((msg) => (
              <div
                key={msg.id}
                className={`p-5 transition-colors ${
                  !msg.is_read ? 'bg-olive/5' : 'hover:bg-warm-white/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-xs text-dark-charcoal">
                      {msg.name}
                    </span>
                    {!msg.is_read && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-olive text-white rounded">
                        Nouveau
                      </span>
                    )}
                    {msg.product_reference && (
                      <span className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-700 font-mono rounded">
                        Réf: {msg.product_reference}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-gray">
                    <span className="inline-flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>

                    <div className="inline-flex items-center gap-1.5">
                      {!msg.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(msg.id)}
                          title="Marquer comme lu"
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(msg.id)}
                        title="Supprimer"
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-gray mb-3 flex flex-wrap gap-4">
                  {msg.phone && (
                    <span className="inline-flex items-center gap-1 text-dark-charcoal">
                      <Phone className="w-3 h-3 text-olive" />
                      <a href={`tel:${msg.phone}`} className="hover:underline">
                        {msg.phone}
                      </a>
                    </span>
                  )}
                  {msg.email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3 h-3 text-olive" />
                      <a href={`mailto:${msg.email}`} className="hover:underline">
                        {msg.email}
                      </a>
                    </span>
                  )}
                  {msg.subject && (
                    <span className="font-medium text-dark-charcoal">
                      Sujet : {msg.subject}
                    </span>
                  )}
                </div>

                <p className="text-xs text-dark-charcoal leading-relaxed bg-warm-white/70 p-3 rounded border border-gray-100">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-muted-gray">
            Aucun message reçu pour le moment.
          </div>
        )}

        {messagesData.last_page > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center">
            <Pagination
              currentPage={messagesData.current_page}
              lastPage={messagesData.last_page}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
