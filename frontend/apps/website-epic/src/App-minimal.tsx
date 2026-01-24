import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { CinematicPresentation } from './components/CinematicPresentation';
import { ClientShowcase } from './components/ClientShowcase';
import { ContactSection } from './components/ContactSection';
import { DanielaShowcase } from './components/DanielaShowcase';
import { EnhancedROI } from './components/EnhancedROI';
import { Navigation } from './components/Navigation';
import { NexusAndroid } from './components/NexusAndroid';
import { VitureXRExperience } from './components/VitureXRExperience';

function App() {
  return (
    <Router>
      <div className="bg-nexus-obsidian min-h-screen text-white font-sans selection:bg-nexus-violet selection:text-white relative">
        <Routes>
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
          <Route path="*" element={
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
