# Create Mobile Apps - Enterprise and Client
# Creates Android APKs for Pixel 8 Pro and client devices

Write-Host "📱 Creating Mobile Apps - Enterprise & Client" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Gray

# Create directories
$mobileDirs = @(
    "c:\Users\Alejandro\AIGestion\mobile\enterprise-app\src",
    "c:\Users\Alejandro\AIGestion\mobile\client-app\src",
    "c:\Users\Alejandro\AIGestion\mobile\enterprise-app\android\app\src\main",
    "c:\Users\Alejandro\AIGestion\mobile\client-app\android\app\src\main"
)

foreach ($dir in $mobileDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Created directory: $dir" -ForegroundColor Green
    }
}

# Create Enterprise App (Pixel 8 Pro)
Write-Host "🏢 Creating Enterprise App for Pixel 8 Pro..." -ForegroundColor Green
$enterpriseApp = @"
import React, { useState, useEffect } from 'react';
import { Brain, Shield, Server, Database, Cloud, Lock, Eye, Settings, Bell, User, Home, BarChart3, FileText, Users, AlertTriangle, CheckCircle, Wifi, Battery, Cpu, HardDrive } from 'lucide-react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';

export default function EnterpriseApp() {
  const [systemStats, setSystemStats] = useState({
    cpu: 45,
    memory: 65,
    storage: 78,
    battery: 85,
    network: '5G',
    temperature: 'Normal'
  });

  const [services, setServices] = useState([
    { name: 'AI Engine', status: 'online', icon: Brain },
    { name: 'Database', status: 'online', icon: Database },
    { name: 'Cloud Sync', status: 'online', icon: Cloud },
    { name: 'Security', status: 'active', icon: Shield }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'High CPU usage detected', time: '2 min ago' },
    { id: 2, type: 'success', message: 'Backup completed', time: '15 min ago' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 30 + 40),
        memory: Math.floor(Math.random() * 20 + 60),
        battery: Math.max(20, prev.battery - 1)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'active': return '#3b82f6';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return '#f59e0b';
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>AIGestion Enterprise</Text>
          <Text style={styles.subtitle}>Pixel 8 Pro - Control Total</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Settings size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* System Status */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado del Sistema</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Cpu size={32} color="#3b82f6" />
              <Text style={styles.statValue}>{systemStats.cpu}%</Text>
              <Text style={styles.statLabel}>CPU</Text>
            </View>
            <View style={styles.statCard}>
              <Brain size={32} color="#8b5cf6" />
              <Text style={styles.statValue}>{systemStats.memory}%</Text>
              <Text style={styles.statLabel}>Memoria</Text>
            </View>
            <View style={styles.statCard}>
              <HardDrive size={32} color="#10b981" />
              <Text style={styles.statValue}>{systemStats.storage}%</Text>
              <Text style={styles.statLabel}>Storage</Text>
            </View>
            <View style={styles.statCard}>
              <Battery size={32} color="#f59e0b" />
              <Text style={styles.statValue}>{systemStats.battery}%</Text>
              <Text style={styles.statLabel}>Batería</Text>
            </View>
          </View>
        </View>

        {/* Services Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios</Text>
          <View style={styles.servicesList}>
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <View key={index} style={styles.serviceItem}>
                  <View style={styles.serviceIcon}>
                    <Icon size={24} color="#fff" />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={[styles.serviceStatus, { color: getStatusColor(service.status) }]}>
                      {service.status}
                    </Text>
                  </View>
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(service.status) }]} />
                </View>
              );
            })}
          </View>
        </View>

        {/* Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas</Text>
          <View style={styles.alertsList}>
            {alerts.map((alert) => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={[styles.alertIndicator, { backgroundColor: getAlertColor(alert.type) }]} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Shield size={24} color="#fff" />
              <Text style={styles.actionText}>Seguridad</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Database size={24} color="#fff" />
              <Text style={styles.actionText}>Backup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Cloud size={24} color="#fff" />
              <Text style={styles.actionText}>Sync</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Eye size={24} color="#fff" />
              <Text style={styles.actionText}>Monitor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={24} color="#3b82f6" />
          <Text style={[styles.navText, { color: '#3b82f6' }]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <BarChart3 size={24} color="#6b7280" />
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FileText size={24} color="#6b7280" />
          <Text style={styles.navText}>Reportes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <User size={24} color="#6b7280" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0a27',
  },
  header: {
    backgroundColor: '#1e1b4b',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#a78bfa',
  },
  headerIcons: {
    flexDirection: 'row',
    spaceBetween: 15,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a78bfa',
  },
  servicesList: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  serviceStatus: {
    fontSize: 14,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  alertsList: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  alertIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#a78bfa',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1e1b4b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#6b7280',
  },
});
"@

$enterpriseApp | Out-File -FilePath "c:\Users\Alejandro\AIGestion\mobile\enterprise-app\src\App.tsx" -Encoding UTF8
Write-Host "✅ Enterprise App created" -ForegroundColor Green

# Create Client App
Write-Host "👥 Creating Client App..." -ForegroundColor Green
$clientApp = @"
import React, { useState } from 'react';
import { Home, Briefcase, FileText, MessageSquare, Calendar, Users, Star, TrendingUp, Bell, Settings, Search, Filter, Download, Upload, Share2, Heart, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';

export default function ClientApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [projects, setProjects] = useState([
    { id: 1, name: 'Proyecto Alpha', status: 'active', progress: 75, deadline: '2024-02-15', budget: '\$50,000', image: 'https://via.placeholder.com/150x100/3b82f6/ffffff?text=Alpha' },
    { id: 2, name: 'Proyecto Beta', status: 'review', progress: 90, deadline: '2024-02-01', budget: '\$30,000', image: 'https://via.placeholder.com/150x100/10b981/ffffff?text=Beta' },
    { id: 3, name: 'Proyecto Gamma', status: 'planning', progress: 25, deadline: '2024-03-01', budget: '\$75,000', image: 'https://via.placeholder.com/150x100/8b5cf6/ffffff?text=Gamma' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'Nuevo archivo disponible', time: '10 min ago' },
    { id: 2, type: 'success', message: 'Proyecto completado', time: '1 hour ago' }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'review': return '#f59e0b';
      case 'planning': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'review': return 'Revisión';
      case 'planning': return 'Planificación';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>AIGestion Client</Text>
          <Text style={styles.subtitle}>Portal de Proyectos</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
          <Text style={styles.welcomeSubtitle}>Tienes {projects.length} proyectos activos</Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Nuevo Proyecto</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen Rápido</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Briefcase size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{projects.length}</Text>
              <Text style={styles.statLabel}>Proyectos</Text>
            </View>
            <View style={styles.statCard}>
              <CheckCircle size={24} color="#10b981" />
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Completados</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={24} color="#f59e0b" />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </View>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#8b5cf6" />
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Rendimiento</Text>
            </View>
          </View>
        </View>

        {/* Projects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Proyectos</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.projectsList}>
            {projects.map((project) => (
              <View key={project.id} style={styles.projectCard}>
                <Image source={{ uri: project.image }} style={styles.projectImage} />
                <View style={styles.projectContent}>
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(project.status)}</Text>
                    </View>
                  </View>
                  <View style={styles.projectDetails}>
                    <Text style={styles.projectDetail}>Progreso: {project.progress}%</Text>
                    <Text style={styles.projectDetail}>Deadline: {project.deadline}</Text>
                    <Text style={styles.projectDetail}>Presupuesto: {project.budget}</Text>
                  </View>
                  <View style={styles.projectActions}>
                    <TouchableOpacity style={styles.actionButtonSmall}>
                      <Eye size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButtonSmall}>
                      <Share2 size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButtonSmall}>
                      <Download size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <View style={styles.notificationsList}>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.notificationItem}>
                <View style={styles.notificationIcon}>
                  {notification.type === 'info' ? <AlertCircle size={20} color="#3b82f6" /> : <CheckCircle size={20} color="#10b981" />}
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={24} color="#3b82f6" />
          <Text style={[styles.navText, { color: '#3b82f6' }]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Briefcase size={24} color="#6b7280" />
          <Text style={styles.navText}>Proyectos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MessageSquare size={24} color="#6b7280" />
          <Text style={styles.navText}>Mensajes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Calendar size={24} color="#6b7280" />
          <Text style={styles.navText}>Calendario</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#1e40af',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#93c5fd',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#93c5fd',
    marginBottom: 16,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#93c5fd',
  },
  projectsList: {
    gap: 16,
  },
  projectCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: 150,
  },
  projectContent: {
    padding: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  projectDetails: {
    marginBottom: 12,
  },
  projectDetail: {
    fontSize: 14,
    color: '#93c5fd',
    marginBottom: 4,
  },
  projectActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButtonSmall: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  notificationsList: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#93c5fd',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1e40af',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#6b7280',
  },
});
"@

$clientApp | Out-File -FilePath "c:\Users\Alejandro\AIGestion\mobile\client-app\src\App.tsx" -Encoding UTF8
Write-Host "✅ Client App created" -ForegroundColor Green

# Create Android manifests
Write-Host "🤖 Creating Android manifests..." -ForegroundColor Green

# Enterprise App Manifest
$enterpriseManifest = @"<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.aigestion.enterprise">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.BATTERY_STATS" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".MonitorService"
            android:enabled="true"
            android:exported="false" />

    </application>

</manifest>
"@

$enterpriseManifest | Out-File -FilePath "c:\Users\Alejandro\AIGestion\mobile\enterprise-app\android\app\src\main\AndroidManifest.xml" -Encoding UTF8

# Client App Manifest
$clientManifest = @"<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.aigestion.client">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
"@

$clientManifest | Out-File -FilePath "c:\Users\Alejandro\AIGestion\mobile\client-app\android\app\src\main\AndroidManifest.xml" -Encoding UTF8

Write-Host "✅ Android manifests created" -ForegroundColor Green

Write-Host "📱 Mobile Apps Created Successfully!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Gray
