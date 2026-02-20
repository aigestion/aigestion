import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useSound } from '../hooks/useSound';
import { CinematicHero } from './CinematicHero';
import { ClientShowcase } from './ClientShowcase';
import { Footer } from './Footer';

// Lazy loaded sections from AppContent
const DanielaShowcase = lazy(() =>
  import('./DanielaShowcase').then(m => ({ default: m.DanielaShowcase }))
);
const NexusAndroid = lazy(() => import('./NexusAndroid').then(m => ({ default: m.NexusAndroid })));
const ServicesDeepDive = lazy(() =>
  import('./ServicesDeepDive').then(m => ({ default: m.ServicesDeepDive }))
);
const SovereignPublicPulse = lazy(() =>
  import('./SovereignPublicPulse').then(m => ({ default: m.SovereignPublicPulse }))
);
const CaseStudies = lazy(() => import('./CaseStudies').then(m => ({ default: m.CaseStudies })));
const EnhancedROI = lazy(() => import('./EnhancedROI').then(m => ({ default: m.EnhancedROI })));
const PricingSection = lazy(() =>
  import('./PricingSection').then(m => ({ default: m.PricingSection }))
);
const IngeniousPlan = lazy(() =>
  import('./IngeniousPlan').then(m => ({ default: m.IngeniousPlan }))
);
const VideoTutorials = lazy(() =>
  import('./VideoTutorials').then(m => ({ default: m.VideoTutorials }))
);
const MetaverseSection = lazy(() =>
  import('./MetaverseSection').then(m => ({ default: m.MetaverseSection }))
);
const DecentralandOffice = lazy(() =>
  import('./DecentralandOffice').then(m => ({ default: m.DecentralandOffice }))
);
const FAQSection = lazy(() => import('./FAQSection').then(m => ({ default: m.FAQSection })));
const DemoDashboard = lazy(() =>
  import('./DemoDashboard').then(m => ({ default: m.DemoDashboard }))
);

const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center bg-black">
    <div className="w-8 h-8 border-2 border-nexus-cyan border-t-transparent rounded-full animate-spin" />
  </div>
);

export const CinematicExperience: React.FC = () => {
  const [showMainContent, setShowMainContent] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const { playWuaw } = useSound();

  const sections = [
    { id: 'hero', component: <CinematicHero onHeroComplete={() => setShowMainContent(true)} /> },
    { id: 'clients', component: <ClientShowcase /> },
    { id: 'daniela', component: <DanielaShowcase /> },
    { id: 'nexus', component: <NexusAndroid /> },
    { id: 'demo', component: <DemoDashboard /> },
    { id: 'services', component: <ServicesDeepDive /> },
    { id: 'pulse', component: <SovereignPublicPulse /> },
    { id: 'cases', component: <CaseStudies /> },
    { id: 'roi', component: <EnhancedROI /> },
    { id: 'pricing', component: <PricingSection /> },
    { id: 'plan', component: <IngeniousPlan /> },
    { id: 'tutorials', component: <VideoTutorials /> },
    { id: 'metaverse', component: <MetaverseSection /> },
    { id: 'office', component: <DecentralandOffice /> },
    { id: 'faq', component: <FAQSection /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionIndex = Math.floor(scrollPosition / windowHeight);

      if (sectionIndex !== currentSection && sectionIndex < sections.length) {
        setCurrentSection(sectionIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection, sections.length]);

  const scrollToSection = (index: number) => {
    playWuaw();
    const element = document.getElementById(sections[index].id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* Cinematic Hero */}
      <AnimatePresence>
        {!showMainContent && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50"
          >
            <CinematicHero onHeroComplete={() => setShowMainContent(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {showMainContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* Navigation Dots */}
            <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 space-y-4">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(index)}
                  className={`w-3 h-3 rounded-full border-2 transition-all ${
                    currentSection === index
                      ? 'bg-nexus-cyan border-nexus-cyan'
                      : 'bg-transparent border-white/30 hover:border-white/60'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>

            {/* Sections */}
            <div className="space-y-0">
              <Suspense fallback={<LoadingFallback />}>
                {sections.map((section, index) => (
                  <section key={section.id} id={section.id}>
                    {section.component}
                  </section>
                ))}
                <Footer />
              </Suspense>
            </div>

            {/* Floating Action Button */}
            <motion.button
              className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-full shadow-2xl shadow-nexus-cyan/50 flex items-center justify-center z-40"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToSection(0)}
            >
              <span className="text-white text-2xl">⬆️</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
