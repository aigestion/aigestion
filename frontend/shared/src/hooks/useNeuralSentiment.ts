import { useEffect } from 'react';
import { socket } from '../utils/socket';

interface NeuralMetrics {
  cpuUsage: number;
  memoryUsage: number;
  sanityScore: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
}

/**
 * useNeuralSentiment: Adjusts the UI atmosphere based on the system's "internal mood".
 * Changes CSS variables globally to reflect system health.
 */
export const useNeuralSentiment = () => {
  useEffect(() => {
    socket.on('nexus:neural_heartbeat', (metrics: NeuralMetrics) => {
      const root = document.documentElement;

      // Interpolate colors based on sanity score
      // Optimal (100) -> Cyan/Violet
      // Critical (0) -> Red/Amber

      if (metrics.status === 'CRITICAL' || metrics.sanityScore < 60) {
        // High Stress Atmosphere
        root.style.setProperty('--nexus-cyan', '239, 68, 68'); // red-500
        root.style.setProperty('--nexus-violet', '245, 158, 11'); // amber-500
        root.style.setProperty('--nexus-cyan-glow', 'rgba(239, 68, 68, 0.8)');
      } else if (metrics.status === 'DEGRADED') {
        // Warning Atmosphere
        root.style.setProperty('--nexus-cyan', '245, 158, 11'); // amber-500
        root.style.setProperty('--nexus-violet', '139, 92, 246'); // violet-500
        root.style.setProperty('--nexus-cyan-glow', 'rgba(245, 158, 11, 0.8)');
      } else {
        // Calm/Optimal Atmosphere (Original)
        root.style.setProperty('--nexus-cyan', '0, 245, 255');
        root.style.setProperty('--nexus-violet', '138, 43, 226');
        root.style.setProperty('--nexus-cyan-glow', 'rgba(0, 245, 255, 0.8)');
      }
    });

    return () => {
      socket.off('nexus:neural_heartbeat');
    };
  }, []);
};
