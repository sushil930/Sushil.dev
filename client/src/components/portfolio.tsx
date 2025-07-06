import { ProjectCard } from "@/lib/types";

const projects: ProjectCard[] = [
  {
    id: 1,
    title: "E-COMMERCE PLATFORM",
    description: "React • Redux • Stripe API",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 2,
    title: "ANALYTICS DASHBOARD",
    description: "Vue.js • D3.js • Firebase",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 3,
    title: "MOBILE GAME APP",
    description: "React Native • WebGL • Node.js",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 4,
    title: "SOCIAL PLATFORM",
    description: "Next.js • GraphQL • PostgreSQL",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 5,
    title: "CRYPTO TRADER",
    description: "React • Web3.js • Solidity",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 6,
    title: "PIXEL PORTFOLIO",
    description: "HTML5 • CSS3 • JavaScript",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-20 scanline-overlay">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-pixel text-xl md:text-2xl text-[var(--neon-green)] mb-4">
            PORTFOLIO
          </h2>
          <div className="font-retro text-lg text-[var(--light-grey)]">
            Check out my latest projects
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="mb-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded border-2 border-[var(--pixel-orange)]"
                />
              </div>
              <h3 className="font-pixel text-sm text-[var(--pixel-orange)] mb-2">
                {project.title}
              </h3>
              <p className="font-retro text-sm text-[var(--light-grey)] mb-4">
                {project.description}
              </p>
              <div className="flex justify-between items-center">
                <a
                  href={project.liveUrl}
                  className="retro-button retro-button-outline-green glitch-hover"
                >
                  VIEW LIVE
                </a>
                <a
                  href={project.codeUrl}
                  className="retro-button font-pixel text-xs text-[var(--hot-pink)] border-2 border-[var(--hot-pink)] px-4 py-2 hover:bg-[var(--hot-pink)] hover:text-[var(--dark-navy)] transition-colors duration-200"
                >
                  CODE
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
