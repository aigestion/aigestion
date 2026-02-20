import { motion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Note {
  frequency: number;
  duration: number;
  startTime: number;
}

const AigestionAmbientMelody: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  // AIGestion ambient scale - ethereal and futuristic
  const ambientScale = [
    261.63, // C4 - Foundation
    293.66, // D4 - Growth
    329.63, // E4 - Innovation
    349.23, // F4 - Stability
    392.0, // G4 - Expansion
    440.0, // A4 - Clarity
    493.88, // B4 - Wisdom
    523.25, // C5 - Achievement
  ];

  const melody: Note[] = [
    { frequency: ambientScale[0], duration: 2, startTime: 0 },
    { frequency: ambientScale[2], duration: 1.5, startTime: 0.5 },
    { frequency: ambientScale[4], duration: 2, startTime: 1 },
    { frequency: ambientScale[1], duration: 1, startTime: 2 },
    { frequency: ambientScale[3], duration: 2.5, startTime: 2.5 },
    { frequency: ambientScale[5], duration: 1.5, startTime: 3 },
    { frequency: ambientScale[6], duration: 2, startTime: 4 },
    { frequency: ambientScale[7], duration: 3, startTime: 4.5 },
    { frequency: ambientScale[2], duration: 1, startTime: 6 },
    { frequency: ambientScale[0], duration: 4, startTime: 6.5 },
  ];

  const initializeAudio = () => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = volume;
    }
  };

  const createOscillator = (
    frequency: number,
    startTime: number,
    duration: number
  ): OscillatorNode => {
    if (!audioContextRef.current || !gainNodeRef.current) return null as any;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    // Ethereal waveform for ambient atmosphere
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime + startTime);

    // Smooth envelope for ambient feel
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime + startTime);
    gainNode.gain.linearRampToValueAtTime(
      0.1,
      audioContextRef.current.currentTime + startTime + 0.1
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContextRef.current.currentTime + startTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(gainNodeRef.current);

    return oscillator;
  };

  const playMelody = () => {
    initializeAudio();
    if (!audioContextRef.current) return;

    // Clear any existing oscillators
    stopMelody();

    // Create oscillators for each note
    const newOscillators: OscillatorNode[] = [];
    melody.forEach(note => {
      const oscillator = createOscillator(note.frequency, note.startTime, note.duration);
      oscillator.start(audioContextRef.current!.currentTime);
      oscillator.stop(audioContextRef.current!.currentTime + note.startTime + note.duration);
      newOscillators.push(oscillator);
    });

    oscillatorsRef.current = newOscillators;

    // Add harmonic layer for depth
    const harmonicOscillator = audioContextRef.current.createOscillator();
    const harmonicGain = audioContextRef.current.createGain();
    harmonicOscillator.type = 'triangle';
    harmonicOscillator.frequency.setValueAtTime(130.81, audioContextRef.current.currentTime); // C3
    harmonicGain.gain.setValueAtTime(0.05, audioContextRef.current.currentTime);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 10);
    harmonicOscillator.connect(harmonicGain);
    harmonicGain.connect(gainNodeRef.current!);
    harmonicOscillator.start();
    harmonicOscillator.stop(audioContextRef.current.currentTime + 10);
    oscillatorsRef.current.push(harmonicOscillator);

    setIsPlaying(true);

    // Auto-loop the melody
    setTimeout(() => {
      if (isPlaying) {
        playMelody();
      }
    }, 11000); // 11 seconds total duration
  };

  const stopMelody = () => {
    oscillatorsRef.current.forEach(oscillator => {
      try {
        oscillator.stop();
        oscillator.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    oscillatorsRef.current = [];
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      stopMelody();
    } else {
      playMelody();
    }
  };

  const toggleMute = () => {
    if (gainNodeRef.current) {
      if (isMuted) {
        gainNodeRef.current.gain.value = volume;
      } else {
        gainNodeRef.current.gain.value = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (gainNodeRef.current && !isMuted) {
      gainNodeRef.current.gain.value = newVolume;
    }
  };

  useEffect(() => {
    return () => {
      stopMelody();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              AIGestion Ambient Melody
            </h3>
            <p className="text-gray-300 text-sm">
              Ethereal soundscape for enhanced focus and creativity
            </p>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayPause}
              className="p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </motion.button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 w-20">Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-sm text-gray-400 w-12 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-8 gap-2 mt-6">
            {ambientScale.map((freq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="h-16 bg-gradient-to-b from-purple-500/20 to-blue-500/20 rounded-lg flex items-end justify-center mb-2">
                  <motion.div
                    className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t"
                    style={{ height: `${(freq / 523.25) * 100}%` }}
                    animate={
                      isPlaying
                        ? {
                            height: [
                              `${(freq / 523.25) * 100}%`,
                              `${(freq / 523.25) * 120}%`,
                              `${(freq / 523.25) * 100}%`,
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2 + index * 0.2,
                      repeat: isPlaying ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400">
                  {['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'][index]}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-black/30 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              🎵 Based on the C Major scale with ethereal harmonics
              <br />
              Designed to enhance focus and creativity during work
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #a855f7, #3b82f6);
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #a855f7, #3b82f6);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default AigestionAmbientMelody;
