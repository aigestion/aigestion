import { Route, Routes } from 'react-router-dom';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { ClientDashboard } from '../components/dashboard/ClientDashboard';
import { DemoDashboard } from '../components/dashboard/DemoDashboard';

export function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/client" element={<ClientDashboard />} />
      <Route path="/demo" element={<DemoDashboard />} />
    </Routes>
  );
}
