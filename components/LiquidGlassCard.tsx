import React, { useRef, useState, useId } from 'react';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({ children, className = "", style = {}, onClick }) => {
  // Generate a safe unique ID for the SVG filter
  const rawId = useId();
  const filterId = `glass-distortion-${rawId.replace(/:/g, '')}`;
  
  // Removed state for displacementScale to prevent blur/distortion on hover
  const [specularBg, setSpecularBg] = useState('none');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate dynamic specular highlight position only
    setSpecularBg(`radial-gradient(
        circle at ${x}px ${y}px,
        rgba(255,255,255,0.15) 0%,
        rgba(255,255,255,0.05) 30%,
        rgba(255,255,255,0) 60%
      )`);
  };

  const handleMouseLeave = () => {
    setSpecularBg('none');
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
         // Default CSS variables for dark mode
         '--bg-color': 'rgba(30, 41, 59, 0.4)', // slate-800/40
         '--highlight': 'rgba(255, 255, 255, 0.1)',
         ...style
      } as React.CSSProperties}
    >
      {/* 
        SVG Filter Definition 
        Fixed scale to 0 or very low to prevent distortion
      */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0" 
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Layer 1: Glass Filter (Blur only, no distortion) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          // Apply the unique filter ID (though scale is 0 now)
          filter: `url(#${filterId}) saturate(120%) brightness(1.15)`,
        }}
      />

      {/* Layer 2: Animated Distortion Overlay (Optional: keep for subtle texture or remove if needed. Keeping for style.) */}
      <div 
        className="absolute inset-0 z-20 animate-[floatDistort_10s_infinite_ease-in-out] opacity-30 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0%, transparent 80%),
                            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05) 0%, transparent 80%)`,
          backgroundSize: '300% 300%',
        }}
      />

      {/* Layer 3: Background Color Overlay */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none transition-colors duration-300" 
        style={{ background: 'var(--bg-color)' }} 
      />

      {/* Layer 4: Specular Highlight (Mouse tracking) */}
      <div
        className="absolute inset-0 z-30 transition-all duration-300 pointer-events-none"
        style={{
          boxShadow: 'inset 1px 1px 1px var(--highlight)',
          background: specularBg,
        }}
      />

      {/* Layer 5: Content */}
      <div className="relative z-40 h-full">
        {children}
      </div>
    </div>
  );
};

export default LiquidGlassCard;