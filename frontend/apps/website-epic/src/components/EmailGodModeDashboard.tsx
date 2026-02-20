/**
 * Email God Mode Dashboard - AIGestion.net
 * Panel de control para gestión de emails a nivel dios
 * Cuentas pro migradas con notificaciones contextuales
 */

import React, { useState, useEffect } from 'react';
import { emailGodMode } from '../services/email-godmode';
import {
  Mail,
  Send,
  Archive,
  Trash2,
  Star,
  Filter,
  Search,
  Bell,
  Settings,
  Clock,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Zap,
  Globe,
  Phone,
  MessageSquare,
  Calendar,
  Tag,
  Folder,
  Inbox,
  ChevronDown,
  MoreVertical,
  Reply,
  Forward,
  Paperclip,
} from 'lucide-react';

interface EmailAccount {
  id: string;
  type: 'personal' | 'professional';
  email: string;
  is_pro: boolean;
  storage_used: number;
  storage_limit: number;
  unread: number;
}

interface EmailMessage {
  id: string;
  from: { email: string; name: string };
  subject: string;
  body: string;
  date: Date;
  is_read: boolean;
  is_important: boolean;
  labels: string[];
  category: string;
  size: number;
  context_analysis?: {
    urgency: string;
    sentiment: string;
    intent: string;
    action_required: boolean;
    estimated_response_time: number;
  };
}

export const EmailGodModeDashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEmailData();
  }, []);

  const loadEmailData = async () => {
    try {
      await emailGodMode.initialize();

      const emailAccounts = emailGodMode.getAccounts();
      const emailMessages = emailGodMode.getMessages();
      const emailStats = emailGodMode.getStats();

      setAccounts(
        emailAccounts.map(acc => ({
          ...acc,
          unread: emailGodMode.getUnreadCount(acc.id),
        }))
      );

      setMessages(emailMessages);
      setStats(emailStats);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar datos de email:', error);
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      case 'neutral':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'primary':
        return 'bg-blue-100 text-blue-800';
      case 'social':
        return 'bg-purple-100 text-purple-800';
      case 'promotions':
        return 'bg-green-100 text-green-800';
      case 'updates':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch =
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.from.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || message.category === filterCategory;
    const matchesAccount = selectedAccount === 'all' || message.account_id === selectedAccount;

    return matchesSearch && matchesCategory && matchesAccount;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Email God Mode...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                📧 Email God Mode
              </h1>
              <p className="text-gray-600 mt-2">
                Sistema de gestión de emails pro con notificaciones contextuales
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Cuentas Pro</p>
                <p className="font-semibold text-blue-600">
                  {accounts.filter(a => a.is_pro).length}/{accounts.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                <Mail className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Emails</p>
                  <p className="text-3xl font-bold">{stats.total_emails}</p>
                </div>
                <Inbox className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">No Leídos</p>
                  <p className="text-3xl font-bold">{stats.unread_emails}</p>
                </div>
                <Mail className="w-8 h-8 text-red-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Importantes</p>
                  <p className="text-3xl font-bold">{stats.important_emails}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Almacenamiento</p>
                  <p className="text-3xl font-bold">{stats.storage_used.toFixed(1)}GB</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-200" />
              </div>
            </div>
          </div>
        )}

        {/* Accounts Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Cuentas de Email
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map(account => (
              <div
                key={account.id}
                className="border rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        account.type === 'professional' ? 'bg-blue-600' : 'bg-purple-600'
                      }`}
                    >
                      {account.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{account.email}</h4>
                      <p className="text-sm text-gray-500">
                        {account.type === 'professional' ? 'Profesional' : 'Personal'}
                        {account.is_pro && ' • PRO'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {account.unread > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          {account.unread}
                        </span>
                      )}
                      {account.is_pro && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {account.storage_used.toFixed(1)}/{account.storage_limit}GB
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar emails por asunto, remitente..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedAccount}
                onChange={e => setSelectedAccount(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las Cuentas</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.email}
                  </option>
                ))}
              </select>

              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las Categorías</option>
                <option value="primary">Principal</option>
                <option value="social">Social</option>
                <option value="promotions">Promociones</option>
                <option value="updates">Actualizaciones</option>
              </select>

              <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filtros</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remitente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asunto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contexto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map(message => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {!message.is_read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        {message.is_important && <Star className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{message.from.name}</div>
                        <div className="text-sm text-gray-500">{message.from.email}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{message.subject}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {message.body.substring(0, 50)}...
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {message.context_analysis && (
                        <div className="space-y-1">
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(message.context_analysis.urgency)}`}
                          >
                            {message.context_analysis.urgency}
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(message.context_analysis.sentiment)}`}
                          >
                            {message.context_analysis.sentiment}
                          </div>
                          {message.context_analysis.action_required && (
                            <div className="flex items-center text-xs text-red-600">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Requiere acción
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {message.date.toLocaleDateString('es-ES')}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Abrir email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>

                        <button
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                          title="Responder"
                        >
                          <Reply className="w-4 h-4" />
                        </button>

                        <button
                          className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                          title="Reenviar"
                        >
                          <Forward className="w-4 h-4" />
                        </button>

                        <button
                          className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                          title="Más opciones"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Redactar Email</div>
                <div className="text-sm text-gray-500">Nuevo mensaje</div>
              </div>
            </button>

            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Filter className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Filtros Avanzados</div>
                <div className="text-sm text-gray-500">Organizar emails</div>
              </div>
            </button>

            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Bell className="w-5 h-5 text-orange-600" />
              <div className="text-left">
                <div className="font-medium">Notificaciones</div>
                <div className="text-sm text-gray-500">Configurar alertas</div>
              </div>
            </button>

            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Settings className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Configuración</div>
                <div className="text-sm text-gray-500">Ajustes de cuenta</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
