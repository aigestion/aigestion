import React from 'react';

export const CyberpunkGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-40 pointer-events-none overflow-hidden opacity-20">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 245, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 245, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)',
        }}
      />
      {/* Perspective Grid Floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%] origin-bottom [transform:rotateX(60deg)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(138, 43, 226, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(138, 43, 226, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
};
