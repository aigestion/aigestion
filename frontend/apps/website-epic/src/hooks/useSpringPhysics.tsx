import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useMemo } from 'react';

export interface SpringConfig {
  readonly stiffness?: number;
  readonly damping?: number;
  readonly mass?: number;
  readonly velocity?: number;
  readonly clamp?: boolean;
  readonly duration?: number;
  readonly easing?: string;
}

export interface MicroInteractionOptions {
  readonly scale?: number;
  readonly rotate?: number;
  readonly opacity?: number;
  readonly blur?: number;
  readonly brightness?: number;
  readonly hue?: number;
  readonly config?: SpringConfig;
}

const DEFAULT_SPRING_CONFIG: SpringConfig = {
  stiffness: 300,
  damping: 30,
  mass: 1,
  clamp: false,
};

// Hook for spring-based micro-interactions
export function useSpringPhysics(options: MicroInteractionOptions = {}) {
  const {
    scale = 1.05,
    rotate = 5,
    opacity = 0.8,
    blur = 0,
    brightness = 1.2,
    hue = 10,
    config = DEFAULT_SPRING_CONFIG,
  } = options;

  // Motion values for different properties
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rotateZ = useMotionValue(0);
  const opacityValue = useMotionValue(1);
  const blurValue = useMotionValue(0);
  const brightnessValue = useMotionValue(1);
  const hueValue = useMotionValue(0);

  // Spring configurations
  const springConfig = useMemo(() => ({
    ...DEFAULT_SPRING_CONFIG,
    ...config,
  }), [config]);

  // Spring animations
  const scaleXSpring = useSpring(scaleX, springConfig);
  const scaleYSpring = useSpring(scaleY, springConfig);
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);
  const rotateZSpring = useSpring(rotateZ, springConfig);
  const opacitySpring = useSpring(opacityValue, springConfig);
  const blurSpring = useSpring(blurValue, springConfig);
  const brightnessSpring = useSpring(brightnessValue, springConfig);
  const hueSpring = useSpring(hueValue, springConfig);

  // Interaction handlers
  const handlers = useMemo(() => ({
    onHoverStart: () => {
      scaleX.set(scale);
      scaleY.set(scale);
      rotateZ.set(rotate);
      opacityValue.set(opacity);
      brightnessValue.set(brightness);
      hueValue.set(hue);
    },

    onHoverEnd: () => {
      scaleX.set(1);
      scaleY.set(1);
      rotateZ.set(0);
      opacityValue.set(1);
      brightnessValue.set(1);
      hueValue.set(0);
    },

    onTapStart: () => {
      scaleX.set(scale * 0.95);
      scaleY.set(scale * 0.95);
      blurValue.set(blur);
    },

    onTap: () => {
      scaleX.set(scale * 1.1);
      scaleY.set(scale * 1.1);
      rotateX.set(rotate);
      rotateY.set(rotate);

      // Reset after a short delay
      setTimeout(() => {
        scaleX.set(1);
        scaleY.set(1);
        rotateX.set(0);
        rotateY.set(0);
        blurValue.set(0);
      }, 200);
    },

    onTapEnd: () => {
      blurValue.set(0);
    },
  }), [
    scale, rotate, opacity, blur, brightness, hue,
    scaleX, scaleY, rotateX, rotateY, rotateZ,
    opacityValue, blurValue, brightnessValue, hueValue,
  ]);

  // Combined style object
  const style = useMemo(() => ({
    scaleX: scaleXSpring,
    scaleY: scaleYSpring,
    rotateX: rotateXSpring,
    rotateY: rotateYSpring,
    rotateZ: rotateZSpring,
    opacity: opacitySpring,
    filter: useTransform(
      [blurSpring, brightnessSpring, hueSpring],
      ([blur, brightness, hue]) =>
        `blur(${blur}px) brightness(${brightness}) hue-rotate(${hue}deg)`
    ),
  }), [
    scaleXSpring, scaleYSpring, rotateXSpring, rotateYSpring, rotateZSpring,
    opacitySpring, blurSpring, brightnessSpring, hueSpring,
  ]);

  return { style, handlers };
}

// Hook for magnetic effect
export function useMagneticEffect(strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [strength * -10, strength * 10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [strength * -10, strength * 10]);

  const handlers = useMemo(() => ({
    onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (event.clientX - centerX) / rect.width;
      const deltaY = (event.clientY - centerY) / rect.height;

      x.set(deltaX);
      y.set(deltaY);
    },

    onMouseLeave: () => {
      x.set(0);
      y.set(0);
    },
  }), [x, y]);

  const style = useMemo(() => ({
    rotateX,
    rotateY,
    transformStyle: 'preserve-3d' as const,
  }), [rotateX, rotateY]);

  return { style, handlers };
}

// Hook for parallax effect
export function useParallaxEffect(intensity = 0.5) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const translateX = useTransform(x, [-1, 1], [-intensity * 20, intensity * 20]);
  const translateY = useTransform(y, [-1, 1], [-intensity * 20, intensity * 20]);

  const handlers = useMemo(() => ({
    onGlobalMouseMove: (event: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const deltaX = (event.clientX - centerX) / centerX;
      const deltaY = (event.clientY - centerY) / centerY;

      x.set(deltaX);
      y.set(deltaY);
    },
  }), [x, y]);

  const style = useMemo(() => ({
    x: translateX,
    y: translateY,
  }), [translateX, translateY]);

  return { style, handlers };
}

// Hook for elastic button effect
export function useElasticButton(options: { readonly scale?: number; readonly config?: SpringConfig } = {}) {
  const { scale = 1.2, config } = options;

  const buttonScale = useMotionValue(1);
  const buttonScaleSpring = useSpring(buttonScale, config || DEFAULT_SPRING_CONFIG);

  const handlers = useMemo(() => ({
    onHoverStart: () => {
      buttonScale.set(scale);
    },

    onHoverEnd: () => {
      buttonScale.set(1);
    },

    onTapStart: () => {
      buttonScale.set(0.95);
    },

    onTapEnd: () => {
      buttonScale.set(1);
    },
  }), [scale, buttonScale]);

  const style = useMemo(() => ({
    scale: buttonScaleSpring,
  }), [buttonScaleSpring]);

  return { style, handlers };
}

// Hook for floating animation
export function useFloatingAnimation(options: {
  readonly amplitude?: number;
  readonly frequency?: number;
  readonly phase?: number;
} = {}) {
  const { amplitude = 10, frequency = 2, phase = 0 } = options;

  const y = useMotionValue(0);
  const ySpring = useSpring(y, {
    stiffness: 100,
    damping: 20,
  });

  // Start floating animation
  const startFloating = useMemo(() => () => {
    const animate = () => {
      const time = Date.now() / 1000;
      const newY = Math.sin(time * frequency + phase) * amplitude;
      y.set(newY);
      requestAnimationFrame(animate);
    };
    animate();
  }, [amplitude, frequency, phase, y]);

  const style = useMemo(() => ({
    y: ySpring,
  }), [ySpring]);

  return { style, startFloating };
}

// Hook for staggered animations
export function useStaggerAnimation(items: any[], delay = 0.1) {
  return useMemo(() =>
    items.map((_, index) => ({
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: {
        delay: index * delay,
        duration: 0.5,
        ease: 'easeOut',
      },
    })), [items, delay]
  );
}

// Hook for morphing shapes
export function useMorphShape() {
  const pathLength = useMotionValue(0);
  const pathLengthSpring = useSpring(pathLength, DEFAULT_SPRING_CONFIG);

  const handlers = useMemo(() => ({
    morphTo: (targetLength: number) => {
      pathLength.set(targetLength);
    },
  }), [pathLength]);

  const style = useMemo(() => ({
    pathLength: pathLengthSpring,
  }), [pathLengthSpring]);

  return { style, handlers };
}

// Hook for liquid effect
export function useLiquidEffect() {
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const rotate = useMotionValue(0);

  const scaleXSpring = useSpring(scaleX, { stiffness: 200, damping: 25 });
  const scaleYSpring = useSpring(scaleY, { stiffness: 200, damping: 25 });
  const rotateSpring = useSpring(rotate, { stiffness: 200, damping: 25 });

  const handlers = useMemo(() => ({
    onLiquidMove: (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      scaleX.set(1 + (x - 0.5) * 0.2);
      scaleY.set(1 + (y - 0.5) * 0.2);
      rotate.set((x - 0.5) * 10);
    },

    onLiquidEnd: () => {
      scaleX.set(1);
      scaleY.set(1);
      rotate.set(0);
    },
  }), [scaleX, scaleY, rotate]);

  const style = useMemo(() => ({
    scaleX: scaleXSpring,
    scaleY: scaleYSpring,
    rotate: rotateSpring,
    transformOrigin: 'center',
  }), [scaleXSpring, scaleYSpring, rotateSpring]);

  return { style, handlers };
}

// Component for applying spring physics
export function SpringPhysics({
  children,
  options = {},
  className = '',
}: {
  readonly children: React.ReactNode;
  readonly options?: MicroInteractionOptions;
  readonly className?: string;
}) {
  const { style, handlers } = useSpringPhysics(options);

  return (
    <motion.div
      className={className}
      style={style}
      {...handlers}
    >
      {children}
    </motion.div>
  );
}

// Component for magnetic effect
export function MagneticEffect({
  children,
  strength = 0.3,
  className = '',
}: {
  readonly children: React.ReactNode;
  readonly strength?: number;
  readonly className?: string;
}) {
  const { style, handlers } = useMagneticEffect(strength);

  return (
    <motion.div
      className={className}
      style={style}
      {...handlers}
    >
      {children}
    </motion.div>
  );
}

// Component for elastic button
export function ElasticButton({
  children,
  options = {},
  className = '',
  onClick,
}: {
  readonly children: React.ReactNode;
  readonly options?: { readonly scale?: number; readonly config?: SpringConfig };
  readonly className?: string;
  readonly onClick?: () => void;
}) {
  const { style, handlers } = useElasticButton(options);

  return (
    <motion.button
      className={className}
      style={style}
      {...handlers}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
