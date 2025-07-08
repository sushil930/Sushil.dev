import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['/api/projects', id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--dark-navy)] flex items-center justify-center">
        <div className="text-[var(--neon-green)] font-retro text-lg">LOADING PROJECT...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[var(--dark-navy)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[var(--pixel-orange)] font-retro text-lg mb-4">PROJECT NOT FOUND</div>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>
        </div>
      </div>
    );
  }

  const techList = project.technologies.split(',').map(tech => tech.trim());

  return (
    <div className="min-h-screen bg-[var(--dark-navy)] text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mb-8 text-[var(--neon-green)] hover:text-[var(--pixel-orange)]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>

          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-retro text-[var(--neon-green)] mb-4">
              {project.title}
            </h1>
            <div className="flex items-center gap-4 text-[var(--light-grey)] mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Project Details Card */}
          <Card className="bg-[var(--dark-navy)] border-[var(--neon-green)] border-2 mb-8">
            <CardHeader>
              <CardTitle className="text-[var(--pixel-orange)] font-retro">
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-[var(--neon-green)] mb-2">Description</h3>
                  <p className="text-[var(--light-grey)] leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-lg font-semibold text-[var(--neon-green)] mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {techList.map((tech, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="bg-[var(--pixel-orange)] text-[var(--dark-navy)] font-retro"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Project Links */}
                <div>
                  <h3 className="text-lg font-semibold text-[var(--neon-green)] mb-3">Links</h3>
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <Button 
                        asChild
                        className="bg-[var(--neon-green)] text-[var(--dark-navy)] hover:bg-[var(--pixel-orange)]"
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button 
                        asChild
                        variant="outline"
                        className="border-[var(--pixel-orange)] text-[var(--pixel-orange)] hover:bg-[var(--pixel-orange)] hover:text-[var(--dark-navy)]"
                      >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          Source Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Image Placeholder */}
          <Card className="bg-[var(--dark-navy)] border-[var(--pixel-orange)] border-2">
            <CardHeader>
              <CardTitle className="text-[var(--neon-green)] font-retro">
                Project Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-[var(--dark-navy)] to-[var(--charcoal-grey)] rounded-lg border-2 border-[var(--neon-green)] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[var(--pixel-orange)] font-retro text-2xl mb-2">
                    [{project.title}]
                  </div>
                  <div className="text-[var(--light-grey)] text-sm">
                    Project Preview Coming Soon
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}