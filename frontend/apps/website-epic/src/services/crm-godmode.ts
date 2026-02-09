/**
 * CRM God Mode - AIGestion.net
 * Sistema de gestión de contactos Google + WhatsApp a nivel dios
 * Integración completa con contactos de Google y gestión empresarial
 */

export interface GoogleContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
  labels: string[];
  last_contact?: Date;
  birthday?: string;
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  social_media?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
    instagram?: string;
  };
  custom_fields?: Record<string, any>;
}

export interface WhatsAppContact {
  phone: string;
  name: string;
  status: 'active' | 'inactive' | 'blocked';
  last_message?: Date;
  unread_count: number;
  profile_picture?: string;
  business_contact: boolean;
  verified: boolean;
}

export interface CRMContact extends GoogleContact {
  whatsapp?: WhatsAppContact;
  crm_data: {
    lead_score: number; // 0-100
    deal_stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
    deal_value?: number;
    follow_up_date?: Date;
    tags: string[];
    assigned_to?: string;
    source: 'google' | 'whatsapp' | 'website' | 'referral' | 'social' | 'internal';
    created_at: Date;
    updated_at: Date;
    interactions: Array<{
      type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'note';
      date: Date;
      duration?: number;
      notes?: string;
      cost?: number;
    }>;
  };
}

export interface CRMSettings {
  google_contacts: {
    sync_enabled: boolean;
    sync_frequency: 'realtime' | 'hourly' | 'daily';
    auto_import: boolean;
    labels_to_sync: string[];
    exclude_duplicates: boolean;
  };
  whatsapp: {
    business_number: string;
    auto_reply_enabled: boolean;
    welcome_message: string;
    business_hours: {
      monday_friday: { start: string; end: string };
      saturday: { start: string; end: string };
      sunday: { start: string; end: string };
    };
    templates: {
      welcome: string;
      follow_up: string;
      promotion: string;
      support: string;
    };
  };
  automation: {
    lead_scoring: boolean;
    auto_followup: boolean;
    duplicate_detection: boolean;
    smart_tags: boolean;
  };
  aigestion_contact: {
    name: string;
    phone: string;
    email: string;
    role: string;
    department: string;
  };
}

// Configuración principal del CRM God Mode
export const crmGodModeSettings: CRMSettings = {
  google_contacts: {
    sync_enabled: true,
    sync_frequency: 'realtime',
    auto_import: true,
    labels_to_sync: ['Clientes', 'Prospectos', 'Socios', 'Proveedores', 'Amigos'],
    exclude_duplicates: true,
  },

  whatsapp: {
    business_number: '+34618779308',
    auto_reply_enabled: true,
    welcome_message: '¡Hola! Soy Alejandro de AIGestion. Gracias por contactarnos. ¿En qué puedo ayudarte hoy?',
    business_hours: {
      monday_friday: { start: '09:00', end: '18:00' },
      saturday: { start: '10:00', end: '14:00' },
      sunday: { start: 'closed', end: 'closed' },
    },
    templates: {
      welcome: '¡Hola {name}! Bienvenido a AIGestion. Soy Alejandro y estoy aquí para ayudarte con soluciones de IA para tu negocio.',
      follow_up: 'Hola {name}, ¿cómo va todo con {previous_topic}? Quería saber si necesitas algo más de nuestra parte.',
      promotion: '🎉 Oferta especial para {name}! 30% de descuento en nuestros servicios de IA. ¡Contáctame!',
      support: 'Hola {name}, he recibido tu consulta sobre {issue}. Estoy revisando y te respondo en breve.',
    },
  },

  automation: {
    lead_scoring: true,
    auto_followup: true,
    duplicate_detection: true,
    smart_tags: true,
  },

  aigestion_contact: {
    name: 'Alejandro',
    phone: '+34618779308',
    email: 'alejandro@aigestion.net',
    role: 'CEO & Founder',
    department: 'Dirección General',
  },
};

// Gestor principal del CRM God Mode
export class CRMGodMode {
  private settings: CRMSettings;
  private contacts: CRMContact[] = [];
  private syncStatus = {
    google_last_sync: new Date(),
    whatsapp_last_sync: new Date(),
    total_contacts: 0,
    new_contacts_today: 0,
    duplicates_removed: 0,
  };

  constructor() {
    this.settings = crmGodModeSettings;
    this.initializeCRM();
  }

  /**
   * Inicializar el CRM God Mode
   */
  private async initializeCRM(): Promise<void> {
    console.log('🚀 Inicializando CRM God Mode para AIGestion.net...');

    // Configurar contacto principal de AIGestion
    await this.setupAigestionContact();

    // Inicializar sincronización
    await this.initializeSync();

    // Configurar automatizaciones
    await this.setupAutomations();

    console.log('✅ CRM God Mode inicializado con éxito');
    console.log(`📞 WhatsApp Business: ${this.settings.whatsapp.business_number}`);
    console.log(`👤 Contacto principal: ${this.settings.aigestion_contact.name}`);
  }

  /**
   * Configurar contacto principal de AIGestion
   */
  private async setupAigestionContact(): Promise<void> {
    const aigestionContact: CRMContact = {
      id: 'aigestion-main',
      name: this.settings.aigestion_contact.name,
      email: this.settings.aigestion_contact.email,
      phone: this.settings.aigestion_contact.phone,
      company: 'AIGestion',
      position: this.settings.aigestion_contact.role,
      labels: ['Principal', 'CEO', 'Fundador'],
      notes: 'Contacto principal de AIGestion.net - Especialista en IA empresarial',

      whatsapp: {
        phone: this.settings.aigestion_contact.phone,
        name: this.settings.aigestion_contact.name,
        status: 'active',
        unread_count: 0,
        business_contact: true,
        verified: true,
      },

      crm_data: {
        lead_score: 100,
        deal_stage: 'closed_won',
        tags: ['CEO', 'Fundador', 'Principal'],
        source: 'internal',
        created_at: new Date(),
        updated_at: new Date(),
        interactions: [],
      },
    };

    // Agregar a la lista de contactos
    this.contacts.push(aigestionContact);

    console.log(`👤 Contacto AIGestion configurado: ${aigestionContact.name} - ${aigestionContact.phone}`);
  }

  /**
   * Inicializar sincronización con Google Contacts
   */
  private async initializeSync(): Promise<void> {
    if (this.settings.google_contacts.sync_enabled) {
      console.log('📱 Configurando sincronización con Google Contacts...');

      // Simular importación de contactos de Google
      const googleContacts = await this.importGoogleContacts();
      await this.mergeContacts(googleContacts);

      this.syncStatus.google_last_sync = new Date();
      console.log(`✅ ${googleContacts.length} contactos de Google sincronizados`);
    }
  }

  /**
   * Importar contactos de Google (simulado)
   */
  private async importGoogleContacts(): Promise<GoogleContact[]> {
    // Simular contactos de Google para demostración
    return [
      {
        id: 'google-1',
        name: 'María García',
        email: 'maria.garcia@empresa.com',
        phone: '+34600111222',
        company: 'Tech Solutions SL',
        position: 'Directora de Marketing',
        labels: ['Clientes', 'VIP'],
        last_contact: new Date('2024-01-15'),
        address: {
          street: 'Calle Gran Via 123',
          city: 'Madrid',
          country: 'España',
          postalCode: '28013',
        },
        social_media: {
          linkedin: 'https://linkedin.com/in/mariagarcia',
          twitter: '@mariagarcia',
          instagram: '@mariagarcia_official',
        },
      },

      {
        id: 'google-2',
        name: 'Juan Rodríguez',
        email: 'juan.rodriguez@startup.es',
        phone: '+34600223344',
        company: 'Innovate Tech',
        position: 'CEO',
        labels: ['Prospectos', 'Startup'],
        last_contact: new Date('2024-01-10'),
        address: {
          street: 'Avenida Diagonal 456',
          city: 'Barcelona',
          country: 'España',
          postalCode: '08002',
        },
      },

      {
        id: 'google-3',
        name: 'Ana Martínez',
        email: 'ana.martinez@consultora.com',
        phone: '+34600334455',
        company: 'Business Consulting',
        position: 'Consultora Senior',
        labels: ['Socios', 'Colaboradores'],
        last_contact: new Date('2024-01-20'),
        social_media: {
          linkedin: 'https://linkedin.com/in/anamartinez',
          website: 'https://anamartinez.consulting',
        },
      },

      {
        id: 'google-4',
        name: 'Carlos López',
        email: 'carlos.lopez@corporation.com',
        phone: '+34600445566',
        company: 'Global Corporation',
        position: 'CTO',
        labels: ['Clientes', 'Enterprise'],
        last_contact: new Date('2024-01-08'),
        address: {
          street: 'Paseo de la Castellana 789',
          city: 'Madrid',
          country: 'España',
          postalCode: '28046',
        },
      },

      {
        id: 'google-5',
        name: 'Laura Sánchez',
        email: 'laura.sanchez@digital.com',
        phone: '+34600556677',
        company: 'Digital Agency',
        position: 'Directora Creativa',
        labels: ['Prospectos', 'Marketing'],
        last_contact: new Date('2024-01-18'),
        social_media: {
          instagram: '@laurasanchez',
          twitter: '@laura_digital',
        },
      },
    ];
  }

  /**
   * Fusionar contactos de Google con CRM existente
   */
  private async mergeContacts(googleContacts: GoogleContact[]): Promise<void> {
    for (const googleContact of googleContacts) {
      // Verificar si ya existe
      const existingContact = this.contacts.find(c =>
        c.email === googleContact.email || c.phone === googleContact.phone
      );

      if (!existingContact) {
        // Crear nuevo contacto CRM
        const crmContact: CRMContact = {
          ...googleContact,
          crm_data: {
            lead_score: this.calculateLeadScore(googleContact),
            deal_stage: 'new',
            tags: googleContact.labels,
            source: 'google',
            created_at: new Date(),
            updated_at: new Date(),
            interactions: [],
          },
        };

        // Agregar información de WhatsApp si tiene teléfono
        if (googleContact.phone) {
          crmContact.whatsapp = {
            phone: googleContact.phone,
            name: googleContact.name,
            status: 'active',
            unread_count: 0,
            business_contact: true,
            verified: false,
          };
        }

        this.contacts.push(crmContact);
        this.syncStatus.new_contacts_today++;
      } else {
        // Actualizar contacto existente
        (existingContact as any).updated_at = new Date();
        if (googleContact.last_contact && googleContact.last_contact > (existingContact.last_contact || new Date(0))) {
          existingContact.last_contact = googleContact.last_contact;
        }
      }
    }
  }

  /**
   * Calcular lead score basado en información del contacto
   */
  private calculateLeadScore(contact: GoogleContact): number {
    let score = 0;

    // Puntos por posición
    if (contact.position) {
      if (contact.position.includes('CEO') || contact.position.includes('Director')) score += 30;
      else if (contact.position.includes('Manager')) score += 20;
      else if (contact.position.includes('Senior')) score += 15;
      else score += 10;
    }

    // Puntos por empresa
    if (contact.company) {
      if (contact.company.includes('Corporation') || contact.company.includes('Global')) score += 20;
      else if (contact.company.includes('SL') || contact.company.includes('Ltd')) score += 15;
      else score += 10;
    }

    // Puntos por etiquetas
    if (contact.labels.includes('VIP')) score += 25;
    if (contact.labels.includes('Clientes')) score += 20;
    if (contact.labels.includes('Prospectos')) score += 15;

    // Puntos por redes sociales
    if (contact.social_media?.linkedin) score += 10;
    if (contact.social_media?.website) score += 10;

    // Puntos por contacto reciente
    if (contact.last_contact) {
      const daysSinceContact = Math.floor((new Date().getTime() - contact.last_contact.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceContact < 7) score += 15;
      else if (daysSinceContact < 30) score += 10;
      else if (daysSinceContact < 90) score += 5;
    }

    return Math.min(score, 100);
  }

  /**
   * Configurar automatizaciones
   */
  private async setupAutomations(): Promise<void> {
    if (this.settings.automation.lead_scoring) {
      console.log('🎯 Sistema de lead scoring activado');
    }

    if (this.settings.automation.auto_followup) {
      console.log('📅 Seguimiento automático configurado');
    }

    if (this.settings.automation.duplicate_detection) {
      console.log('🔍 Detección de duplicados activada');
    }

    if (this.settings.automation.smart_tags) {
      console.log('🏷️ Etiquetado inteligente activado');
    }
  }

  /**
   * Enviar mensaje por WhatsApp
   */
  async sendWhatsAppMessage(
    contactId: string,
    template: keyof typeof crmGodModeSettings.whatsapp.templates,
    customVariables?: Record<string, string>
  ): Promise<{
    success: boolean;
    message?: string;
    cost?: number;
  }> {
    const contact = this.contacts.find(c => c.id === contactId);

    if (!contact || !contact.whatsapp) {
      return {
        success: false,
        message: 'Contacto no encontrado o sin WhatsApp',
      };
    }

    // Generar mensaje personalizado
    const templateText = this.settings.whatsapp.templates[template];
    let personalizedMessage = templateText.replace(/{name}/g, contact.name);

    if (customVariables) {
      Object.entries(customVariables).forEach(([key, value]) => {
        personalizedMessage = personalizedMessage.replace(new RegExp(`{${key}}`, 'g'), value);
      });
    }

    // Simular envío de mensaje
    console.log(`📱 Enviando WhatsApp a ${contact.name} (${contact.whatsapp.phone}):`);
    console.log(`📝 Mensaje: ${personalizedMessage}`);

    // Actualizar información del contacto
    contact.crm_data.interactions.push({
      type: 'whatsapp',
      date: new Date(),
      notes: `Mensaje enviado: ${template}`,
      cost: 0, // WhatsApp Business gratuito
    });

    contact.crm_data.updated_at = new Date();
    if (contact.whatsapp) {
      contact.whatsapp.last_message = new Date();
    }

    return {
      success: true,
      message: personalizedMessage,
      cost: 0,
    };
  }

  /**
   * Buscar contactos por criterios
   */
  searchContacts(criteria: {
    name?: string;
    company?: string;
    labels?: string[];
    deal_stage?: string;
    min_lead_score?: number;
  }): CRMContact[] {
    return this.contacts.filter(contact => {
      if (criteria.name && !contact.name.toLowerCase().includes(criteria.name.toLowerCase())) {
        return false;
      }

      if (criteria.company && !contact.company?.toLowerCase().includes(criteria.company.toLowerCase())) {
        return false;
      }

      if (criteria.labels && !criteria.labels.every(label => contact.labels.includes(label))) {
        return false;
      }

      if (criteria.deal_stage && contact.crm_data.deal_stage !== criteria.deal_stage) {
        return false;
      }

      if (criteria.min_lead_score && contact.crm_data.lead_score < criteria.min_lead_score) {
        return false;
      }

      return true;
    });
  }

  /**
   * Obtener estadísticas del CRM
   */
  getCRMStats(): {
    total_contacts: number;
    new_contacts_today: number;
    active_deals: number;
    total_pipeline_value: number;
    top_sources: Record<string, number>;
    deal_stages: Record<string, number>;
    whatsapp_contacts: number;
  } {
    const stats = {
      total_contacts: this.contacts.length,
      new_contacts_today: this.syncStatus.new_contacts_today,
      active_deals: this.contacts.filter(c =>
        ['contacted', 'qualified', 'proposal', 'negotiation'].includes(c.crm_data.deal_stage)
      ).length,
      total_pipeline_value: this.contacts
        .filter(c => c.crm_data.deal_value)
        .reduce((sum, c) => sum + (c.crm_data.deal_value || 0), 0),
      top_sources: {} as Record<string, number>,
      deal_stages: {} as Record<string, number>,
      whatsapp_contacts: this.contacts.filter(c => c.whatsapp).length,
    };

    // Calcular fuentes
    this.contacts.forEach(contact => {
      const source = contact.crm_data.source;
      stats.top_sources[source] = (stats.top_sources[source] || 0) + 1;
    });

    // Calcular etapas de deals
    this.contacts.forEach(contact => {
      const stage = contact.crm_data.deal_stage;
      stats.deal_stages[stage] = (stats.deal_stages[stage] || 0) + 1;
    });

    return stats;
  }

  /**
   * Obtener contacto de AIGestion
   */
  getAigestionContact(): CRMContact {
    return this.contacts.find(c => c.id === 'aigestion-main')!;
  }

  /**
   * Actualizar información de contacto
   */
  updateContact(contactId: string, updates: Partial<CRMContact>): boolean {
    const contactIndex = this.contacts.findIndex(c => c.id === contactId);

    if (contactIndex === -1) {
      return false;
    }

    this.contacts[contactIndex] = {
      ...this.contacts[contactIndex],
      ...updates,
      crm_data: {
        ...this.contacts[contactIndex].crm_data,
        ...updates.crm_data,
        updated_at: new Date(),
      },
    };

    return true;
  }

  /**
   * Agregar interacción a contacto
   */
  addInteraction(
    contactId: string,
    interaction: {
      type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'note';
      notes?: string;
      duration?: number;
      cost?: number;
    }
  ): boolean {
    const contact = this.contacts.find(c => c.id === contactId);

    if (!contact) {
      return false;
    }

    contact.crm_data.interactions.push({
      ...interaction,
      date: new Date(),
    });

    contact.crm_data.updated_at = new Date();
    contact.last_contact = new Date();

    // Actualizar lead score basado en interacción
    if (interaction.type === 'meeting') {
      contact.crm_data.lead_score = Math.min(contact.crm_data.lead_score + 10, 100);
    } else if (interaction.type === 'call') {
      contact.crm_data.lead_score = Math.min(contact.crm_data.lead_score + 5, 100);
    }

    return true;
  }
}

export const crmGodMode = new CRMGodMode();
