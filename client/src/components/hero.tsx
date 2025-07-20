import CountingLevel from "./counting-level";
import TetrisGame from "./tetris-game";

export default function Hero() {
  const scrollToPortfolio = () => {
    const element = document.getElementById("portfolio");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="flex items-center justify-center relative scanline-overlay py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-11">
        <div className="grid lg:grid-cols-2 gap-12 items-center pt-20 lg:pt-0">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="font-pixel text-[var(--neon-green)] text-base sm:text-sm md:text-xs mb-4 glow-text">
              PLAYER ONE
            </div>
            <h1 className="font-pixel text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              <span className="text-[var(--light-grey)]">FRONTEND </span>
              <span className="text-[var(--pixel-orange)]">DEVELOPER </span>
              <CountingLevel targetLevel={99} duration={8000} />
            </h1>
            <div className="font-retro text-lg md:text-xl mb-8 leading-relaxed">
              <p className="mb-4">
                Hi, I'm Sushil - a passionate frontend developer who crafts pixel-perfect digital experiences.
              </p>
              <p>I specialize in React, Vue, and modern JavaScript frameworks.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
              <button
                onClick={scrollToPortfolio}
                className="retro-button retro-button-green glitch-hover px-6 py-3 text-sm font-pixel"
              >
                VIEW PORTFOLIO
              </button>
              <a href="/404-test" className="retro-button retro-button-outline-pink glitch-hover px-6 py-3 text-sm font-pixel">
                DOWNLOAD CV
              </a>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative">
              <TetrisGame />
            </div>

            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-[var(--pixel-orange)] pixel-decorative"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
