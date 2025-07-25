import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Portfolio from "@/components/portfolio";
import Skills from "@/components/skills";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import ScanlineOverlay from "@/components/scanline-overlay";
import AnimatedBackground from "@/components/animated-background";
import FloatingCodeSymbols from "@/components/floating-code-symbols";
import RetroParticles from "@/components/retro-particles";
import SnakeGame from "@/components/snake-game";
import VintageOverlay from "@/components/vintage-overlay";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--dark-navy)] text-[var(--light-grey)] font-retro overflow-x-hidden relative">
      <VintageOverlay />
      <AnimatedBackground />
      <RetroParticles />
      <FloatingCodeSymbols />
      <div className="absolute top-4 left-4 z-0">
        <SnakeGame />
      </div>
      <ScanlineOverlay />
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <Portfolio />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
