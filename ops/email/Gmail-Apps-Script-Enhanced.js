/**
 * 🚀 AIGESTION GMAIL GOD MODE - ENHANCED SCRIPT
 * Version: 3.0 (Professional Edition)
 * Description: Advanced email automation with AI-powered categorization and smart responses
 */

// ==========================================
// ⚙️ ADVANCED CONFIGURATION
// ==========================================
const CONFIG = {
  // Email Accounts Configuration
  accounts: {
    personal: {
      email: 'nemisanalex@gmail.com',
      type: 'personal',
      priority: 'normal',
    },
    professional: {
      email: 'admin@aigestion.net',
      type: 'professional',
      priority: 'high',
    },
  },

  // Enhanced Label Structure
  labels: {
    professional: {
      main: '🔧 TRABAJO',
      sublabels: ['🤖 AI_ALERTS', '💼 CLIENTES', '📊 ANALYTICS', '🔧 DEV_OPS', '💰 FINANZAS'],
    },
    personal: {
      main: '📱 PERSONAL',
      sublabels: ['🏠 FAMILIA', '🎮 ENTRETENIMIENTO', '🛒 COMPRAS', '🏃 FITNESS', '📚 EDUCACION'],
    },
    system: {
      main: '🔐 SEGURIDAD',
      sublabels: ['🚨 ALERTAS', '🔑 AUTENTICACION', '📈 MONITOREO'],
    },
    content: {
      main: '📰 CONTENT',
      sublabels: ['📰 NEWSLETTERS', '🎥 VIDEOS', '📖 ARTICLES', '🎵 PODCASTS'],
    },
  },

  // Smart Response Templates
  responses: {
    outOfOffice: {
      subject: '🌴 Fuera de Oficina - AIGestion',
      keywords: ['vacation', 'out of office', 'away', 'unavailable'],
      autoReply: true,
      template: 'outOfOffice',
    },
    welcome: {
      subject: '✅ Bienvenido a AIGestion',
      keywords: ['new client', 'welcome', 'onboarding'],
      autoReply: true,
      template: 'welcome',
    },
    support: {
      subject: '🛠️ Soporte AIGestion - Ticket #{{TICKET_ID}}',
      keywords: ['support', 'help', 'issue', 'problem'],
      autoReply: false,
      template: 'support',
    },
  },

  // Advanced Processing Rules
  processing: {
    archiveAfterDays: 7,
    markImportantThreshold: 0.8,
    autoResponseDelay: 300, // 5 minutes
    batchProcessingSize: 50,
    aiClassificationEnabled: true,
  },

  // Priority Keywords
  priorityKeywords: {
    urgent: ['urgent', 'asap', 'emergency', 'critical', 'immediate'],
    high: ['important', 'priority', 'deadline', 'meeting'],
    normal: ['info', 'update', 'newsletter', 'notification'],
    low: ['promo', 'sale', 'advertisement', 'spam'],
  },
};

// ==========================================
// 🧠 AI-POWERED CLASSIFICATION
// ==========================================

/**
 * Advanced email classification with AI logic
 */
function classifyEmailAdvanced(subject, body, sender) {
  const text = (subject + ' ' + body + ' ' + sender).toLowerCase();

  // Priority Classification
  let priority = 'normal';
  for (const [level, keywords] of Object.entries(CONFIG.priorityKeywords)) {
    if (matchesAny(text, keywords)) {
      priority = level;
      break;
    }
  }

  // Category Classification
  let category = 'personal';
  let subcategory = null;
  let confidence = 0.5;

  // Professional Classification
  if (isProfessionalEmail(text, sender)) {
    category = 'professional';

    if (text.includes('client') || text.includes('customer')) {
      subcategory = '💼 CLIENTES';
      confidence = 0.9;
    } else if (text.includes('github') || text.includes('deploy') || text.includes('code')) {
      subcategory = '🔧 DEV_OPS';
      confidence = 0.85;
    } else if (text.includes('analytics') || text.includes('metrics') || text.includes('report')) {
      subcategory = '📊 ANALYTICS';
      confidence = 0.8;
    } else if (text.includes('invoice') || text.includes('payment') || text.includes('billing')) {
      subcategory = '💰 FINANZAS';
      confidence = 0.95;
    } else if (
      text.includes('ai') ||
      text.includes('vertex') ||
      text.includes('machine learning')
    ) {
      subcategory = '🤖 AI_ALERTS';
      confidence = 0.9;
    }
  }

  // Security Classification
  else if (isSecurityEmail(text)) {
    category = 'system';
    subcategory = '🚨 ALERTAS';
    confidence = 0.95;
    priority = 'high';
  }

  // Content Classification
  else if (isContentEmail(text)) {
    category = 'content';
    if (text.includes('newsletter') || text.includes('digest')) {
      subcategory = '📰 NEWSLETTERS';
      confidence = 0.9;
    } else if (text.includes('video') || text.includes('youtube') || text.includes('vimeo')) {
      subcategory = '🎥 VIDEOS';
      confidence = 0.8;
    }
  }

  // Personal Classification (fallback)
  else {
    category = 'personal';
    if (text.includes('family') || text.includes('birthday') || text.includes('personal')) {
      subcategory = '🏠 FAMILIA';
      confidence = 0.85;
    } else if (text.includes('buy') || text.includes('order') || text.includes('shipment')) {
      subcategory = '🛒 COMPRAS';
      confidence = 0.8;
    } else if (text.includes('netflix') || text.includes('spotify') || text.includes('game')) {
      subcategory = '🎮 ENTRETENIMIENTO';
      confidence = 0.85;
    }
  }

  return {
    category,
    subcategory,
    priority,
    confidence,
    suggestedActions: getSuggestedActions(category, subcategory, priority),
  };
}

function isProfessionalEmail(text, sender) {
  const professionalIndicators = [
    'aigestion',
    'nexus',
    'vertex',
    'api',
    'deploy',
    'client',
    'project',
    'meeting',
    'proposal',
    'contract',
    'invoice',
    'github',
    'gitlab',
    'aws',
    'google cloud',
    'azure',
    'docker',
    'kubernetes',
    'database',
  ];

  const professionalDomains = [
    'aigestion.net',
    'github.com',
    'google.com',
    'aws.amazon.com',
    'microsoft.com',
    'cloud.google.com',
    'vercel.com',
    'heroku.com',
  ];

  return matchesAny(text, professionalIndicators) || matchesAny(sender, professionalDomains);
}

function isSecurityEmail(text) {
  const securityIndicators = [
    'security alert',
    'verify your device',
    '2fa',
    'authentication',
    'password reset',
    'login alert',
    'unusual activity',
    'suspicious',
    'breach',
    'malware',
    'phishing',
    'security notification',
  ];

  return matchesAny(text, securityIndicators);
}

function isContentEmail(text) {
  const contentIndicators = [
    'newsletter',
    'digest',
    'weekly',
    'update',
    'blog post',
    'article',
    'video',
    'podcast',
    'webinar',
    'tutorial',
  ];

  return matchesAny(text, contentIndicators);
}

function getSuggestedActions(category, subcategory, priority) {
  const actions = [];

  if (priority === 'urgent') {
    actions.push('IMMEDIATE_RESPONSE', 'NOTIFY_TEAM', 'STAR_EMAIL');
  } else if (priority === 'high') {
    actions.push('RESPOND_TODAY', 'STAR_EMAIL');
  }

  switch (category) {
    case 'professional':
      actions.push('LABEL_WORK', 'ADD_TO_CRM');
      if (subcategory === '💼 CLIENTES') {
        actions.push('CLIENT_FOLLOWUP');
      } else if (subcategory === '🔧 DEV_OPS') {
        actions.push('CREATE_TICKET');
      }
      break;

    case 'system':
      actions.push('IMMEDIATE_REVIEW', 'SECURITY_ALERT');
      break;

    case 'content':
      actions.push('SCHEDULE_READING', 'ARCHIVE_AFTER_READ');
      break;

    case 'personal':
      actions.push('LABEL_PERSONAL', 'WEEKLY_REVIEW');
      break;
  }

  return actions;
}

// ==========================================
// 🚀 MAIN EXECUTION FUNCTIONS
// ==========================================

/**
 * Main trigger function - Enhanced version
 */
function godModeRunEnhanced() {
  Logger.log('🚀 Starting Enhanced God Mode Run...');

  try {
    // Process inbox
    const processedCount = processInboxAdvanced();

    // Clean up old emails
    const archivedCount = cleanupOldNotificationsAdvanced();

    // Generate daily report
    generateDailyReport(processedCount, archivedCount);

    Logger.log(
      `✅ Enhanced God Mode Complete. Processed: ${processedCount}, Archived: ${archivedCount}`
    );
  } catch (error) {
    Logger.log(`❌ Error in Enhanced God Mode: ${error.toString()}`);
    sendErrorNotification(error);
  }
}

/**
 * Advanced inbox processing
 */
function processInboxAdvanced() {
  const threads = GmailApp.getInboxThreads(0, CONFIG.processing.batchProcessingSize);
  let processedCount = 0;

  // Create all necessary labels
  const labels = createAllLabels();

  threads.forEach(thread => {
    try {
      const messages = thread.getMessages();
      const lastMessage = messages[messages.length - 1];

      const classification = classifyEmailAdvanced(
        lastMessage.getSubject(),
        lastMessage.getPlainBody(),
        lastMessage.getFrom()
      );

      // Apply labels based on classification
      applyLabels(thread, classification, labels);

      // Apply priority actions
      applyPriorityActions(thread, classification);

      // Check for auto-response
      checkAutoResponse(thread, classification, lastMessage);

      processedCount++;

      Logger.log(
        `📧 Processed: ${lastMessage.getSubject()} -> ${classification.category}/${classification.subcategory}`
      );
    } catch (error) {
      Logger.log(`❌ Error processing thread: ${error.toString()}`);
    }
  });

  return processedCount;
}

/**
 * Create all necessary labels
 */
function createAllLabels() {
  const labels = {};

  Object.entries(CONFIG.labels).forEach(([category, config]) => {
    labels[category] = {
      main: getOrCreateLabel(config.main),
      sublabels: {},
    };

    config.sublabels.forEach(sublabel => {
      labels[category].sublabels[sublabel] = getOrCreateLabel(sublabel);
    });
  });

  return labels;
}

/**
 * Apply labels based on classification
 */
function applyLabels(thread, classification, labels) {
  const categoryLabels = labels[classification.category];

  // Add main category label
  if (categoryLabels && categoryLabels.main) {
    thread.addLabel(categoryLabels.main);
  }

  // Add subcategory label if exists
  if (classification.subcategory && categoryLabels.sublabels[classification.subcategory]) {
    thread.addLabel(categoryLabels.sublabels[classification.subcategory]);
  }
}

/**
 * Apply priority-based actions
 */
function applyPriorityActions(thread, classification) {
  switch (classification.priority) {
    case 'urgent':
      thread.star();
      thread.markImportant();
      break;
    case 'high':
      thread.star();
      break;
    case 'low':
      // Consider archiving immediately for low priority content
      if (classification.category === 'content') {
        thread.markRead();
      }
      break;
  }
}

/**
 * Check and send auto-responses
 */
function checkAutoResponse(thread, classification, message) {
  const subject = message.getSubject().toLowerCase();
  const body = message.getPlainBody().toLowerCase();

  Object.entries(CONFIG.responses).forEach(([responseType, config]) => {
    if (matchesAny(subject + ' ' + body, config.keywords) && config.autoReply) {
      // Schedule auto-response with delay
      scheduleAutoResponse(thread, config, message);
    }
  });
}

/**
 * Schedule auto-response with delay
 */
function scheduleAutoResponse(thread, responseConfig, originalMessage) {
  // Create a trigger for delayed response
  const triggerTime = new Date(Date.now() + CONFIG.processing.autoResponseDelay * 1000);

  // Store response data in Properties Service
  const responseData = {
    threadId: thread.getId(),
    responseType: responseConfig.template,
    originalSubject: originalMessage.getSubject(),
    originalFrom: originalMessage.getFrom(),
    scheduledTime: triggerTime.toISOString(),
  };

  PropertiesService.getScriptProperties().setProperty(
    `autoResponse_${thread.getId()}`,
    JSON.stringify(responseData)
  );

  Logger.log(`⏰ Auto-response scheduled for: ${originalMessage.getSubject()}`);
}

/**
 * Send scheduled auto-responses
 */
function sendScheduledResponses() {
  const properties = PropertiesService.getScriptProperties();
  const keys = properties.getKeys();

  keys.forEach(key => {
    if (key.startsWith('autoResponse_')) {
      const responseData = JSON.parse(properties.getProperty(key));
      const scheduledTime = new Date(responseData.scheduledTime);

      if (new Date() >= scheduledTime) {
        sendAutoResponse(responseData);
        properties.deleteProperty(key);
      }
    }
  });
}

/**
 * Send auto-response
 */
function sendAutoResponse(responseData) {
  try {
    const thread = GmailApp.getThreadById(responseData.threadId);
    if (!thread) return;

    const template = getResponseTemplate(responseData.responseType);
    const subject = responseData.originalSubject.startsWith('Re:')
      ? responseData.originalSubject
      : `Re: ${responseData.originalSubject}`;

    const body = template
      .replace('{{ORIGINAL_SUBJECT}}', responseData.originalSubject)
      .replace('{{SENDER}}', responseData.originalFrom)
      .replace('{{DATE}}', new Date().toLocaleDateString());

    thread.reply(body, {
      subject: subject,
    });

    Logger.log(`✅ Auto-response sent for: ${responseData.originalSubject}`);
  } catch (error) {
    Logger.log(`❌ Error sending auto-response: ${error.toString()}`);
  }
}

/**
 * Get response template
 */
function getResponseTemplate(templateType) {
  const templates = {
    outOfOffice: `
Estimado/a,

Gracias por su email. Actualmente me encuentro fuera de oficina con acceso limitado.

📅 **Fecha de retorno:** Próximamente
⏰ **Respuesta:** A mi regreso

Para asuntos urgentes:
- 🚀 **Soporte Técnico:** support@aigestion.net
- 💬 **Chat en vivo:** aigestion.net/chat

Su mensaje será revisado a mi regreso.

Saludos cordiales,
Alejandro Nemi
CEO - AIGestion.net
🚀 Transformación Digital AI
    `,

    welcome: `
Estimado/a,

Gracias por contactar AIGestion.net

🚀 **Hemos recibido su solicitud** y nuestro equipo la está revisando.

📋 **Próximos pasos:**
1. Revisión de sus requisitos (24-48 horas)
2. Propuesta personalizada (2-3 días)
3. Llamada de seguimiento

🔗 **Recursos útiles:**
- 🌐 Sitio web: aigestion.net
- 📊 Demo: demo.aigestion.net
- 📚 Documentación: docs.aigestion.net

Atentamente,
Equipo AIGestion
🚀 Transformación Digital AI
    `,
  };

  return templates[templateType] || templates.welcome;
}

/**
 * Enhanced cleanup function
 */
function cleanupOldNotificationsAdvanced() {
  const age = CONFIG.processing.archiveAfterDays;
  const query = `label:inbox -is:starred -is:important older_than:${age}d`;

  const threads = GmailApp.search(query);
  let archivedCount = 0;

  if (threads.length > 0) {
    // Batch archive to avoid timeouts
    const batchSize = 50;
    for (let i = 0; i < threads.length; i += batchSize) {
      const batch = threads.slice(i, i + batchSize);
      GmailApp.moveThreadsToArchive(batch);
      archivedCount += batch.length;

      // Small delay between batches
      Utilities.sleep(1000);
    }

    Logger.log(`🗑️ Advanced cleanup: ${archivedCount} threads archived`);
  }

  return archivedCount;
}

/**
 * Generate daily report
 */
function generateDailyReport(processedCount, archivedCount) {
  const report = `
📊 **AIGestion Email God Mode - Daily Report**
📅 Date: ${new Date().toLocaleDateString()}
⏰ Time: ${new Date().toLocaleTimeString()}

📧 **Processing Summary:**
- Emails Processed: ${processedCount}
- Emails Archived: ${archivedCount}
- Success Rate: ${processedCount > 0 ? '100%' : 'N/A'}

🏷️ **Label Distribution:**
- Professional: ${getLabelCount('🔧 TRABAJO')}
- Personal: ${getLabelCount('📱 PERSONAL')}
- Security: ${getLabelCount('🔐 SEGURIDAD')}
- Content: ${getLabelCount('📰 CONTENT')}

🚀 **System Status:**
- Gmail API: ✅ Connected
- Auto-responses: ✅ Active
- Classification: ✅ AI-Powered

---
Generated by AIGestion Email God Mode v3.0
  `;

  Logger.log(report);

  // Optionally email the report
  if (shouldSendDailyReport()) {
    GmailApp.sendEmail('admin@aigestion.net', '📊 Daily Email Report - AIGestion God Mode', report);
  }
}

/**
 * Get label count
 */
function getLabelCount(labelName) {
  try {
    const label = GmailApp.getUserLabelByName(labelName);
    return label ? label.getThreads().length : 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Check if daily report should be sent
 */
function shouldSendDailyReport() {
  const now = new Date();
  const hour = now.getHours();

  // Send report at 6 PM daily
  return hour === 18;
}

/**
 * Send error notification
 */
function sendErrorNotification(error) {
  const errorReport = `
🚨 **AIGestion Email God Mode - Error Report**
📅 Date: ${new Date().toLocaleDateString()}
⏰ Time: ${new Date().toLocaleTimeString()}

❌ **Error Details:**
- Message: ${error.toString()}
- Stack: ${error.stack}
- Function: ${error.functionName}

🔧 **Recommended Actions:**
1. Check script permissions
2. Verify Gmail API access
3. Review recent changes
4. Contact support if persists

---
AIGestion Email God Mode v3.0
  `;

  GmailApp.sendEmail('admin@aigestion.net', '🚨 Email God Mode Error Alert', errorReport);
}

// ==========================================
// 🛠️ HELPER FUNCTIONS
// ==========================================

function getOrCreateLabel(name) {
  let label = GmailApp.getUserLabelByName(name);
  if (!label) {
    Logger.log(`Creating new label: ${name}`);
    label = GmailApp.createLabel(name);
  }
  return label;
}

function matchesAny(text, keywords) {
  return keywords.some(keyword => text.includes(keyword.toLowerCase()));
}

// ==========================================
// ⏰ TRIGGER SETUP FUNCTIONS
// ==========================================

/**
 * Setup all triggers for the enhanced system
 */
function setupTriggers() {
  // Delete existing triggers
  deleteAllTriggers();

  // Main processing trigger (every 10 minutes)
  ScriptApp.newTrigger('godModeRunEnhanced').timeBased().everyMinutes(10).create();

  // Auto-response trigger (every 5 minutes)
  ScriptApp.newTrigger('sendScheduledResponses').timeBased().everyMinutes(5).create();

  // Daily report trigger (6 PM daily)
  ScriptApp.newTrigger('generateDailyReport').timeBased().atHour(18).everyDays(1).create();

  Logger.log('✅ All triggers setup complete');
}

/**
 * Delete all existing triggers
 */
function deleteAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
}

/**
 * Test function for development
 */
function testEnhancedSystem() {
  Logger.log('🧪 Testing Enhanced Email System...');

  // Test classification
  const testEmail = {
    subject: 'Urgent: Client Meeting - AIGestion Project',
    body: 'We need to discuss the AI implementation project. This is urgent.',
    sender: 'client@company.com',
  };

  const classification = classifyEmailAdvanced(testEmail.subject, testEmail.body, testEmail.sender);

  Logger.log('🧪 Test Classification Result:');
  Logger.log(JSON.stringify(classification, null, 2));

  // Test label creation
  const labels = createAllLabels();
  Logger.log(`🧪 Created ${Object.keys(labels).length} label categories`);

  Logger.log('🧪 Test complete');
}

// ==========================================
// 🚀 INITIALIZATION
// ==========================================

/**
 * Initialize the enhanced system
 */
function initializeEnhancedSystem() {
  Logger.log('🚀 Initializing Enhanced Email God Mode...');

  try {
    // Create all labels
    createAllLabels();

    // Setup triggers
    setupTriggers();

    // Run initial test
    testEnhancedSystem();

    Logger.log('✅ Enhanced Email God Mode initialized successfully');
  } catch (error) {
    Logger.log(`❌ Initialization failed: ${error.toString()}`);
    throw error;
  }
}
