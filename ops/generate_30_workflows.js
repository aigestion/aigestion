const fs = require('fs');
const path = require('path');

const workflowsDir = path.join(__dirname, 'n8n/workflows');

const workflows = [
  {
    id: 91,
    name: 'GOD-MODE Sovereign Connectivity Bridge Monitor',
    description: 'Monitors socat tunnels and sovereign bridge health.',
  },
  {
    id: 92,
    name: 'AI Swarm Engine Performance Auditor',
    description: 'Analyzes response times and token usage of Swarm nodes.',
  },
  {
    id: 93,
    name: 'DATA RAG Engine (ChromaDB) Maintenance',
    description: 'Schedules pruning and re-indexing of ChromaDB collections.',
  },
  {
    id: 94,
    name: 'AUTH JWT-Cookie Secret Rotation Notification',
    description: 'Alerts on scheduled security secret rotations.',
  },
  {
    id: 95,
    name: 'OPS Docker Container Health Auto-Restarter',
    description: 'Automatically restarts failed containers in the Nexus stack.',
  },
  {
    id: 96,
    name: 'ML NeuroCore Model Retraining Trigger',
    description: 'Starts model retraining based on performance degradation triggers.',
  },
  {
    id: 97,
    name: 'DOCS Automated OpenAPI to Notion Sync',
    description: 'Syncs backend API definitions to the internal knowledge base.',
  },
  {
    id: 98,
    name: 'MARKETING LinkedIn-X Content Synchronizer',
    description: 'Cross-posts validated brand content across social platforms.',
  },
  {
    id: 99,
    name: 'CLIENT Premium Subscription Billing Auto-Sync',
    description: 'Syncs Stripe subscription status to internal User DB.',
  },
  {
    id: 100,
    name: 'SECURITY GCP IAM Policy Auditor',
    description: 'Periodic scan of GCP permissions for the Nexus project.',
  },
  {
    id: 101,
    name: 'DEV CI-CD Pipeline Failure Detailed Analysis',
    description: 'Gemini-powered analysis of build logs on failure.',
  },
  {
    id: 102,
    name: 'VOICE Vapi AI Voice Interaction Log Analysis',
    description: 'Summarizes voice sessions and extracts action items.',
  },
  {
    id: 103,
    name: 'LEGAL GDPR-Intellectual Property Auditor',
    description: 'Ensures data compliance and audits asset ownership.',
  },
  {
    id: 104,
    name: 'FINANCE BigQuery Analytics to CFO Dashboard',
    description: 'Transforms raw usage data into financial metrics.',
  },
  {
    id: 105,
    name: 'USER Churn Risk Predictor',
    description: 'Identifies at-risk users based on activity patterns.',
  },
  {
    id: 106,
    name: 'NEXUS Sovereign Bridge Health Monitor',
    description: 'Verifies connectivity through the Sovereign Bridge.',
  },
  {
    id: 107,
    name: 'BROWSER Secure Navigator Session Cleaner',
    description: 'Cleans up temporary data from crawler sessions.',
  },
  {
    id: 108,
    name: 'TEST Final Verification Suite Auto-Run',
    description: 'Triggers the full system verification suite daily.',
  },
  {
    id: 109,
    name: 'SEO Search Console to Blog Ideas',
    description: 'Generates content drafts based on search performance.',
  },
  {
    id: 110,
    name: 'ADMIN Root Operator activity log backup',
    description: 'Safely archives God-level activity logs.',
  },
  {
    id: 111,
    name: 'MOBILE Expo-Capacitor Version Checker',
    description: 'Monitors mobile app store versions and sync status.',
  },
  {
    id: 112,
    name: 'DRIVE Google Drive Evidence Organizer',
    description: 'Categorizes incoming documents from external services.',
  },
  {
    id: 113,
    name: 'MAIL Business Main SMTP Health Checker',
    description: 'Ensures alejandro@aigestion.net mail flow.',
  },
  {
    id: 114,
    name: 'WEB3 Metamask-SafePal Balance Watchdog',
    description: 'Monitors treasury wallets and transaction history.',
  },
  {
    id: 115,
    name: 'ENERGY Mini PC Resource Optimizer',
    description: 'Controls background tasks based on hardware load.',
  },
  {
    id: 116,
    name: 'QUANTUM Tier 5 Singularity State Verifier',
    description: 'Monitors the most advanced AI integrations.',
  },
  {
    id: 117,
    name: 'HUB Meta-Notion-GCP Sync Auditor',
    description: 'Ensures all integration hubs are in sync.',
  },
  {
    id: 118,
    name: 'AESTHETIC UI Integrity Auditor',
    description: 'Compares current UI screenshots with baseline design.',
  },
  {
    id: 119,
    name: 'KNOWLEDGE KI Automatic Purifier',
    description: 'Refines and updates Knowledge Items from logs.',
  },
  {
    id: 120,
    name: 'MISSION Objective Progress Tracker',
    description: 'Syncs project milestones with real-time progress.',
  },
];

workflows.forEach(w => {
  const fileName = `${w.id}-${w.name.toLowerCase().replace(/ /g, '-')}.json`;
  const content = {
    name: w.name,
    nodes: [
      {
        parameters: {
          rule: {
            interval: [
              {
                field: 'hours',
                interval: 24,
              },
            ],
          },
        },
        name: 'Schedule Trigger',
        type: 'n8n-nodes-base.scheduleTrigger',
        typeVersion: 1,
        position: [250, 300],
      },
      {
        parameters: {
          content: w.description,
        },
        name: 'Description',
        type: 'n8n-nodes-base.noOp',
        typeVersion: 1,
        position: [450, 300],
      },
    ],
    connections: {
      'Schedule Trigger': {
        main: [
          [
            {
              node: 'Description',
              type: 'main',
              index: 0,
            },
          ],
        ],
      },
    },
    active: false,
    settings: {},
    id: w.id.toString(),
    meta: {
      instanceId: 'aigestion-nexus-v2',
    },
  };

  fs.writeFileSync(path.join(workflowsDir, fileName), JSON.stringify(content, null, 2));
  console.log(`Created ${fileName}`);
});
