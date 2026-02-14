import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

export interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onSettings?: () => void;
}

const UserMenu = ({ user, onLogout, onSettings }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="glass"
        size="md"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-3 pr-2"
        icon={
          <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        }
        iconPosition="right"
      >
        <div className="flex items-center gap-2 text-left">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8a2be2] to-[#00d1ff] flex items-center justify-center text-white font-bold">
            {user.name[0]}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold text-white leading-tight">{user.name}</span>
            <span className="text-[10px] text-gray-400 leading-tight">{user.email}</span>
          </div>
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <Card
              variant="glass"
              padding="sm"
              className="absolute right-0 mt-2 w-56 z-50 flex flex-col gap-1 p-1 bg-[#16161a]/95 backdrop-blur-2xl"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
            >
              <button
                onClick={onSettings}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
              >
                <Settings className="w-4 h-4" />
                Configuración
              </button>
              <div className="h-px bg-white/10 my-1 mx-2" />
              <button
                onClick={onLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-all text-sm"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </Card>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export { UserMenu };
