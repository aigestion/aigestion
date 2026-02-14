import React, { useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { ChatBubble } from '../molecules/ChatBubble';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronRight, MessageSquare } from 'lucide-react';

export interface OnboardingStep {
  id: string;
  title: string;
  content: string;
  aiComment: string;
}

export interface AIOnboardingProps {
  steps: OnboardingStep[];
  onComplete?: () => void;
  className?: string;
}

const AIOnboarding = ({ steps, onComplete, className }: AIOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
      onComplete?.();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className={cn('fixed bottom-8 right-8 z-50 w-full max-w-md px-4', className)}
      >
        <Card
          variant="glass"
          className="relative overflow-hidden border-[#8a2be2]/40 bg-[#0a0a0c]/90"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8a2be2] to-[#00d1ff]" />

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#8a2be2]/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-[#8a2be2]" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Nexus AI Guide</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex flex-col gap-4 min-h-[120px]">
              <ChatBubble message={step.aiComment} isAI={true} className="w-full" />
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <h5 className="text-white font-medium text-sm mb-1">{step.title}</h5>
                <p className="text-gray-400 text-xs leading-relaxed">{step.content}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    i === currentStep ? 'w-4 bg-[#8a2be2]' : 'w-1 bg-white/20'
                  )}
                />
              ))}
            </div>
            <Button
              size="sm"
              onClick={handleNext}
              className="px-6"
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export { AIOnboarding };
