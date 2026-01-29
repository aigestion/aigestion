import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            👥 Client Dashboard
          </h1>
          <p className="text-cyan-200">
            Your AIGestion Client Portal - Manage Your Projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-cyan-500/20">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">📊 Project Analytics</h3>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                View Analytics
              </Button>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-cyan-500/20">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🤖 AI Assistant</h3>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                Chat with Daniela
              </Button>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-cyan-500/20">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">📈 Reports</h3>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                Generate Reports
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
