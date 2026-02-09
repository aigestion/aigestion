// 🚀 AIGestion Dev Tools - Background Service Worker
// Nivel Dios para desarrollo AIGestion

class AIGestionDevTools {
    constructor() {
        this.isAIGestionDomain = (url) => {
            return url.includes('aigestion.net') || url.includes('localhost');
        };
        
        this.init();
    }

    init() {
        console.log('🔥 AIGestion Dev Tools iniciado - Nivel Dios');
        
        // Escuchar eventos de navegación
        chrome.webNavigation.onCompleted.addListener(
            this.handleNavigation.bind(this),
            { url: [{ schemes: ['http', 'https'] }] }
        );

        // Escuchar mensajes del content script
        chrome.runtime.onMessage.addListener(
            this.handleMessage.bind(this)
        );

        // Configurar contexto de depuración
        this.setupDebugging();
    }

    handleNavigation(details) {
        if (!this.isAIGestionDomain(details.url)) return;

        console.log(`🌐 Navegación detectada: ${details.url}`);
        
        // Inyectar herramientas de desarrollo
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['injected.js']
        });

        // Configurar debugging para la pestaña
        this.setupTabDebugging(details.tabId);
    }

    handleMessage(request, sender, sendResponse) {
        switch (request.action) {
            case 'getSupabaseConfig':
                this.getSupabaseConfig(sendResponse);
                break;
            case 'enableGodMode':
                this.enableGodMode(sender.tab.id, sendResponse);
                break;
            case 'getPerformanceMetrics':
                this.getPerformanceMetrics(sender.tab.id, sendResponse);
                break;
            case 'debugComponent':
                this.debugComponent(request.componentId, sender.tab.id, sendResponse);
                break;
            case 'optimizePerformance':
                this.optimizePerformance(sender.tab.id, sendResponse);
                break;
            default:
                sendResponse({ error: 'Acción no reconocida' });
        }
        return true; // Mantener el canal abierto
    }

    setupDebugging() {
        // Configurar debugging automático para dominios AIGestion
        chrome.debugger.onEvent.addListener((source, method, params) => {
            console.log(`🐛 Debug event: ${method}`, params);
        });
    }

    setupTabDebugging(tabId) {
        // Adjuntar debugger a la pestaña
        chrome.debugger.attach({ tabId }, '1.3', () => {
            if (chrome.runtime.lastError) {
                console.error('Error adjuntando debugger:', chrome.runtime.lastError);
                return;
            }

            // Habilitar dominios de debugging
            chrome.debugger.sendCommand({ tabId }, 'Runtime.enable');
            chrome.debugger.sendCommand({ tabId }, 'Network.enable');
            chrome.debugger.sendCommand({ tabId }, 'Page.enable');
            chrome.debugger.sendCommand({ tabId }, 'DOM.enable');
            chrome.debugger.sendCommand({ tabId }, 'CSS.enable');
            chrome.debugger.sendCommand({ tabId }, 'Profiler.enable');

            console.log(`🔍 Debugging activado para pestaña ${tabId}`);
        });
    }

    getSupabaseConfig(sendResponse) {
        chrome.storage.local.get(['supabase_url', 'supabase_anon_key'], (result) => {
            sendResponse({
                supabase_url: result.supabase_url || 'https://your-project.supabase.co',
                supabase_anon_key: result.supabase_anon_key || 'your-anon-key'
            });
        });
    }

    enableGodMode(tabId, sendResponse) {
        // Inyectar script de God Mode
        chrome.scripting.executeScript({
            target: { tabId },
            func: this.injectGodMode
        }, (result) => {
            sendResponse({ success: true, result: result[0]?.result });
        });
    }

    injectGodMode() {
        // God Mode para AIGestion
        window.AIGestionGodMode = {
            enabled: true,
            debug: true,
            performance: true,
            admin: true,
            
            // Funciones de debugging
            log: function(...args) {
                console.log('🔥 AIGestion God Mode:', ...args);
            },
            
            // Optimización de rendimiento
            optimize: function() {
                // Optimizar React
                if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = function() {};
                }
                
                // Optimizar Three.js
                if (window.THREE) {
                    window.THREE.Cache.enabled = true;
                }
                
                // Optimizar animaciones
                document.querySelectorAll('*').forEach(el => {
                    el.style.willChange = 'auto';
                });
                
                return 'Optimización completada';
            },
            
            // Acceso admin
            adminAccess: function() {
                // Simular acceso admin
                localStorage.setItem('aigestion_admin', 'true');
                sessionStorage.setItem('aigestion_god_mode', 'true');
                
                // Mostrar panel admin
                const adminPanel = document.createElement('div');
                adminPanel.id = 'aigestion-admin-panel';
                adminPanel.style.cssText = `
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px;
                    border-radius: 10px;
                    z-index: 999999;
                    font-family: monospace;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                `;
                adminPanel.innerHTML = `
                    <h3>🏆 AIGestion God Mode</h3>
                    <p>Admin: ${localStorage.getItem('aigestion_admin')}</p>
                    <p>Debug: ${window.AIGestionGodMode.debug}</p>
                    <button onclick="this.parentElement.remove()">×</button>
                `;
                document.body.appendChild(adminPanel);
                
                return 'Modo admin activado';
            }
        };
        
        return 'God Mode activado';
    }

    getPerformanceMetrics(tabId, sendResponse) {
        chrome.debugger.sendCommand({ tabId }, 'Performance.getMetrics', {}, (result) => {
            sendResponse(result);
        });
    }

    debugComponent(componentId, tabId, sendResponse) {
        chrome.scripting.executeScript({
            target: { tabId },
            func: (id) => {
                // Buscar componente React
                const component = document.querySelector(`[data-reactid*="${id}"], [data-testid="${id}"]`);
                if (component) {
                    // Resaltar componente
                    component.style.border = '3px solid red';
                    component.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                    
                    // Obtener información del componente
                    const rect = component.getBoundingClientRect();
                    return {
                        found: true,
                        element: component.tagName,
                        className: component.className,
                        position: {
                            x: rect.left,
                            y: rect.top,
                            width: rect.width,
                            height: rect.height
                        }
                    };
                }
                return { found: false };
            },
            args: [componentId]
        }, (result) => {
            sendResponse(result[0]?.result);
        });
    }

    optimizePerformance(tabId, sendResponse) {
        chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
                // Optimizar imágenes
                document.querySelectorAll('img').forEach(img => {
                    img.loading = 'lazy';
                    img.decoding = 'async';
                });
                
                // Optimizar CSS
                const style = document.createElement('style');
                style.textContent = `
                    * { 
                        transform: translateZ(0); 
                        backface-visibility: hidden;
                        perspective: 1000px;
                    }
                `;
                document.head.appendChild(style);
                
                // Optimizar JavaScript
                if (window.requestIdleCallback) {
                    window.requestIdleCallback(() => {
                        console.log('🚀 Optimización en background completada');
                    });
                }
                
                return 'Optimización de rendimiento aplicada';
            }
        }, (result) => {
            sendResponse({ success: true, result: result[0]?.result });
        });
    }
}

// Inicializar AIGestion Dev Tools
new AIGestionDevTools();
