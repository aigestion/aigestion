/**
 * CRM God Mode Dashboard - AIGestion.net
 * Panel de control para gestión de contactos Google + WhatsApp
 * Sistema CRM nivel dios para Alejandro y AIGestion
 */

import React, { useState, useEffect } from 'react';
import { crmGodMode } from '../services/crm-godmode';
import {
  Users,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  TrendingUp,
  Target,
  Award,
  Clock,
  DollarSign,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Send,
  UserCheck,
  Building,
  Tag,
  Star,
  Activity,
  BarChart3,
  PieChart,
  Zap,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  lead_score: number;
  deal_stage: string;
  tags: string[];
  last_contact?: Date;
  whatsapp?: boolean;
}

export const CRMGodModeDashboard: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filterStage, setFilterStage] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCRMData();
  }, []);

  const loadCRMData = async () => {
    try {
      // Inicializar CRM
      await crmGodMode.initializeCRM();

      // Obtener estadísticas
      const crmStats = crmGodMode.getCRMStats();
      setStats(crmStats);

      // Obtener contactos (simulados para demostración)
      const mockContacts: Contact[] = [
        {
          id: 'aigestion-main',
          name: 'Alejandro',
          email: 'alejandro@aigestion.net',
          phone: '+34618779308',
          company: 'AIGestion',
          position: 'CEO & Founder',
          lead_score: 100,
          deal_stage: 'closed_won',
          tags: ['CEO', 'Fundador', 'Principal'],
          last_contact: new Date(),
          whatsapp: true,
        },
        {
          id: 'google-1',
          name: 'María García',
          email: 'maria.garcia@empresa.com',
          phone: '+34600111222',
          company: 'Tech Solutions SL',
          position: 'Directora de Marketing',
          lead_score: 85,
          deal_stage: 'qualified',
          tags: ['Clientes', 'VIP'],
          last_contact: new Date('2024-01-15'),
          whatsapp: true,
        },
        {
          id: 'google-2',
          name: 'Juan Rodríguez',
          email: 'juan.rodriguez@startup.es',
          phone: '+34600223344',
          company: 'Innovate Tech',
          position: 'CEO',
          lead_score: 75,
          deal_stage: 'contacted',
          tags: ['Prospectos', 'Startup'],
          last_contact: new Date('2024-01-10'),
          whatsapp: true,
        },
        {
          id: 'google-3',
          name: 'Ana Martínez',
          email: 'ana.martinez@consultora.com',
          phone: '+34600334455',
          company: 'Business Consulting',
          position: 'Consultora Senior',
          lead_score: 90,
          deal_stage: 'proposal',
          tags: ['Socios', 'Colaboradores'],
          last_contact: new Date('2024-01-20'),
          whatsapp: true,
        },
        {
          id: 'google-4',
          name: 'Carlos López',
          email: 'carlos.lopez@corporation.com',
          phone: '+34600445566',
          company: 'Global Corporation',
          position: 'CTO',
          lead_score: 80,
          deal_stage: 'negotiation',
          tags: ['Clientes', 'Enterprise'],
          last_contact: new Date('2024-01-08'),
          whatsapp: true,
        },
        {
          id: 'google-5',
          name: 'Laura Sánchez',
          email: 'laura.sanchez@digital.com',
          phone: '+34600556677',
          company: 'Digital Agency',
          position: 'Directora Creativa',
          lead_score: 70,
          deal_stage: 'new',
          tags: ['Prospectos', 'Marketing'],
          last_contact: new Date('2024-01-18'),
          whatsapp: true,
        },
      ];

      setContacts(mockContacts);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar datos CRM:', error);
      setIsLoading(false);
    }
  };

  const handleSendWhatsApp = async (contactId: string, template: string) => {
    try {
      const result = await crmGodMode.sendWhatsAppMessage(contactId, template as any);
      if (result.success) {
        alert(`✅ Mensaje WhatsApp enviado a ${contacts.find(c => c.id === contactId)?.name}`);
      } else {
        alert(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      alert('❌ Error al enviar mensaje WhatsApp');
    }
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      new: 'bg-gray-100 text-gray-800',
      contacted: 'bg-blue-100 text-blue-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-yellow-100 text-yellow-800',
      negotiation: 'bg-orange-100 text-orange-800',
      closed_won: 'bg-purple-100 text-purple-800',
      closed_lost: 'bg-red-100 text-red-800',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = filterStage === 'all' || contact.deal_stage === filterStage;

    return matchesSearch && matchesStage;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando CRM God Mode...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                👥 CRM God Mode
              </h1>
              <p className="text-gray-600 mt-2">
                Gestión de contactos Google + WhatsApp para AIGestion.net
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Contacto Principal</p>
                <p className="font-semibold text-purple-600">Alejandro</p>
                <p className="text-sm text-gray-600">+34 618 779 308</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                A
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
                  <p className="text-blue-100 text-sm">Total Contactos</p>
                  <p className="text-3xl font-bold">{stats.total_contacts}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Nuevos Hoy</p>
                  <p className="text-3xl font-bold">{stats.new_contacts_today}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Deals Activos</p>
                  <p className="text-3xl font-bold">{stats.active_deals}</p>
                </div>
                <Target className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">WhatsApp</p>
                  <p className="text-3xl font-bold">{stats.whatsapp_contacts}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar contactos por nombre, email o empresa..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterStage}
                onChange={e => setFilterStage(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todas las Etapas</option>
                <option value="new">Nuevos</option>
                <option value="contacted">Contactados</option>
                <option value="qualified">Calificados</option>
                <option value="proposal">Propuesta</option>
                <option value="negotiation">Negociación</option>
                <option value="closed_won">Ganados</option>
                <option value="closed_lost">Perdidos</option>
              </select>

              <button className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Nuevo Contacto</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Etapa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WhatsApp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map(contact => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                          {contact.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                          {contact.position && (
                            <div className="text-xs text-gray-400">{contact.position}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.company || '-'}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getLeadScoreColor(contact.lead_score)}`}
                      >
                        {contact.lead_score}/100
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(contact.deal_stage)}`}
                      >
                        {contact.deal_stage.replace('_', ' ').toUpperCase()}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {contact.whatsapp ? (
                        <div className="flex items-center text-green-600">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">Activo</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">No</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {contact.whatsapp && (
                          <button
                            onClick={() => handleSendWhatsApp(contact.id, 'welcome')}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Enviar WhatsApp"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Ver detalles"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                          title="Más opciones"
                        >
                          <Filter className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact Detail Modal */}
        {selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Detalles del Contacto</h2>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedContact.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-800">{selectedContact.name}</h3>
                    <p className="text-gray-600">{selectedContact.position}</p>
                    <p className="text-gray-500">{selectedContact.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Información de Contacto</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{selectedContact.email}</span>
                      </div>
                      {selectedContact.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{selectedContact.phone}</span>
                        </div>
                      )}
                      {selectedContact.whatsapp && (
                        <div className="flex items-center text-sm text-green-600">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          <span>WhatsApp disponible</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Información CRM</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Lead Score:</span>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getLeadScoreColor(selectedContact.lead_score)}`}
                        >
                          {selectedContact.lead_score}/100
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Etapa:</span>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(selectedContact.deal_stage)}`}
                        >
                          {selectedContact.deal_stage.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                      {selectedContact.last_contact && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Último contacto:</span>
                          <span className="text-sm">
                            {selectedContact.last_contact.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedContact.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-2">Etiquetas</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedContact.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  {selectedContact.whatsapp && (
                    <button
                      onClick={() => {
                        handleSendWhatsApp(selectedContact.id, 'follow_up');
                        setSelectedContact(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar WhatsApp</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedContact(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Importar Google</div>
                <div className="text-sm text-gray-500">Sincronizar contactos</div>
              </div>
            </button>

            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Campaña WhatsApp</div>
                <div className="text-sm text-gray-500">Enviar mensajes</div>
              </div>
            </button>

            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Reportes</div>
                <div className="text-sm text-gray-500">Ver estadísticas</div>
              </div>
            </button>

            <button className="p-4 bg-white rounded-lg hover:shadow-md transition-all flex items-center space-x-3">
              <Zap className="w-5 h-5 text-orange-600" />
              <div className="text-left">
                <div className="font-medium">Automatización</div>
                <div className="text-sm text-gray-500">Configurar reglas</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
