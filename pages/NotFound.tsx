import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { Home, ArrowLeft, Terminal } from 'lucide-react';

const NotFound: React.FC = () => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>

      {/* Ambient Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-blue rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className={`text-center relative z-10 transition-all duration-700 max-w-5xl ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Glitch 404 */}
        <h1 
          className={`text-[8rem] md:text-[12rem] lg:text-[14rem] font-pixel text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-neon-purple mb-4 md:mb-6 tracking-widest relative leading-none transition-all duration-300 ${mounted ? 'opacity-100' : 'opacity-0'} ${glitchActive ? 'glitch' : ''}`}
          style={{ transitionDelay: '200ms' }}
          data-text="404"
        >
          404
          <span className="absolute -inset-4 blur-3xl bg-red-500/30 opacity-50 animate-pulse"></span>
        </h1>

        {/* Error Message */}
        <div className={`space-y-3 md:space-y-4 mb-6 md:mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
          <div className="flex items-center justify-center gap-2 md:gap-3 text-xl md:text-2xl font-mono text-white">
            <Terminal className="w-5 h-5 md:w-6 md:h-6 text-red-400 animate-pulse" />
            <span className="tracking-wide">PAGE NOT FOUND</span>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-slate-300 font-mono text-sm md:text-base leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-slate-500 font-mono text-xs md:text-sm">
              Error Code: <span className="text-red-400">HTTP 404</span> | Status: <span className="text-red-400">Resource Not Found</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
          <Link to="/" className="group">
            <LiquidGlassCard className="px-6 py-3 md:px-8 md:py-4 border-neon-blue/50 hover:border-neon-blue transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:-translate-y-1">
              <div className="flex items-center gap-2 md:gap-3 text-white font-mono uppercase tracking-wider text-sm md:text-base">
                <Home className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                <span>Home</span>
              </div>
            </LiquidGlassCard>
          </Link>

          <button 
            onClick={() => window.history.back()} 
            className="group"
          >
            <LiquidGlassCard className="px-6 py-3 md:px-8 md:py-4 border-slate-700 hover:border-slate-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(148,163,184,0.3)] hover:-translate-y-1">
              <div className="flex items-center gap-2 md:gap-3 text-slate-300 font-mono uppercase tracking-wider group-hover:text-white transition-colors text-sm md:text-base">
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                <span>Go Back</span>
              </div>
            </LiquidGlassCard>
          </button>
        </div>

        {/* Decorative Tech Elements */}
        <div className="absolute -top-16 md:-top-20 left-0 space-y-1 text-[10px] md:text-xs font-mono text-slate-600 opacity-60">
          <div className="animate-pulse">⚠ ERR_CODE: 0x404</div>
          <div className="animate-pulse" style={{ animationDelay: '0.5s' }}>⚠ TIMESTAMP: {new Date().toISOString().split('T')[0]}</div>
        </div>
        <div className="absolute -bottom-16 md:-bottom-20 right-0 text-[10px] md:text-xs font-mono text-slate-600 opacity-60">
          <div className="animate-pulse">◆ SYS_STATUS: HALTED</div>
        </div>
      </div>

      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }

        .glitch {
          animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
