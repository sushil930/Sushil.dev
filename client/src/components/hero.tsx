import CountingLevel from "./counting-level";

export default function Hero() {
  const scrollToPortfolio = () => {
    const element = document.getElementById("portfolio");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative scanline-overlay pt-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="font-pixel text-[var(--neon-green)] text-xs mb-4 glow-text">
              PLAYER ONE
            </div>
            <h1 className="font-pixel text-2xl md:text-3xl lg:text-4xl mb-6 leading-relaxed">
              <span className="text-[var(--light-grey)]">FRONTEND</span><br />
              <span className="text-[var(--pixel-orange)]">DEVELOPER</span><br />
              <CountingLevel targetLevel={99} duration={8000} />
            </h1>
            <div className="font-retro text-lg md:text-xl mb-8 leading-relaxed">
              <p className="mb-4">
                Hi, I'm Sushil - a passionate frontend developer who crafts pixel-perfect digital experiences.
              </p>
              <p>I specialize in React, Vue, and modern JavaScript frameworks.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToPortfolio}
                className="retro-button retro-button-green glitch-hover"
              >
                VIEW PORTFOLIO
              </button>
              <button className="retro-button retro-button-outline-pink glitch-hover">
                DOWNLOAD CV
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Modern developer workspace with multiple monitors"
                className="w-full h-auto rounded-lg border-4 border-[var(--neon-green)] shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-navy)] via-transparent to-transparent opacity-50 rounded-lg"></div>
            </div>
            {/* Pixel decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[var(--neon-green)] pixel-decorative"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[var(--hot-pink)] pixel-decorative"></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-[var(--pixel-orange)] pixel-decorative"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
