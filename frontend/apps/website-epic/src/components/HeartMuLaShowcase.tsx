import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeuralParticles } from './NeuralParticles';
import { MeshGradientBG } from './MeshGradientBG';

interface Model {
  name: string;
  description: string;
  features: string[];
  color: string;
}

const HeartMuLaShowcase: React.FC = () => {
  const [activeModel, setActiveModel] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const models: Model[] = [
    {
      name: "HeartCLAP",
      description: "Audio-text alignment model for unified music embedding space",
      features: ["Cross-modal retrieval", "Text-to-music alignment", "Unified embeddings"],
      color: "from-purple-600 to-pink-600"
    },
    {
      name: "HeartCodec", 
      description: "Low-frame-rate high-fidelity music codec tokenizer",
      features: ["12.5 Hz sampling", "Long-range structure", "Efficient modeling"],
      color: "from-blue-600 to-cyan-600"
    },
    {
      name: "HeartTranscriptor",
      description: "Robust lyric recognition for real-world music scenarios",
      features: ["Real-time transcription", "Noise robustness", "Multi-language support"],
      color: "from-green-600 to-emerald-600"
    },
    {
      name: "HeartMuLa",
      description: "LLM-based song generation with rich controllable conditions",
      features: ["Multi-conditional generation", "Style control", "Short video music"],
      color: "from-orange-600 to-red-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <MeshGradientBG />
      <NeuralParticles />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
          >
            HeartMuLa
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
          >
            A Family of Open Sourced Music Foundation Models
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="flex justify-center gap-4 mb-12"
          >
            <a 
              href="https://arxiv.org/pdf/2601.10547"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              📄 Paper
            </a>
            <a 
              href="https://github.com/HeartMuLa/heartlib"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105"
            >
              💻 Code
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          {models.map((model, index) => (
            <motion.div
              key={model.name}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveModel(index)}
              className={`relative p-8 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeModel === index 
                  ? 'bg-gradient-to-br ' + model.color + ' shadow-2xl' 
                  : 'bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/50'
              }`}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-20" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">{model.name}</h3>
                <p className="text-gray-300 mb-6">{model.description}</p>
                <div className="space-y-2">
                  {model.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Framework Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {models.map((model, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`text-center p-6 rounded-xl bg-gradient-to-br ${model.color}`}
              >
                <div className="text-4xl mb-3">
                  {index === 0 && '🎵'}
                  {index === 1 && '🎼'}
                  {index === 2 && '🎤'}
                  {index === 3 && '🎹'}
                </div>
                <h4 className="font-bold text-lg">{model.name}</h4>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Experience Music AI</h2>
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-8">
            <p className="text-xl mb-6">Generate, understand, and transform music with AI</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              {isPlaying ? '⏸️ Pause Demo' : '▶️ Start Demo'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeartMuLaShowcase;
