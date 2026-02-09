# Create Complete Frontend System - Fixed Version
# Creates all dashboards and mobile apps with proper structure

Write-Host "🚀 Creating Complete Frontend System" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Gray

# Create directories
$directories = @(
    "c:\Users\Alejandro\AIGestion\frontend\admin-dashboard\src",
    "c:\Users\Alejandro\AIGestion\frontend\client-dashboard\src",
    "c:\Users\Alejandro\AIGestion\frontend\demo-dashboard\src",
    "c:\Users\Alejandro\AIGestion\mobile\enterprise-app\src",
    "c:\Users\Alejandro\AIGestion\mobile\client-app\src"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Created directory: $dir" -ForegroundColor Green
    }
}

# Create package.json files for each dashboard
$packageJson = '{
  "name": "aigestion-dashboard",
  "version": "1.0.0",
  "description": "AIGestion Dashboard",
  "main": "index.js",
  "scripts": {
    "start": "react-native start",
    "android": "react-native run-android",
    "ios": "react-native run-ios"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0",
    "lucide-react": "^0.263.1"
  }
}'

# Admin Dashboard package.json
$packageJson | Out-File -FilePath "c:\Users\Alejandro\AIGestion\frontend\admin-dashboard\package.json" -Encoding UTF8

# Client Dashboard package.json  
$packageJson | Out-File -FilePath "c:\Users\Alejandro\AIGestion\frontend\client-dashboard\package.json" -Encoding UTF8

# Demo Dashboard package.json
$packageJson | Out-File -FilePath "c:\Users\Alejandro\AIGestion\frontend\demo-dashboard\package.json" -Encoding UTF8

# Mobile apps package.json
$packageJson | Out-File -FilePath "c:\Users\Alejandro\AIGestion\mobile\enterprise-app\package.json" -Encoding UTF8
$packageJson | Out-File -FilePath "c:\Users\Alejandro\AIGestion\mobile\client-app\package.json" -Encoding UTF8

Write-Host "✅ Package.json files created" -ForegroundColor Green

# Create simple HTML versions for web dashboards
$adminHtml = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIGestion Admin Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    </style>
</head>
<body class="min-h-screen text-white">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold text-center mb-8">🏆 Panel Administrativo</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Usuarios</h2>
                <p className="text-3xl font-bold">1,234</p>
                <p className="text-sm opacity-75">Activos</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Sistema</h2>
                <p className="text-3xl font-bold text-green-400">Online</p>
                <p className="text-sm opacity-75">99.9% uptime</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Memoria</h2>
                <p className="text-3xl font-bold text-yellow-400">65%</p>
                <p className="text-sm opacity-75">Optimizado</p>
            </div>
        </div>
    </div>
</body>
</html>
"@

$clientHtml = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIGestion Client Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    </style>
</head>
<body class="min-h-screen text-white">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold text-center mb-8">🎯 Panel de Cliente</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Proyectos</h2>
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm opacity-75">Activos</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Tareas</h2>
                <p className="text-3xl font-bold text-yellow-400">12</p>
                <p className="text-sm opacity-75">Pendientes</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Rendimiento</h2>
                <p className="text-3xl font-bold text-green-400">98%</p>
                <p className="text-sm opacity-75">Excelente</p>
            </div>
        </div>
    </div>
</body>
</html>
"@

$demoHtml = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIGestion Demo Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    </style>
</head>
<body class="min-h-screen text-white">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold text-center mb-8">🎮 Experience Demo</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Demos</h2>
                <p className="text-3xl font-bold">24</p>
                <p className="text-sm opacity-75">Interactivas</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Vistas</h2>
                <p className="text-3xl font-bold">125K</p>
                <p className="text-sm opacity-75">Totales</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Rating</h2>
                <p className="text-3xl font-bold text-yellow-400">4.8⭐</p>
                <p className="text-sm opacity-75">Promedio</p>
            </div>
        </div>
    </div>
</body>
</html>
"@

# Save HTML files
$adminHtml | Out-File -FilePath "c:\Users\Alejandro\AIGestion\frontend\admin-dashboard\index.html" -Encoding UTF8
$clientHtml | Out-File -FilePath "c:\Users\Alejandro\AIGestion\frontend\client-dashboard\index.html" -Encoding UTF8
$demoHtml | Out-File -FilePath "c:\Users\Alejandro\AIGestion\frontend\demo-dashboard\index.html" -Encoding UTF8

Write-Host "✅ HTML dashboards created" -ForegroundColor Green

# Create mobile app HTML versions
$enterpriseMobileHtml = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIGestion Enterprise Mobile</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%); }
        .mobile-frame { max-width: 375px; margin: 0 auto; }
    </style>
</head>
<body class="min-h-screen text-white">
    <div class="mobile-frame">
        <div class="bg-blue-900 p-4">
            <h1 class="text-xl font-bold">🏢 Enterprise</h1>
            <p class="text-sm opacity-75">Pixel 8 Pro Control</p>
        </div>
        <div class="p-4">
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-white/10 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold">45%</div>
                    <div class="text-xs">CPU</div>
                </div>
                <div class="bg-white/10 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold">65%</div>
                    <div class="text-xs">Memory</div>
                </div>
                <div class="bg-white/10 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold">78%</div>
                    <div class="text-xs">Storage</div>
                </div>
                <div class="bg-white/10 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold">85%</div>
                    <div class="text-xs">Battery</div>
                </div>
            </div>
            <div class="bg-white/10 p-4 rounded-lg">
                <h2 className="font-bold mb-2">Services</h2>
                <div class="space-y-2">
                    <div className="flex justify-between items-center">
                        <span>AI Engine</span>
                        <span className="text-green-400">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Database</span>
                        <span className="text-green-400">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Security</span>
                        <span className="text-blue-400">Active</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
"@

$clientMobileHtml = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIGestion Client Mobile</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%); }
        .mobile-frame { max-width: 375px; margin: 0 auto; }
    </style>
</head>
<body class="min-h-screen text-white">
    <div class="mobile-frame">
        <div class="bg-blue-900 p-4">
            <h1 className="text-xl font-bold">👥 Client Portal</h1>
            <p className="text-sm opacity-75">Project Management</p>
        </div>
        <div class="p-4">
            <div className="bg-white/10 p-4 rounded-lg mb-4">
                <h2 className="font-bold mb-2">Welcome!</h2>
                <p className="text-sm mb-4">You have 3 active projects</p>
                <button className="bg-blue-600 px-4 py-2 rounded text-sm w-full">New Project</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/10 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs">Projects</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs">Tasks</div>
                </div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
                <h2 className="font-bold mb-2">Recent Projects</h2>
                <div className="space-y-2">
                    <div className="bg-white/5 p-2 rounded">
                        <div className="font-medium">Project Alpha</div>
                        <div className="text-xs opacity-75">75% Complete</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded">
                        <div className="font-medium">Project Beta</div>
                        <div className="text-xs opacity-75">90% Complete</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
"@

# Save mobile HTML files
$enterpriseMobileHtml | Out-File -FilePath "c:\Users\Alejandro\AIGestion\mobile\enterprise-app\index.html" -Encoding UTF8
$clientMobileHtml | Out-File -FilePath "c:\Users\Alejandro\AIGestion\mobile\client-app\index.html" -Encoding UTF8

Write-Host "✅ Mobile HTML apps created" -ForegroundColor Green

Write-Host "🎉 Complete Frontend System Created!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Gray
