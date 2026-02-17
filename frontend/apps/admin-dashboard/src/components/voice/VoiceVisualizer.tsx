import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

export const VoiceVisualizer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isListening, setIsListening] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationRef = useRef<number | null>(null);

    const startListening = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);

            analyser.fftSize = 256;
            source.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            sourceRef.current = source;
            setIsListening(true);

            draw();
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopListening = () => {
        if (sourceRef.current) {
            sourceRef.current.disconnect();
        }
        if (analyserRef.current) {
            analyserRef.current.disconnect();
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        setIsListening(false);
        // Clear canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const draw = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;

        if (!canvas || !analyser) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const renderFrame = () => {
            animationRef.current = requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const width = canvas.width;
            const height = canvas.height;
            const barWidth = (width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2;

                // Gradient styling
                const gradient = ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, '#a855f7'); // Purple
                gradient.addColorStop(1, '#3b82f6'); // Blue

                ctx.fillStyle = gradient;

                // Mirror effect
                ctx.fillRect(x, height / 2 - barHeight / 2, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        renderFrame();
    };

    useEffect(() => {
        return () => {
            stopListening();
        };
    }, []);

    return (
        <div className="flex flex-col items-center gap-4 p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5">
            <h3 className="text-sm font-mono text-slate-400">VOICE OF GOD INTERFACE</h3>

            <div className="relative w-full h-32 bg-slate-950 rounded-lg overflow-hidden border border-white/10 shadow-inner">
                 <canvas
                    ref={canvasRef}
                    width={300}
                    height={128}
                    className="w-full h-full"
                />
                {!isListening && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs">
                        MICROPHONE OFFLINE
                    </div>
                )}
            </div>

            <button
                onClick={isListening ? stopListening : startListening}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isListening
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 ring-1 ring-red-500/50'
                    : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 ring-1 ring-blue-500/50'
                }`}
            >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                {isListening ? 'DEACTIVATE LINK' : 'ESTABLISH LINK'}
            </button>
        </div>
    );
};
