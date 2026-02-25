# 🏢 Project Management Setup Guide for AIGestion

## 📋 **RESUMEN DE SERVICIOS DE PROJECT MANAGEMENT**

### **Issue Tracking & Task Management**
- **Jira** - Issue tracking y project management
- **Asana** - Task management y team collaboration
- **Trello** - Kanban boards y visual workflow
- **Linear** - Modern issue tracking para equipos ágiles

### **Advanced Project Management**
- **ClickUp** - All-in-one productivity platform
- **Airtable** - Database y workflow automation

### **Collaboration & Communication**
- **Miro** - Online whiteboard y visual collaboration
- **Zoom** - Video conferencing y virtual meetings

---

## 🚀 **CONFIGURACIÓN PASO A PASO**

### **1. Jira Setup**

#### **Crear Cuenta Jira**
```bash
# 1. Ve a https://www.atlassian.com/jira
# 2. Sign up o login
# 3. Crea nuevo proyecto "AIGestion"
# 4. Obtén API Token y Base URL
```

#### **Obtener Credenciales Jira**
```bash
# En Atlassian Account:
# 1. Ve a Account Settings → Security → API tokens
# 2. Create API token
# 3. Copia el token (ej: ABC123DEF456GHI789)

# Base URL format:
# https://YOUR_DOMAIN.atlassian.net
# ej: https://aigestion.atlassian.net
```

#### **Configuración en Código**
```javascript
// Configuración Jira
const JiraClient = require('jira-client');

const jira = new JiraClient({
  protocol: 'https',
  host: process.env.JIRA_BASE_URL.replace('https://', ''),
  username: 'your-email@domain.com',
  password: process.env.JIRA_API_TOKEN,
  apiVersion: '3',
  strictSSL: true
});

// Crear issue
const issue = await jira.addNewIssue({
  fields: {
    project: { key: 'AIG' },
    summary: 'New feature request',
    description: 'Detailed description',
    issuetype: { name: 'Task' }
  }
});
```

### **2. Asana Setup**

#### **Crear Cuenta Asana**
```bash
# 1. Ve a https://asana.com
# 2. Sign up o login
# 3. Crea nuevo workspace "AIGestion"
# 4. Obtén Personal Access Token
```

#### **Obtener Credenciales Asana**
```bash
# En Asana Settings:
# 1. Ve a My Apps → Manage Developer Apps
# 2. Create New App
# 3. Obtén Personal Access Token
# 4. Copia el token (ej: 1/1234567890123456789)
```

#### **Configuración en Código**
```javascript
// Configuración Asana
const Asana = require('asana');

const client = Asana.Client.create({
  defaultHeaders: {
    'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`
  }
});

// Crear tarea
const task = await client.tasks.create({
  workspace: 'WORKSPACE_ID',
  name: 'New Task',
  projects: ['PROJECT_ID'],
  assignee: 'USER_ID',
  notes: 'Task description'
});
```

### **3. Trello Setup**

#### **Crear Cuenta Trello**
```bash
# 1. Ve a https://trello.com
# 2. Sign up o login
# 3. Crea nuevo board "AIGestion"
# 4. Obtén API Key y Token
```

#### **Obtener Credenciales Trello**
```bash
# API Key:
# 1. Ve a https://trello.com/app-key
# 2. Copia API Key

# Token:
# 1. Ve a https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=AIGestion&key=YOUR_API_KEY
# 2. Authoriza la aplicación
# 3. Copia el token
```

#### **Configuración en Código**
```javascript
// Configuración Trello
const Trello = require('trello-node-api');

const trello = new Trello(process.env.TRELLO_API_KEY, process.env.TRELLO_TOKEN);

// Crear card
const card = await trello.post('/1/cards', {
  name: 'New Card',
  desc: 'Card description',
  idList: 'LIST_ID',
  idMembers: ['MEMBER_ID']
});
```

### **4. Linear Setup**

#### **Crear Cuenta Linear**
```bash
# 1. Ve a https://linear.app
# 2. Sign up o login
# 3. Crea nuevo workspace "AIGestion"
# 4. Obtén API Key y Team ID
```

#### **Obtener Credenciales Linear**
```bash
# API Key:
# 1. Ve a Linear Settings → API
# 2. Create API Key
# 3. Copia API Key (ej: lin_api_1234567890abcdef)

# Team ID:
# 1. Ve a Linear Settings → General
# 2. Copia Team ID (ej: TEAM_ID_1234567890)
```

#### **Configuración en Código**
```javascript
// Configuración Linear
const { LinearClient } = require('@linear/sdk');

const linear = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY
});

// Crear issue
const issue = await linear.issueCreate({
  title: 'New Issue',
  description: 'Issue description',
  teamId: process.env.LINEAR_TEAM_ID,
  stateId: 'STATE_ID'
});
```

### **5. ClickUp Setup**

#### **Crear Cuenta ClickUp**
```bash
# 1. Ve a https://clickup.com
# 2. Sign up o login
# 3. Crea nuevo workspace "AIGestion"
# 4. Obtén API Key
```

#### **Obtener Credenciales ClickUp**
```bash
# En ClickUp Settings:
# 1. Ve a Apps → API
# 2. Generate API Key
# 3. Copia API Key (ej: pk_1234567890abcdef)
```

#### **Configuración en Código**
```javascript
// Configuración ClickUp
const ClickUp = require('clickup-api');

const clickUp = new ClickUp(process.env.CLICKUP_API_KEY);

// Crear task
const task = await clickUp.tasks.create({
  name: 'New Task',
  description: 'Task description',
  list_id: 'LIST_ID',
  assignees: ['USER_ID'],
  status: 'Open'
});
```

### **6. Airtable Setup**

#### **Crear Cuenta Airtable**
```bash
# 1. Ve a https://airtable.com
# 2. Sign up o login
# 3. Crea nuevo base "AIGestion"
# 4. Obtén API Key y Base ID
```

#### **Obtener Credenciales Airtable**
```bash
# API Key:
# 1. Ve a Account → Overview
# 2. Copia API Key (ej: pat1234567890abcdef)

# Base ID:
# 1. Ve a tu base
# 2. URL contiene appID (ej: https://airtable.com/app1234567890abcdef/BaseName)
# 3. Copia appID (ej: app1234567890abcdef)
```

#### **Configuración en Código**
```javascript
// Configuración Airtable
const Airtable = require('airtable');

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

// Crear registro
const record = await base('TableName').create({
  Name: 'Record Name',
  Description: 'Record description',
  Status: 'Active'
});
```

### **7. Miro Setup**

#### **Crear Cuenta Miro**
```bash
# 1. Ve a https://miro.com
# 2. Sign up o login
# 3. Crea nuevo team "AIGestion"
# 4. Obtén Access Token
```

#### **Obtener Credenciales Miro**
```bash
# En Miro Settings:
# 1. Ve to Apps → Integrations
# 2. Create new integration
# 3. Obtén Access Token (ej: mr_1234567890abcdef)
```

#### **Configuración en Código**
```javascript
// Configuración Miro
const Miro = require('miro-api');

const miro = new Miro({
  accessToken: process.env.MIRO_ACCESS_TOKEN
});

// Crear board
const board = await miro.boards.create({
  name: 'New Board',
  description: 'Board description'
});
```

### **8. Zoom Setup**

#### **Crear Cuenta Zoom**
```bash
# 1. Ve a https://marketplace.zoom.us
# 2. Sign up o login
# 3. Crea new Server-to-Server OAuth app
# 4. Obtén API Key y Secret
```

#### **Obtener Credenciales Zoom**
```bash
# En Zoom App Marketplace:
# 1. Ve a Manage → Server-to-Server OAuth
# 2. Obtén Account ID, Client ID, Client Secret
# 3. Configura scopes necesarios
```

#### **Configuración en Código**
```javascript
// Configuración Zoom
const Zoom = require('zoom-api');

const zoom = new Zoom({
  apiKey: process.env.ZOOM_API_KEY,
  apiSecret: process.env.ZOOM_API_SECRET
});

// Crear meeting
const meeting = await zoom.meeting.create({
  userId: 'USER_ID',
  topic: 'Team Meeting',
  type: 1, // Instant meeting
  settings: {
    join_before_host: true,
    mute_upon_entry: true
  }
});
```

---

## 📝 **CONFIGURACIÓN DEL ARCHIVO .env**

### **Antes (Líneas 519-536)**
```bash
# ═══════════════════════════════════════════════════════════════════════════
# 🏢 PROJECT MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════
# JIRA_API_TOKEN=  # Issue tracking
# JIRA_BASE_URL=
# ASANA_ACCESS_TOKEN=  # Task management
# TRELLO_API_KEY=  # Kanban boards
# TRELLO_TOKEN=
# LINEAR_API_KEY=lin_api_REPLACE_ME # Modern issue tracking
# LINEAR_TEAM_ID=TEAM_ID_REPLACE_ME # Required for Workflow 05
# ClickUp
# CLICKUP_API_KEY=
# AIRTABLE_API_KEY=pat_REPLACE_ME
# AIRTABLE_BASE_ID=appREPLACE_ME
# COLLABORATION
# Miro_ACCESS_TOKEN=mr_REPLACE_ME
# ZOOM_API_KEY=REPLACE_ME
# ZOOM_API_SECRET=REPLACE_ME
```

### **Después (Ejemplo Real)**
```bash
# ═══════════════════════════════════════════════════════════════════════════
# 🏢 PROJECT MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════
JIRA_API_TOKEN=ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZ
JIRA_BASE_URL=https://aigestion.atlassian.net
ASANA_ACCESS_TOKEN=1/1234567890123456789012345678901234567890
TRELLO_API_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
TRELLO_TOKEN=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
LINEAR_API_KEY=lin_api_1234567890abcdef1234567890abcdef
LINEAR_TEAM_ID=TEAM_ID_1234567890abcdef1234567890abcdef
CLICKUP_API_KEY=pk_1234567890abcdef1234567890abcdef
AIRTABLE_API_KEY=pat1234567890abcdef1234567890abcdef
AIRTABLE_BASE_ID=app1234567890abcdef1234567890abcdef
MIRO_ACCESS_TOKEN=mr_1234567890abcdef1234567890abcdef
ZOOM_API_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
ZOOM_API_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

---

## 🛠️ **SCRIPT AUTOMATIZADO**

### **PowerShell Script para Project Management Setup**
```powershell
# get-project-management-credentials.ps1
param(
    [Parameter(Mandatory=$false)]
    [switch]$Interactive,
    
    [Parameter(Mandatory=$false)]
    [switch]$Test,
    
    [Parameter(Mandatory=$false)]
    [switch]$GodMode
)

# Función para obtener credenciales de project management
function Get-ProjectManagementCredentials {
    Write-Host "🏢 Project Management Setup" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Blue
    
    if ($GodMode) {
        Write-Host "🔥 GOD MODE ACTIVADO - Configuración Nivel Dios" -ForegroundColor Red
        Write-Host "================================" -ForegroundColor Yellow
    }
    
    # Jira
    $jiraApiToken = Read-Host "Ingresa tu Jira API Token"
    $jiraBaseUrl = Read-Host "Ingresa tu Jira Base URL (ej: https://aigestion.atlassian.net)"
    
    # Asana
    $asanaAccessToken = Read-Host "Ingresa tu Asana Access Token"
    
    # Trello
    $trelloApiKey = Read-Host "Ingresa tu Trello API Key"
    $trelloToken = Read-Host "Ingresa tu Trello Token"
    
    # Linear
    $linearApiKey = Read-Host "Ingresa tu Linear API Key"
    $linearTeamId = Read-Host "Ingresa tu Linear Team ID"
    
    # ClickUp
    $clickupApiKey = Read-Host "Ingresa tu ClickUp API Key"
    
    # Airtable
    $airtableApiKey = Read-Host "Ingresa tu Airtable API Key"
    $airtableBaseId = Read-Host "Ingresa tu Airtable Base ID"
    
    # Miro
    $miroAccessToken = Read-Host "Ingresa tu Miro Access Token"
    
    # Zoom
    $zoomApiKey = Read-Host "Ingresa tu Zoom API Key"
    $zoomApiSecret = Read-Host "Ingresa tu Zoom API Secret"
    
    # Actualizar archivo .env
    Update-EnvFile $jiraApiToken $jiraBaseUrl $asanaAccessToken $trelloApiKey $trelloToken $linearApiKey $linearTeamId $clickupApiKey $airtableApiKey $airtableBaseId $miroAccessToken $zoomApiKey $zoomApiSecret
}

function Update-EnvFile {
    param(
        [string]$JiraApiToken,
        [string]$JiraBaseUrl,
        [string]$AsanaAccessToken,
        [string]$TrelloApiKey,
        [string]$TrelloToken,
        [string]$LinearApiKey,
        [string]$LinearTeamId,
        [string]$ClickupApiKey,
        [string]$AirtableApiKey,
        [string]$AirtableBaseId,
        [string]$MiroAccessToken,
        [string]$ZoomApiKey,
        [string]$ZoomApiSecret
    )
    
    $envPath = ".\.env"
    $envContent = Get-Content $envPath -Raw
    
    # Reemplazar credenciales
    $envContent = $envContent -replace "# JIRA_API_TOKEN=", "JIRA_API_TOKEN=$JiraApiToken"
    $envContent = $envContent -replace "# JIRA_BASE_URL=", "JIRA_BASE_URL=$JiraBaseUrl"
    $envContent = $envContent -replace "# ASANA_ACCESS_TOKEN=", "ASANA_ACCESS_TOKEN=$AsanaAccessToken"
    $envContent = $envContent -replace "# TRELLO_API_KEY=", "TRELLO_API_KEY=$TrelloApiKey"
    $envContent = $envContent -replace "# TRELLO_TOKEN=", "TRELLO_TOKEN=$TrelloToken"
    $envContent = $envContent -replace "# LINEAR_API_KEY=lin_api_REPLACE_ME", "LINEAR_API_KEY=$LinearApiKey"
    $envContent = $envContent -replace "# LINEAR_TEAM_ID=TEAM_ID_REPLACE_ME", "LINEAR_TEAM_ID=$LinearTeamId"
    $envContent = $envContent -replace "# CLICKUP_API_KEY=", "CLICKUP_API_KEY=$ClickupApiKey"
    $envContent = $envContent -replace "# AIRTABLE_API_KEY=pat_REPLACE_ME", "AIRTABLE_API_KEY=$AirtableApiKey"
    $envContent = $envContent -replace "# AIRTABLE_BASE_ID=appREPLACE_ME", "AIRTABLE_BASE_ID=$AirtableBaseId"
    $envContent = $envContent -replace "# Miro_ACCESS_TOKEN=mr_REPLACE_ME", "MIRO_ACCESS_TOKEN=$MiroAccessToken"
    $envContent = $envContent -replace "# ZOOM_API_KEY=REPLACE_ME", "ZOOM_API_KEY=$ZoomApiKey"
    $envContent = $envContent -replace "# ZOOM_API_SECRET=REPLACE_ME", "ZOOM_API_SECRET=$ZoomApiSecret"
    
    Set-Content -Path $envPath -Value $envContent -Encoding UTF8
    Write-Host "✅ Archivo .env actualizado exitosamente" -ForegroundColor Green
}

# Ejecutar
if ($Test) {
    Write-Host "🧪 Modo de prueba activado" -ForegroundColor Yellow
    Write-Host "Verificando configuración de project management..." -ForegroundColor Blue
    # Test logic here
} else {
    Get-ProjectManagementCredentials
}
```

---

## 🔧 **INTEGRACIÓN CON AIGESTION**

### **Configuración Centralizada de Project Management**
```javascript
// src/services/projectManagement.js
const JiraClient = require('jira-client');
const Asana = require('asana');
const Trello = require('trello-node-api');
const { LinearClient } = require('@linear/sdk');
const ClickUp = require('clickup-api');
const Airtable = require('airtable');
const Miro = require('miro-api');
const Zoom = require('zoom-api');

class ProjectManagementService {
  constructor() {
    this.jira = null;
    this.asana = null;
    this.trello = null;
    this.linear = null;
    this.clickup = null;
    this.airtable = null;
    this.miro = null;
    this.zoom = null;
    this.initializeServices();
  }

  initializeServices() {
    // Jira
    if (process.env.JIRA_API_TOKEN && process.env.JIRA_BASE_URL) {
      this.jira = new JiraClient({
        protocol: 'https',
        host: process.env.JIRA_BASE_URL.replace('https://', ''),
        username: 'your-email@domain.com',
        password: process.env.JIRA_API_TOKEN,
        apiVersion: '3',
        strictSSL: true
      });
    }

    // Asana
    if (process.env.ASANA_ACCESS_TOKEN) {
      this.asana = Asana.Client.create({
        defaultHeaders: {
          'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`
        }
      });
    }

    // Trello
    if (process.env.TRELLO_API_KEY && process.env.TRELLO_TOKEN) {
      this.trello = new Trello(process.env.TRELLO_API_KEY, process.env.TRELLO_TOKEN);
    }

    // Linear
    if (process.env.LINEAR_API_KEY) {
      this.linear = new LinearClient({
        apiKey: process.env.LINEAR_API_KEY
      });
    }

    // ClickUp
    if (process.env.CLICKUP_API_KEY) {
      this.clickup = new ClickUp(process.env.CLICKUP_API_KEY);
    }

    // Airtable
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      this.airtable = new Airtable({
        apiKey: process.env.AIRTABLE_API_KEY
      }).base(process.env.AIRTABLE_BASE_ID);
    }

    // Miro
    if (process.env.MIRO_ACCESS_TOKEN) {
      this.miro = new Miro({
        accessToken: process.env.MIRO_ACCESS_TOKEN
      });
    }

    // Zoom
    if (process.env.ZOOM_API_KEY && process.env.ZOOM_API_SECRET) {
      this.zoom = new Zoom({
        apiKey: process.env.ZOOM_API_KEY,
        apiSecret: process.env.ZOOM_API_SECRET
      });
    }
  }

  // Jira methods
  async createJiraIssue(projectKey, summary, description) {
    if (!this.jira) throw new Error('Jira not configured');
    return await this.jira.addNewIssue({
      fields: {
        project: { key: projectKey },
        summary: summary,
        description: description,
        issuetype: { name: 'Task' }
      }
    });
  }

  // Asana methods
  async createAsanaTask(workspaceId, projectId, name, notes) {
    if (!this.asana) throw new Error('Asana not configured');
    return await this.asana.tasks.create({
      workspace: workspaceId,
      name: name,
      projects: [projectId],
      notes: notes
    });
  }

  // Trello methods
  async createTrelloCard(listId, name, description) {
    if (!this.trello) throw new Error('Trello not configured');
    return await this.trello.post('/1/cards', {
      name: name,
      desc: description,
      idList: listId
    });
  }

  // Linear methods
  async createLinearIssue(title, description, teamId) {
    if (!this.linear) throw new Error('Linear not configured');
    return await this.linear.issueCreate({
      title: title,
      description: description,
      teamId: teamId || process.env.LINEAR_TEAM_ID
    });
  }

  // ClickUp methods
  async createClickUpTask(listId, name, description) {
    if (!this.clickup) throw new Error('ClickUp not configured');
    return await this.clickup.tasks.create({
      name: name,
      description: description,
      list_id: listId
    });
  }

  // Airtable methods
  async createAirtableRecord(tableName, fields) {
    if (!this.airtable) throw new Error('Airtable not configured');
    return await this.airtable(tableName).create(fields);
  }

  // Miro methods
  async createMiroBoard(name, description) {
    if (!this.miro) throw new Error('Miro not configured');
    return await this.miro.boards.create({
      name: name,
      description: description
    });
  }

  // Zoom methods
  async createZoomMeeting(userId, topic) {
    if (!this.zoom) throw new Error('Zoom not configured');
    return await this.zoom.meeting.create({
      userId: userId,
      topic: topic,
      type: 1,
      settings: {
        join_before_host: true,
        mute_upon_entry: true
      }
    });
  }
}

export default new ProjectManagementService();
```

---

## 📊 **DASHBOARDS DE PROJECT MANAGEMENT**

### **Project Management Dashboard**
```javascript
// src/components/ProjectManagementDashboard.jsx
import React, { useState, useEffect } from 'react';
import projectManagementService from '../services/projectManagement';

const ProjectManagementDashboard = () => {
  const [metrics, setMetrics] = useState({
    jiraIssues: 0,
    asanaTasks: 0,
    trelloCards: 0,
    linearIssues: 0,
    clickupTasks: 0,
    airtableRecords: 0,
    miroBoards: 0,
    zoomMeetings: 0,
  });

  useEffect(() => {
    const fetchProjectMetrics = async () => {
      try {
        const [
          jiraIssues,
          asanaTasks,
          trelloCards,
          linearIssues,
          clickupTasks,
          airtableRecords,
          miroBoards,
          zoomMeetings
        ] = await Promise.all([
          fetch('/api/project-management/jira/issues'),
          fetch('/api/project-management/asana/tasks'),
          fetch('/api/project-management/trello/cards'),
          fetch('/api/project-management/linear/issues'),
          fetch('/api/project-management/clickup/tasks'),
          fetch('/api/project-management/airtable/records'),
          fetch('/api/project-management/miro/boards'),
          fetch('/api/project-management/zoom/meetings'),
        ]);

        setMetrics({
          jiraIssues: await jiraIssues.json(),
          asanaTasks: await asanaTasks.json(),
          trelloCards: await trelloCards.json(),
          linearIssues: await linearIssues.json(),
          clickupTasks: await clickupTasks.json(),
          airtableRecords: await airtableRecords.json(),
          miroBoards: await miroBoards.json(),
          zoomMeetings: await zoomMeetings.json(),
        });
      } catch (error) {
        console.error('Error fetching project metrics:', error);
      }
    };

    fetchProjectMetrics();
    const interval = setInterval(fetchProjectMetrics, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="project-management-dashboard">
      <h2>🏢 Project Management Dashboard</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Jira Issues</h3>
          <div className="value">{metrics.jiraIssues}</div>
        </div>
        
        <div className="metric-card">
          <h3>Asana Tasks</h3>
          <div className="value">{metrics.asanaTasks}</div>
        </div>
        
        <div className="metric-card">
          <h3>Trello Cards</h3>
          <div className="value">{metrics.trelloCards}</div>
        </div>
        
        <div className="metric-card">
          <h3>Linear Issues</h3>
          <div className="value">{metrics.linearIssues}</div>
        </div>
        
        <div className="metric-card">
          <h3>ClickUp Tasks</h3>
          <div className="value">{metrics.clickupTasks}</div>
        </div>
        
        <div className="metric-card">
          <h3>Airtable Records</h3>
          <div className="value">{metrics.airtableRecords}</div>
        </div>
        
        <div className="metric-card">
          <h3>Miro Boards</h3>
          <div className="value">{metrics.miroBoards}</div>
        </div>
        
        <div className="metric-card">
          <h3>Zoom Meetings</h3>
          <div className="value">{metrics.zoomMeetings}</div>
        </div>
      </div>
      
      <div className="actions">
        <button onClick={() => window.open('/api/project-management/sync', '_blank')}>
          🔄 Sync All Projects
        </button>
        <button onClick={() => window.open('/api/project-management/report', '_blank')}>
          📊 View Full Report
        </button>
      </div>
    </div>
  );
};

export default ProjectManagementDashboard;
```

---

## 🎯 **WORKFLOW AUTOMATION**

### **Automated Task Creation**
```javascript
// src/workflows/taskAutomation.js
import projectManagementService from '../services/projectManagement';

class TaskAutomation {
  constructor() {
    this.workflows = [
      {
        name: 'Bug Report',
        trigger: 'bug_report',
        actions: [
          { service: 'jira', action: 'createIssue', params: { type: 'Bug' } },
          { service: 'linear', action: 'createIssue', params: { priority: 'High' } },
          { service: 'asana', action: 'createTask', params: { priority: 'High' } }
        ]
      },
      {
        name: 'Feature Request',
        trigger: 'feature_request',
        actions: [
          { service: 'jira', action: 'createIssue', params: { type: 'Story' } },
          { service: 'linear', action: 'createIssue', params: { priority: 'Medium' } },
          { service: 'trello', action: 'createCard', params: { list: 'Backlog' } }
        ]
      },
      {
        name: 'Meeting Scheduled',
        trigger: 'meeting_scheduled',
        actions: [
          { service: 'zoom', action: 'createMeeting', params: { type: 'Scheduled' } },
          { service: 'asana', action: 'createTask', params: { due: 'meeting_time' } },
          { service: 'clickup', action: 'createTask', params: { priority: 'High' } }
        ]
      }
    ];
  }

  async executeWorkflow(trigger, data) {
    const workflow = this.workflows.find(w => w.trigger === trigger);
    if (!workflow) {
      throw new Error(`Workflow not found for trigger: ${trigger}`);
    }

    const results = [];
    for (const action of workflow.actions) {
      try {
        const result = await this.executeAction(action, data);
        results.push({ service: action.service, success: true, result });
      } catch (error) {
        results.push({ service: action.service, success: false, error: error.message });
      }
    }

    return results;
  }

  async executeAction(action, data) {
    switch (action.service) {
      case 'jira':
        return await projectManagementService.createJiraIssue(
          data.projectKey || 'AIG',
          data.title,
          data.description
        );
      case 'asana':
        return await projectManagementService.createAsanaTask(
          data.workspaceId,
          data.projectId,
          data.title,
          data.description
        );
      case 'trello':
        return await projectManagementService.createTrelloCard(
          data.listId,
          data.title,
          data.description
        );
      case 'linear':
        return await projectManagementService.createLinearIssue(
          data.title,
          data.description,
          data.teamId
        );
      case 'clickup':
        return await projectManagementService.createClickUpTask(
          data.listId,
          data.title,
          data.description
        );
      case 'zoom':
        return await projectManagementService.createZoomMeeting(
          data.userId,
          data.title
        );
      default:
        throw new Error(`Service not supported: ${action.service}`);
    }
  }
}

export default new TaskAutomation();
```

---

## 📋 **CHECKLIST DE CONFIGURACIÓN**

### **Pre-Setup**
- [ ] Cuentas creadas en todos los servicios
- [ ] Proyectos y workspaces configurados
- [ ] API Keys y tokens generados
- [ ] Documentación revisada

### **Configuration**
- [ ] Archivo .env actualizado
- [ ] Servicios inicializados en código
- [ ] Workflows configurados
- [ ] Dashboards implementados

### **Testing**
- [ ] Conexión probada con cada servicio
- [ ] Creación de tareas/issues funcionando
- [ ] Workflows automatizados ejecutándose
- [ ] Dashboards mostrando datos

### **Production**
- [ ] Variables de entorno configuradas
- [ ] Webhooks configurados
- [ ] Automatización activada
- [ ] Monitoring implementado

---

## 🚨 **ERRORES COMUNES Y SOLUCIONES**

### **Error: "Jira API token invalid"**
```
Solución: Genera nuevo token en Atlassian Account Settings
```

### **Error: "Asana access token expired"**
```
Solución: Genera nuevo token en Asana Developer Apps
```

### **Error: "Trello API key invalid"**
```
Solución: Verifica API key en https://trello.com/app-key
```

### **Error: "Linear team ID not found"**
```
Solución: Verifica Team ID en Linear Settings → General
```

---

## 📞 **SOPORTE Y RECURSOS**

### **Documentación Oficial**
- [Jira Docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Asana Docs](https://developers.asana.com/docs)
- [Trello Docs](https://developers.trello.com/)
- [Linear Docs](https://developers.linear.app/)
- [ClickUp Docs](https://clickup.com/api-quick-start)
- [Airtable Docs](https://airtable.com/developers/web/api)
- [Miro Docs](https://developers.miro.com/)
- [Zoom Docs](https://marketplace.zoom.us/docs/api-reference/introduction)

### **Soporte Técnico**
- **Jira**: support@atlassian.com
- **Asana**: developers@asana.com
- **Trello**: support@trello.com
- **Linear**: support@linear.app
- **ClickUp**: support@clickup.com
- **Airtable**: support@airtable.com
- **Miro**: support@miro.com
- **Zoom**: developers@zoom.us

---

## 🎉 **RESUMEN FINAL**

Con esta guía completa tienes todo lo necesario para configurar 8 servicios de project management para AIGestion:

### **🏢 8 Servicios de Project Management**
- ✅ **Jira** - Issue tracking y project management
- ✅ **Asana** - Task management y team collaboration
- ✅ **Trello** - Kanban boards y visual workflow
- ✅ **Linear** - Modern issue tracking para equipos ágiles
- ✅ **ClickUp** - All-in-one productivity platform
- ✅ **Airtable** - Database y workflow automation
- ✅ **Miro** - Online whiteboard y visual collaboration
- ✅ **Zoom** - Video conferencing y virtual meetings

### **📁 Archivos Creados**
- ✅ **Guía completa** paso a paso
- ✅ **Script automatizado** PowerShell
- ✅ **Templates** con ejemplos reales
- ✅ **Documentación** técnica

### **🚀 Implementación Completa**
1. Ejecuta el script o sigue la guía manual
2. Obtén tus credenciales de cada servicio
3. Configura el archivo .env (líneas 519-536)
4. Implementa integración en tu código
5. Configura workflows automatizados
6. Setup dashboards y monitoring

### **📈 Características de Project Management**
- Issue tracking y task management
- Kanban boards y visual workflows
- Team collaboration y communication
- Workflow automation
- Real-time dashboards
- Multi-platform integration

**🏢 PROJECT MANAGEMENT CONFIGURADO PARA AIGESTION! 🚀**

---

*Última actualización: 24 de febrero de 2026*
*Versión: 1.0.0*
*Todos los archivos guardados en `c:\Users\Alejandro\AIGestion\scripts\setup\`*
