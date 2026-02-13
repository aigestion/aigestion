import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSound } from '../hooks/useSound';
import { CinematicHero } from './CinematicHero';
import { ClientShowcase } from './ClientShowcase';
import { DanielaAI } from './DanielaAI';
import { NexusAndroid } from './NexusAndroid';

export const CinematicExperience: React.FC = () => {
  const [showMainContent, setShowMainContent] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const { playWuaw } = useSound();

  const sections = [
    { id: 'hero', component: <CinematicHero onHeroComplete={() => setShowMainContent(true)} /> },
    { id: 'clients', component: <ClientShowcase /> },
    { id: 'daniela', component: <DanielaAI /> },
    { id: 'nexus', component: <NexusAndroid /> },
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
              {/* Hero Section (Simplified) */}
              <section
                id="hero"
                className="relative h-screen flex items-center justify-center bg-black overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-nexus-violet/20 via-transparent to-nexus-cyan/20" />
                <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
                  <motion.h1
                    className="text-6xl md:text-9xl font-orbitron font-black text-white mb-6"
                    style={{
                      textShadow:
                        '0 0 40px rgba(138, 43, 226, 0.8), 0 0 80px rgba(0, 245, 255, 0.6)',
                    }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                  >
                    AIGESTION.NET
                  </motion.h1>
                  <motion.p
                    className="text-2xl md:text-4xl text-nexus-cyan mb-8 font-light"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    Arquitectura de Inteligencia Soberana
                  </motion.p>
                  <motion.button
                    className="btn-enterprise px-12 py-6 text-xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    EXPERIENCIA CINEMATOGRÁFICA
                  </motion.button>
                </div>
              </section>

              {/* Client Showcase */}
              <section id="clients">
                <ClientShowcase />
              </section>

              {/* Daniela AI */}
              <section id="daniela">
                <DanielaAI />
              </section>

              {/* Nexus Android */}
              <section id="nexus">
                <NexusAndroid />
              </section>
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
