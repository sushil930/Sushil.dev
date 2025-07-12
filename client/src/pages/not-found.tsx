import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, navigate] = useLocation();
  const [glitchText, setGlitchText] = useState("404");

  useEffect(() => {
    const glitchVariations = ["404", "40#", "4!4", "###", "ERR", "404"];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      setGlitchText(glitchVariations[currentIndex]);
      currentIndex = (currentIndex + 1) % glitchVariations.length;
    }, 200);

    const resetTimer = setTimeout(() => {
      clearInterval(interval);
      setGlitchText("404");
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(resetTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--dark-navy)] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-2 h-2 bg-[var(--neon-green)] animate-pulse"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-[var(--pixel-orange)] animate-pulse delay-500"></div>
        <div className="absolute top-60 left-1/3 w-2 h-2 bg-[var(--hot-pink)] animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-[var(--neon-green)] animate-pulse delay-1500"></div>
        <div className="absolute top-1/3 left-3/4 w-1 h-1 bg-[var(--pixel-orange)] animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-[var(--hot-pink)] animate-pulse delay-300"></div>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-[var(--neon-green)]/5 to-transparent bg-[length:100%_4px] animate-pulse opacity-50"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          
          {/* Glitch Effect 404 */}
          <div className="mb-8">
            <h1 className="font-pixel text-8xl md:text-9xl text-[var(--neon-green)] mb-4 relative">
              <span className="relative inline-block">
                {glitchText}
                <span className="absolute inset-0 text-[var(--hot-pink)] animate-pulse opacity-70 -translate-x-1 translate-y-1">
                  {glitchText}
                </span>
                <span className="absolute inset-0 text-[var(--pixel-orange)] animate-pulse opacity-50 translate-x-1 -translate-y-1">
                  {glitchText}
                </span>
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-[var(--neon-green)] via-[var(--pixel-orange)] to-[var(--hot-pink)] mx-auto mb-6"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="font-pixel text-2xl md:text-3xl text-[var(--pixel-orange)] mb-4">
              PAGE NOT FOUND
            </h2>
            <p className="font-retro text-lg text-[var(--light-grey)] mb-6 max-w-md mx-auto leading-relaxed">
              The page you're looking for has been moved to another dimension or doesn't exist in this reality.
            </p>
          </div>

          {/* Error Details Box */}
          <div className="bg-[var(--charcoal-grey)]/30 border border-[var(--hot-pink)]/30 rounded-lg p-6 mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <Zap className="w-6 h-6 text-[var(--hot-pink)]" />
              <span className="font-pixel text-lg text-[var(--hot-pink)]">SYSTEM ERROR</span>
            </div>
            <div className="space-y-2 font-retro text-sm text-[var(--light-grey)]">
              <div>ERROR_CODE: 404</div>
              <div>STATUS: RESOURCE_NOT_FOUND</div>
              <div>LOCATION: /dev/null</div>
              <div>SUGGESTION: TRY_DIFFERENT_PATH</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate('/')}
              className="font-pixel text-sm bg-[var(--neon-green)]/10 text-[var(--neon-green)] border-2 border-[var(--neon-green)] px-8 py-4 hover:bg-[var(--neon-green)] hover:text-[var(--dark-navy)] transition-all duration-300 transform hover:scale-105"
            >
              <Home className="w-5 h-5 mr-3" />
              RETURN HOME
            </Button>
            
            <Button
              onClick={() => window.history.back()}
              className="font-pixel text-sm bg-[var(--pixel-orange)]/10 text-[var(--pixel-orange)] border-2 border-[var(--pixel-orange)] px-8 py-4 hover:bg-[var(--pixel-orange)] hover:text-[var(--dark-navy)] transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              GO BACK
            </Button>
          </div>

          {/* Additional Navigation */}
          <div className="mt-12 pt-8 border-t border-[var(--neon-green)]/20">
            <p className="font-retro text-sm text-[var(--light-grey)] mb-4">
              Or explore these sections:
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/#portfolio')}
                className="font-retro text-sm text-[var(--hot-pink)] hover:text-[var(--neon-green)] transition-colors duration-200"
              >
                → Portfolio
              </button>
              <button
                onClick={() => navigate('/#skills')}
                className="font-retro text-sm text-[var(--hot-pink)] hover:text-[var(--neon-green)] transition-colors duration-200"
              >
                → Skills
              </button>
              <button
                onClick={() => navigate('/#contact')}
                className="font-retro text-sm text-[var(--hot-pink)] hover:text-[var(--neon-green)] transition-colors duration-200"
              >
                → Contact
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
