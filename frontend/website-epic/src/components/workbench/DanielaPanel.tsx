import { Sparkles, Send, Mic } from 'lucide-react';

export const DanielaPanel = () => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]">
      {/* Header */}
      <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-white/5">
        <Sparkles size={14} className="text-purple-400" />
        <span className="text-xs font-bold tracking-wider text-purple-100 uppercase">
          Daniela AI Assistant
        </span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center shrink-0 border border-purple-500/30">
            <span className="text-[10px] font-bold text-purple-300">AI</span>
          </div>
          <div className="bg-white/5 p-3 rounded-tr-xl rounded-b-xl border border-white/10 text-sm text-gray-300 leading-relaxed max-w-[90%] shadow-lg backdrop-blur-sm">
            <p>
              Hello! I'm integrated into your workbench. I can help you analyze metrics, refactor
              code, or manage deployment tasks. What's on your mind?
            </p>
          </div>
        </div>

        {/* User Mock Message */}
        <div className="flex gap-3 flex-row-reverse">
          <div className="w-6 h-6 rounded-full bg-cyan-600/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
            <span className="text-[10px] font-bold text-cyan-300">ME</span>
          </div>
          <div className="bg-cyan-500/10 p-3 rounded-tl-xl rounded-b-xl border border-cyan-500/20 text-sm text-cyan-100 leading-relaxed shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <p>Analyze the current bundle size for me.</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-white/10 bg-[#151515]">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask Daniela..."
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-900/50 transition-all shadow-inner text-gray-200"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
              <Mic size={14} />
            </button>
            <button className="p-1.5 hover:bg-purple-500/20 rounded text-purple-400 hover:text-purple-200 transition-colors">
              <Send size={14} />
            </button>
          </div>
        </div>
        <div className="text-[10px] text-gray-600 mt-2 flex justify-center gap-3">
          <span className="cursor-pointer hover:text-purple-400 transition-colors">
            Generate Component
          </span>
          <span className="cursor-pointer hover:text-purple-400 transition-colors">Fix Bugs</span>
          <span className="cursor-pointer hover:text-purple-400 transition-colors">
            {' '}
            Explain Code
          </span>
        </div>
      </div>
    </div>
  );
};
