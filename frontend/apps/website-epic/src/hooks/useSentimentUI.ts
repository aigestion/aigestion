import { useState, useCallback } from 'react';

export type Sentiment = 'neutral' | 'positive' | 'negative' | 'alert';

export const useSentimentUI = () => {
  const [sentiment, setSentiment] = useState<Sentiment>('neutral');

  const updateSentiment = useCallback((newSentiment: Sentiment) => {
    setSentiment(newSentiment);
  }, []);

  const getSentimentColors = () => {
    switch (sentiment) {
      case 'positive':
        return {
          primary: 'text-green-400',
          glow: 'rgba(74, 222, 128, 0.4)',
          bg: 'bg-green-500/5',
        };
      case 'negative':
        return {
          primary: 'text-red-400',
          glow: 'rgba(239, 68, 68, 0.4)',
          bg: 'bg-red-500/5',
        };
      case 'alert':
        return {
          primary: 'text-yellow-400',
          glow: 'rgba(250, 204, 21, 0.4)',
          bg: 'bg-yellow-500/5',
        };
      default:
        return {
          primary: 'text-nexus-cyan-glow',
          glow: 'rgba(0, 245, 255, 0.4)',
          bg: 'bg-nexus-cyan/5',
        };
    }
  };

  return {
    sentiment,
    updateSentiment,
    colors: getSentimentColors(),
  };
};
