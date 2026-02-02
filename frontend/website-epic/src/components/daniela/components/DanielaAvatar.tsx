import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDaniela } from "../DanielaProvider";

interface DanielaAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  className?: string;
}

export const DanielaAvatar: React.FC<DanielaAvatarProps> = ({
  size = "md",
  onClick,
  className = "",
}) => {
  const { state } = useDaniela();

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24", 
    lg: "w-48 h-48",
    xl: "w-64 h-64",
  };

  // Dynamic glow based on volume
  const glowScale = 1 + (state.volume * 0.8);
  const glowOpacity = 0.1 + (state.volume * 0.5);

  return (
    <div className={`daniela-avatar ${className}`} onClick={onClick}>
      {/* Volumetric glow based on sound */}
      <AnimatePresence>
        {(state.isSpeaking || state.volume > 0.05) && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: glowScale,
              opacity: glowOpacity,
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="avatar-glow"
          />
        )}
      </AnimatePresence>

      <div className={`${sizeClasses[size]} avatar-container`}>
        <div className="avatar-image">
          <img
            src="/images/brand/icon.png"
            alt="Daniela"
            className="w-full h-full object-cover rounded-full"
          />
          
          {/* Holographic scanning effect overlay */}
          <motion.div
            className="avatar-scan"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Animated speaking indicator with reactive bars */}
          {(state.isSpeaking || state.volume > 0.05) && (
            <div className="speaking-indicator">
              {[1, 2, 3, 4, 3, 2, 1].map((i, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    height: [4, 4 + (state.volume * 16 * (i / 4)), 4],
                  }}
                  transition={{
                    duration: 0.15,
                    repeat: Infinity,
                    delay: idx * 0.03,
                  }}
                  className="speaking-bar"
                />
              ))}
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="status-indicator">
          <div className={`status-dot ${state.isConnected ? "online" : "offline"}`} />
        </div>
      </div>

      {!state.isSpeaking && state.volume <= 0.05 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileHover={{ opacity: 1, y: -12 }}
          className="avatar-tooltip"
        >
          🎤 Habla con Daniela
        </motion.div>
      )}
    </div>
  );
};
