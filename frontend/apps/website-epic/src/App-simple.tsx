import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { CinematicPresentation } from './components/CinematicPresentation';
import { ClientShowcase } from './components/ClientShowcase';
import { ContactSection } from './components/ContactSection';
import { DanielaShowcase } from './components/DanielaShowcase';
import { Dashboard } from './components/Dashboard';
import { EnhancedROI } from './components/EnhancedROI';
import { Navigation } from './components/Navigation';
import { NexusAndroid } from './components/NexusAndroid';
import { VitureXRExperience } from './components/VitureXRExperience';
import { Login } from './pages/Login';

function App() {
  return (
    <Router>
      <div className="bg-nexus-obsidian min-h-screen text-white font-sans selection:bg-nexus-violet selection:text-white relative">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={
            <main>
              <Navigation />
              <CinematicPresentation />
              <ClientShowcase />
              <DanielaShowcase />
              <NexusAndroid />
              <EnhancedROI />
              <ContactSection />
              <VitureXRExperience />
            </main>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
