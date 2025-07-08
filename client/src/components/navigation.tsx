import { useState } from "react";
import { useLocation } from "wouter";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, navigate] = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  const navigateToPage = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[var(--darker-blue)] border-b-4 border-[var(--neon-green)] z-40 scanline-overlay">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="font-pixel text-[var(--neon-green)] text-xs glow-text">
            ALEX.DEV
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="font-pixel text-xs text-[var(--light-grey)] hover:text-[var(--neon-green)] transition-colors duration-200"
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection("portfolio")}
              className="font-pixel text-xs text-[var(--light-grey)] hover:text-[var(--neon-green)] transition-colors duration-200"
            >
              PORTFOLIO
            </button>
            <button
              onClick={() => navigateToPage("/projects")}
              className="font-pixel text-xs text-[var(--light-grey)] hover:text-[var(--neon-green)] transition-colors duration-200"
            >
              PROJECTS
            </button>
            <button
              onClick={() => scrollToSection("skills")}
              className="font-pixel text-xs text-[var(--light-grey)] hover:text-[var(--neon-green)] transition-colors duration-200"
            >
              SKILLS
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="font-pixel text-xs text-[var(--light-grey)] hover:text-[var(--neon-green)] transition-colors duration-200"
            >
              CONTACT
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden font-pixel text-xs text-[var(--neon-green)] glitch-hover"
          >
            {isOpen ? "CLOSE" : "MENU"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 border-t-2 border-[var(--neon-green)] pt-4">
            <button
              onClick={() => scrollToSection("home")}
              className="block font-pixel text-xs text-[var(--light-grey)] hover:text-[var(--neon-green)] transition-colors duration-200"
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection("portfolio")}
              className="block font-pixel text-xs text-[var(--light-grey)] hover:text-[var(--neon-green)] transition-colors duration-200"
            >
              PORTFOLIO
            </button>
            <button
              onClick={() => navigateToPage("/projects")}
              className="block font-pixel text-xs text-[var(--light-grey)] hover:text-[var(--neon-green)] transition-colors duration-200"
            >
              PROJECTS
            </button>
            <button
              onClick={() => scrollToSection("skills")}
              className="block font-pixel text-xs text-[var(--light-grey)] hover:text-[var(--neon-green)] transition-colors duration-200"
            >
              SKILLS
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block font-pixel text-xs text-[var(--light-grey)] hover:text-[var(--neon-green)] transition-colors duration-200"
            >
              CONTACT
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
