import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { FeatureCard } from '../../molecules/FeatureCard';

export interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  stats: { label: string; value: string; color?: string }[];
}

export interface ShowcaseGridProps {
  items: ShowcaseItem[];
  title?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const ShowcaseGrid: React.FC<ShowcaseGridProps> = ({
  items,
  title,
  subtitle,
  className,
}) => {
  const [activeItem, setActiveItem] = useState(0);

  return (
    <section className={cn('relative py-24 px-6', className)}>
      {(title || subtitle) && (
        <div className="text-center mb-20">
          {title && (
            <h2 className="text-4xl md:text-6xl font-orbitron font-black text-white mb-6 uppercase tracking-tighter">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Item Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(index)}
            className={cn(
              'px-6 py-3 rounded-xl font-orbitron text-xs font-bold tracking-widest uppercase transition-all border',
              activeItem === index
                ? 'bg-nexus-cyan/20 border-nexus-cyan text-white shadow-lg shadow-nexus-cyan/20'
                : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'
            )}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={items[activeItem].id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            <FeatureCard
              title={items[activeItem].title}
              subtitle={items[activeItem].category}
              description={items[activeItem].description}
              icon={items[activeItem].icon}
              color={items[activeItem].color}
              stats={items[activeItem].stats.map(s => ({ ...s, value: s.value }))}
              className="border-nexus-cyan/30"
            />
          </motion.div>
        </AnimatePresence>

        <div className="space-y-8 py-8">
          <h4 className="text-xl font-orbitron font-black text-nexus-cyan text-glow uppercase tracking-widest">
            Módulos del Sistema
          </h4>
          <div className="grid gap-6">
            {items[activeItem].features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className={cn("w-2 h-2 rounded-full", items[activeItem].color.split(' ')[0])} />
                <span className="text-gray-300 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
