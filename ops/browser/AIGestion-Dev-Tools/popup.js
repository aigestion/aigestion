// 🚀 AIGestion Dev Tools - Popup Script
// Nivel Dios para desarrollo AIGestion

class AIGestionPopup {
  constructor() {
    this.currentTab = null;
    this.init();
  }

  async init() {
    console.log('🔥 AIGestion Popup iniciado');

    // Obtener pestaña actual
    await this.getCurrentTab();

    // Configurar event listeners
    this.setupEventListeners();

    // Actualizar estado inicial
    this.updateStatus();

    // Cargar configuración guardada
    this.loadSavedConfig();
  }

  async getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tab;
    return tab;
  }

  setupEventListeners() {
    // God Mode buttons
    document.getElementById('enableGodMode').addEventListener('click', () => {
      this.enableGodMode();
    });

    document.getElementById('adminAccess').addEventListener('click', () => {
      this.enableAdminAccess();
    });

    // Performance buttons
    document.getElementById('optimizePerformance').addEventListener('click', () => {
      this.optimizePerformance();
    });

    document.getElementById('getMetrics').addEventListener('click', () => {
      this.getPerformanceMetrics();
    });

    // Debug buttons
    document.getElementById('debugReact').addEventListener('click', () => {
      this.debugReact();
    });

    document.getElementById('debugThree').addEventListener('click', () => {
      this.debugThreeJS();
    });

    // Supabase config
    document.getElementById('saveSupabaseConfig').addEventListener('click', () => {
      this.saveSupabaseConfig();
    });

    // Auto-update metrics
    setInterval(() => {
      this.updateMetrics();
    }, 2000);
  }

  async enableGodMode() {
    try {
      const response = await this.sendMessage({ action: 'enableGodMode' });

      if (response.success) {
        this.showNotification('God Mode activado', 'success');
        document.getElementById('godModeStatus').textContent = 'Activo';
        document.getElementById('godModeStatus').className = 'status-value active';
      } else {
        this.showNotification('Error activando God Mode', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      this.showNotification('Error de comunicación', 'error');
    }
  }

  async enableAdminAccess() {
    try {
      const response = await this.sendMessage({ action: 'enableGodMode' });

      if (response.success) {
        this.showNotification('Acceso admin concedido', 'success');
      } else {
        this.showNotification('Error activando acceso admin', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      this.showNotification('Error de comunicación', 'error');
    }
  }

  async optimizePerformance() {
    try {
      const response = await this.sendMessage({ action: 'optimizePerformance' });

      if (response.success) {
        this.showNotification('Optimización aplicada', 'success');
        this.updateMetrics();
      } else {
        this.showNotification('Error en optimización', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      this.showNotification('Error de comunicación', 'error');
    }
  }

  async getPerformanceMetrics() {
    try {
      const response = await this.sendMessage({ action: 'getPerformanceMetrics' });

      if (response && response.metrics) {
        this.displayMetrics(response.metrics);
        document.getElementById('metricsDisplay').style.display = 'block';
      } else {
        this.showNotification('No se pudieron obtener métricas', 'warning');
      }
    } catch (error) {
      console.error('Error:', error);
      this.showNotification('Error obteniendo métricas', 'error');
    }
  }

  async debugReact() {
    try {
      // Inyectar React DevTools si no está presente
      await chrome.scripting.executeScript({
        target: { tabId: this.currentTab.id },
        files: ['https://unpkg.com/react-devtools@4.28.4/dist/react-devtools.js'],
      });

      this.showNotification('React DevTools inyectado', 'success');
    } catch (error) {
      console.error('Error:', error);
      this.showNotification('Error inyectando React DevTools', 'error');
    }
  }

  async debugThreeJS() {
    try {
      // Inyectar Three.js Inspector
      await chrome.scripting.executeScript({
        target: { tabId: this.currentTab.id },
        func: () => {
          if (globalThis.THREE) {
            globalThis.THREEInspector = {
              inspect: () => {
                console.log('🎮 Three.js Inspector activado');
                globalThis.THREE.Cache.enabled = true;

                // Mostrar estadísticas de Three.js
                const stats = new globalThis.THREE.Stats();
                stats.showPanel(0);
                document.body.appendChild(stats.dom);

                // Animación de stats
                function animate() {
                  stats.update();
                  requestAnimationFrame(animate);
                }
                animate();

                return 'Three.js Inspector activado';
              },
            };

            return globalThis.THREEInspector.inspect();
          }
          return 'Three.js no detectado';
        },
      });

      this.showNotification('Three.js Inspector activado', 'success');
    } catch (error) {
      console.error('Error:', error);
      this.showNotification('Error activando Three.js Inspector', 'error');
    }
  }

  async saveSupabaseConfig() {
    const url = document.getElementById('supabaseUrl').value;
    const key = document.getElementById('supabaseKey').value;

    if (!url || !key) {
      this.showNotification('Completa todos los campos', 'warning');
      return;
    }

    try {
      await chrome.storage.local.set({
        supabase_url: url,
        supabase_anon_key: key,
      });

      this.showNotification('Configuración guardada', 'success');
      document.getElementById('supabaseStatus').textContent = 'Configurado';
      document.getElementById('supabaseStatus').className = 'status-value active';
    } catch (error) {
      console.error('Error:', error);
      this.showNotification('Error guardando configuración', 'error');
    }
  }

  async loadSavedConfig() {
    try {
      const result = await chrome.storage.local.get(['supabase_url', 'supabase_anon_key']);

      if (result.supabase_url) {
        document.getElementById('supabaseUrl').value = result.supabase_url;
      }

      if (result.supabase_anon_key) {
        document.getElementById('supabaseKey').value = result.supabase_anon_key;
      }

      if (result.supabase_url && result.supabase_anon_key) {
        document.getElementById('supabaseStatus').textContent = 'Configurado';
        document.getElementById('supabaseStatus').className = 'status-value active';
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  }

  async updateStatus() {
    if (!this.currentTab) return;

    // Actualizar estado del dominio
    const isAIGestion =
      this.currentTab.url.includes('aigestion.net') || this.currentTab.url.includes('localhost');

    const domainStatus = document.getElementById('domainStatus');
    if (isAIGestion) {
      domainStatus.textContent = 'AIGestion detectado';
      domainStatus.className = 'status-value active';
    } else {
      domainStatus.textContent = 'No es AIGestion';
      domainStatus.className = 'status-value inactive';
    }

    // Verificar God Mode
    try {
      const response = await this.sendMessage({ action: 'checkGodMode' });
      const godModeStatus = document.getElementById('godModeStatus');

      if (response && response.enabled) {
        godModeStatus.textContent = 'Activo';
        godModeStatus.className = 'status-value active';
      } else {
        godModeStatus.textContent = 'Inactivo';
        godModeStatus.className = 'status-value inactive';
      }
    } catch (error) {
      document.getElementById('godModeStatus').textContent = 'Desconocido';
      document.getElementById('godModeStatus').className = 'status-value pending';
    }
  }

  async updateMetrics() {
    try {
      const metrics = await this.getTabMetrics();

      if (metrics) {
        document.getElementById('fpsValue').textContent = `${metrics.fps || 60}`;
        document.getElementById('memoryValue').textContent = `${metrics.memory || 0}MB`;
        document.getElementById('timeValue').textContent = `${metrics.loadTime || 0}ms`;
      }
    } catch (error) {
      console.error('Error actualizando métricas:', error);
    }
  }

  async getTabMetrics() {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: this.currentTab.id },
        func: () => {
          // Calcular FPS
          let fps = 60;
          let lastTime = performance.now();
          let frames = 0;

          function calculateFPS() {
            frames++;
            const currentTime = performance.now();
            if (currentTime >= lastTime + 1000) {
              fps = Math.round((frames * 1000) / (currentTime - lastTime));
              frames = 0;
              lastTime = currentTime;
            }
            requestAnimationFrame(calculateFPS);
          }

          // Obtener memoria si está disponible
          let memory = 0;
          if (performance.memory) {
            memory = Math.round(performance.memory.usedJSHeapSize / 1048576);
          }

          // Tiempo de carga
          const loadTime = Math.round(
            performance.timing.loadEventEnd - performance.timing.navigationStart
          );

          return { fps, memory, loadTime };
        },
      });

      return results[0]?.result;
    } catch (error) {
      console.error('Error obteniendo métricas:', error);
      return null;
    }
  }

  displayMetrics(metrics) {
    const metricsDisplay = document.getElementById('metricsDisplay');

    if (metrics.fps) {
      document.getElementById('fpsValue').textContent = metrics.fps;
    }

    if (metrics.memory) {
      document.getElementById('memoryValue').textContent =
        `${Math.round(metrics.memory / 1048576)}MB`;
    }

    if (metrics.loadTime) {
      document.getElementById('timeValue').textContent = `${metrics.loadTime}ms`;
    }
  }

  async sendMessage(action) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(action, response => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px 15px;
            border-radius: 8px;
            color: white;
            font-size: 13px;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

    // Colores según tipo
    const colors = {
      success: 'linear-gradient(135deg, #4caf50, #45a049)',
      error: 'linear-gradient(135deg, #f44336, #da190b)',
      warning: 'linear-gradient(135deg, #ff9800, #f57c00)',
      info: 'linear-gradient(135deg, #2196f3, #1976d2)',
    };

    notification.style.background = colors[type] || colors.info;

    document.body.appendChild(notification);

    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Inicializar popup cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new AIGestionPopup();
});

// Agregar animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
