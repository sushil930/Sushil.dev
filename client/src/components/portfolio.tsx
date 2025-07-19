import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";



export default function Portfolio() {
  const [, navigate] = useLocation();
  
  // Fetch real projects from API
  const { data: apiProjects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });



      const handleProjectClick = (projectId: string | number) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <section id="portfolio" className="py-20 scanline-overlay">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-pixel text-2xl md:text-3xl text-[var(--neon-green)] mb-4">
            PROJECTS
          </h2>
          <div className="font-retro text-lg text-[var(--light-grey)]">
            Check out my latest projects
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-[var(--neon-green)] font-retro">
            LOADING PROJECTS...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* API projects */}
            {apiProjects?.map((project) => (
              <div 
                key={`api-${project.id}`} 
                className="project-card cursor-pointer hover:scale-105 transition-transform duration-300 border-2 border-[var(--neon-green)]"
                onClick={() => project.id && handleProjectClick(project.id)}
              >
                <div className="mb-4 relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded border-2 border-[var(--pixel-orange)] group-hover:border-[var(--neon-green)] transition-colors duration-300"
                  />
                  <div className="absolute inset-0 bg-[var(--neon-green)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded">
                    <span className="font-pixel text-[var(--neon-green)] text-sm bg-[var(--dark-navy)]/80 px-4 py-2 rounded border border-[var(--neon-green)]">
                      CLICK TO VIEW DETAILS
                    </span>
                  </div>
                </div>
                <h3 className="font-pixel text-sm text-[var(--neon-green)] mb-2">
                  {project.title}
                </h3>
                <p className="font-retro text-sm text-[var(--light-grey)] mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  {project.liveUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.liveUrl, '_blank');
                      }}
                      className="retro-button retro-button-outline-green glitch-hover"
                    >
                      VIEW LIVE
                    </button>
                  )}
                  {project.githubUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.githubUrl, '_blank');
                      }}
                      className="retro-button font-pixel text-xs text-[var(--hot-pink)] border-2 border-[var(--hot-pink)] px-4 py-2 hover:bg-[var(--hot-pink)] hover:text-[var(--dark-navy)] transition-colors duration-200"
                    >
                      CODE
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
