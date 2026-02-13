/**
 * 🌌 GMAIL GOD MODE - AUTOMATION SCRIPT
 * Version: 2.0 (AIGestion Edition)
 * description: Automated labeling, archiving, and maintenance for a dual Personal/Professional inbox.
 */

// ==========================================
// ⚙️ CONFIGURATION
// ==========================================
const CONFIG = {
  // Label Structure
  labels: {
    professional: '🔧 TRABAJO',
    personal: '📱 PERSONAL',
    security: '🔐 SEGURIDAD',
    finance: '💰 FINANZAS',
    ai_alerts: '🤖 AI_ALERTS', // For AIGestion/VertexAI notifications
    newsletters: '📰 READING',
  },

  // Archiving Rules (Days to keep in Inbox before auto-archive if read)
  archiveAfterDays: 7,

  // Professional Keywords (Regex)
  professionalKeywords: [
    'invoice',
    'factura',
    'recibo',
    'contract',
    'contrato',
    'vertex',
    'google cloud',
    'aws',
    'azure',
    'vercel',
    'docker',
    'github',
    'gitlab',
    'jira',
    'trello',
    'slack',
    'meeting',
    'propuesta',
    'presupuesto',
    'aigestion',
    'nexus',
    'api key',
  ],

  // Security/Tech Keywords
  securityKeywords: [
    'security alert',
    'verify your device',
    '2fa',
    'code',
    'verification',
    'password reset',
    'login alert',
    'nueva inicio de sesión',
  ],
};

// ==========================================
// 🚀 MAIN FUNCTIONS
// ==========================================

/**
 * Main Trigger Function - Run this every 10-15 minutes or Hourly.
 */
function godModeRun() {
  Logger.log('🚀 Starting God Mode Run...');

  autoLabelIncoming();
  cleanupOldNotifications();

  Logger.log('✅ God Mode Run Complete.');
}

/**
 * Scans Inbox for unlabeled threads and applies logic.
 */
function autoLabelIncoming() {
  // Get threads in Inbox (limit 50 to avoid timeouts per run)
  const threads = GmailApp.getInboxThreads(0, 50);

  if (threads.length === 0) {
    Logger.log('No new threads in Inbox.');
    return;
  }

  const labelWork = getOrCreateLabel(CONFIG.labels.professional);
  const labelPersonal = getOrCreateLabel(CONFIG.labels.personal);
  const labelSecurity = getOrCreateLabel(CONFIG.labels.security);
  const labelAI = getOrCreateLabel(CONFIG.labels.ai_alerts);

  threads.forEach(thread => {
    // Skip if already categorized by this script (heuristic)
    // Gmail API doesn't allow easy "has NO label" checking efficiently without list,
    // so we just check matching conditions.

    const messages = thread.getMessages();
    const lastMessage = messages[messages.length - 1];
    const subject = lastMessage.getSubject().toLowerCase();
    const body = lastMessage.getPlainBody().toLowerCase();
    const sender = lastMessage.getFrom().toLowerCase();

    let isLabeled = false;

    // 1. Security Check
    if (matchesAny(subject + ' ' + body, CONFIG.securityKeywords)) {
      thread.addLabel(labelSecurity);
      isLabeled = true;
      Logger.log(`[SECURITY] Labeled: ${subject}`);
    }

    // 2. Professional / Tech Check
    else if (matchesAny(subject + ' ' + body + ' ' + sender, CONFIG.professionalKeywords)) {
      thread.addLabel(labelWork);

      // Sub-label for AI/Cloud specific
      if (subject.includes('vertex') || subject.includes('ai') || sender.includes('google')) {
        thread.addLabel(labelAI);
      }

      isLabeled = true;
      Logger.log(`[WORK] Labeled: ${subject}`);
    }

    // 3. Fallback to Personal if not System/Promo (Heuristic)
    // Using Gmail's smart categories if available, else manual
    else {
      // If it hasn't matched work rules, likely personal
      thread.addLabel(labelPersonal);
      Logger.log(`[PERSONAL] Labeled: ${subject}`);
    }
  });
}

/**
 * Auto-archives regular notifications older than X days to keep Inbox clean.
 * Does NOT archive Starred or Important messages.
 */
function cleanupOldNotifications() {
  const age = CONFIG.archiveAfterDays;
  const query = `label:inbox -is:starred -is:important older_than:${age}d`;

  const threads = GmailApp.search(query);

  if (threads.length > 0) {
    Logger.log(`🗑️ Archiving ${threads.length} old threads...`);
    GmailApp.moveThreadsToArchive(threads);
  }
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

/**
 * TEST RUNNER - Run this manually to verify logic without processing everything.
 */
function test_run() {
  Logger.log('🧪 STARTING TEST RUN');
  const threads = GmailApp.getInboxThreads(0, 5); // Just check top 5
  Logger.log(`Found ${threads.length} threads to test.`);

  threads.forEach(t => {
    Logger.log(`Subject: ${t.getFirstMessageSubject()}`);
  });
  Logger.log(
    '🧪 TEST COMPLETE (No actions taken in this specific log function, refer to godModeRun for action)'
  );
}
