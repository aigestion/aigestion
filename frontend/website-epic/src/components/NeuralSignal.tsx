import React, { useEffect, useRef } from 'react';

interface NeuralSignalProps {
  volume: number;
  isSpeaking: boolean;
}

export const NeuralSignal: React.FC<NeuralSignalProps> = ({ volume }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 40;

    class Particle {
      x: number;
      y: number;
      speed: number;
      size: number;
      opacity: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.speed = Math.random() * 0.5 + 0.2;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update(canvasWidth: number, canvasHeight: number, vol: number) {
        this.y -= this.speed * (1 + vol * 5);
        if (this.y < -10) {
          this.y = canvasHeight + 10;
          this.x = Math.random() * canvasWidth;
        }
      }

      draw(context: CanvasRenderingContext2D, vol: number) {
        context.beginPath();
        context.arc(this.x, this.y, this.size * (1 + vol * 2), 0, Math.PI * 2);
        context.fillStyle = `rgba(34, 211, 238, ${this.opacity * (1 + vol)})`;
        context.fill();

        // Glow effect
        if (vol > 0.1) {
          context.shadowBlur = 10 * vol;
          context.shadowColor = '#22d3ee';
        } else {
          context.shadowBlur = 0;
        }
      }
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles = Array.from(
        { length: particleCount },
        () => new Particle(canvas.width, canvas.height),
      );
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw neural lines
      ctx.beginPath();
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 + volume * 0.4})`;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
          }
        }
      }
      ctx.stroke();

      particles.forEach((p) => {
        p.update(canvas.width, canvas.height, volume);
        p.draw(ctx, volume);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [volume]);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ filter: 'blur(1px)' }} />;
};
