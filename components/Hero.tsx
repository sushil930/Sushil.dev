import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import LiquidGlassCard from './LiquidGlassCard';

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    
    // Initial start delay
    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      intervalId = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 50); // Typing speed
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, delay]);

  return <span>{displayText}</span>;
};

const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center justify-center pt-16 overflow-hidden">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Intro Label - Staggered Item 1 */}
        <div className={`transition-all duration-1000 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-sm font-mono text-slate-400 mb-6">
            Hey, I'm Sushil Patel
          </p>
        </div>

        {/* Main Heading - Typewriter Effect */}
        <h1 className="font-pixel text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
          <span className="block">
             <TypewriterText text="Frontend Developer" />
          </span>
        </h1>

        {/* Subheading - Staggered Item 2 */}
        <div className={`transition-all duration-1000 delay-300 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-neon-green text-lg md:text-xl mb-6 font-mono">
            React • TypeScript • UI Developing
          </p>
        </div>

        {/* Tagline - Staggered Item 3 */}
        <div className={`transition-all duration-1000 delay-500 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="max-w-2xl mx-auto text-slate-400 text-base md:text-lg mb-12 leading-relaxed">
            I build fast, modern, and scalable web interfaces with clean architecture, intuitive interactions, and precise execution.
          </p>
        </div>

        {/* CTA Buttons - Staggered Item 4 */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-700 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <a 
            href="#projects" 
            className="group rounded-[20px] outline-none"
            aria-label="View Projects"
          >
            <LiquidGlassCard 
              className="px-8 py-4 border border-neon-green/30 md:hover:border-neon-green/80 transition-all duration-300 md:hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] md:hover:-translate-y-1 rounded-[20px]"
              style={{ '--bg-color': 'rgba(74, 222, 128, 0.15)' } as React.CSSProperties}
            >
               <span className="flex items-center gap-3 text-sm font-semibold text-neon-green md:group-hover:text-white transition-colors">
                 <Zap className="w-4 h-4" /> View Projects
               </span>
            </LiquidGlassCard>
          </a>
          <a 
            href="#contact" 
            className="group rounded-[20px] outline-none"
            aria-label="Get in Touch"
          >
             <LiquidGlassCard 
               className="px-8 py-4 border border-neon-purple/30 md:hover:border-neon-purple/80 transition-all duration-300 md:hover:shadow-[0_0_20px_rgba(216,180,254,0.3)] md:hover:-translate-y-1 rounded-[20px]"
               style={{ '--bg-color': 'rgba(216, 180, 254, 0.15)' } as React.CSSProperties}
             >
               <span className="flex items-center gap-3 text-sm font-semibold text-neon-purple md:group-hover:text-white transition-colors">
                 Get in Touch
               </span>
            </LiquidGlassCard>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;