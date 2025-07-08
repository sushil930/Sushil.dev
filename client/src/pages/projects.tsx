import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Plus, Edit, Trash2 } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.string().min(1, 'Technologies are required'),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal(''))
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
}

export default function Projects() {
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      technologies: '',
      liveUrl: '',
      githubUrl: ''
    }
  });

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    }
  });

  const createProject = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      return apiRequest('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          technologies: data.technologies.split(',').map(t => t.trim())
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      form.reset();
      setShowForm(false);
      toast({ title: 'Project created successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to create project', variant: 'destructive' });
    }
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProjectFormData }) => {
      return apiRequest(`/api/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...data,
          technologies: data.technologies.split(',').map(t => t.trim())
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      form.reset();
      setIsEditing(null);
      toast({ title: 'Project updated successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to update project', variant: 'destructive' });
    }
  });

  const deleteProject = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/projects/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: 'Project deleted successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to delete project', variant: 'destructive' });
    }
  });

  const onSubmit = (data: ProjectFormData) => {
    if (isEditing) {
      updateProject.mutate({ id: isEditing, data });
    } else {
      createProject.mutate(data);
    }
  };

  const startEditing = (project: Project) => {
    setIsEditing(project.id);
    setShowForm(true);
    form.reset({
      title: project.title,
      description: project.description,
      technologies: Array.isArray(project.technologies) 
        ? project.technologies.join(', ') 
        : project.technologies,
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || ''
    });
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setShowForm(false);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-[var(--dark-navy)] text-[var(--light-grey)] font-retro">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[var(--neon-green)] mb-4 font-pixel">
              MY PROJECTS
            </h1>
            <p className="text-[var(--light-grey)] text-lg">
              A collection of my development work and experiments
            </p>
          </div>

          {/* Add New Project Button */}
          <div className="mb-8 text-center">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="retro-button-green"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showForm ? 'Cancel' : 'Add New Project'}
            </Button>
          </div>

          {/* Project Form */}
          {showForm && (
            <Card className="mb-8 bg-[var(--dark-navy)] border-[var(--neon-green)]">
              <CardHeader>
                <CardTitle className="text-[var(--neon-green)]">
                  {isEditing ? 'Edit Project' : 'Add New Project'}
                </CardTitle>
                <CardDescription className="text-[var(--light-grey)]">
                  {isEditing ? 'Update project details' : 'Fill in the details for your new project'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[var(--pixel-orange)]">Project Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="My Awesome Project"
                                className="bg-[var(--dark-navy)] border-[var(--light-grey)] text-[var(--light-grey)]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="technologies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[var(--pixel-orange)]">Technologies</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="React, TypeScript, Node.js"
                                className="bg-[var(--dark-navy)] border-[var(--light-grey)] text-[var(--light-grey)]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[var(--pixel-orange)]">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your project..."
                              className="bg-[var(--dark-navy)] border-[var(--light-grey)] text-[var(--light-grey)] min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="liveUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[var(--pixel-orange)]">Live URL (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://myproject.com"
                                className="bg-[var(--dark-navy)] border-[var(--light-grey)] text-[var(--light-grey)]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="githubUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[var(--pixel-orange)]">GitHub URL (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://github.com/username/repo"
                                className="bg-[var(--dark-navy)] border-[var(--light-grey)] text-[var(--light-grey)]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={createProject.isPending || updateProject.isPending}
                        className="retro-button-green"
                      >
                        {isEditing ? 'Update Project' : 'Create Project'}
                      </Button>
                      <Button
                        type="button"
                        onClick={cancelEditing}
                        className="retro-button-outline-pink"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Projects Grid */}
          {isLoading ? (
            <div className="text-center text-[var(--light-grey)]">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-[var(--light-grey)]">
              <p className="text-xl mb-4">No projects yet</p>
              <p>Add your first project to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: Project) => (
                <Card
                  key={project.id}
                  className="bg-[var(--dark-navy)] border-[var(--hot-pink)] hover:border-[var(--neon-green)] transition-colors group"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-[var(--neon-green)] text-lg group-hover:text-[var(--pixel-orange)] transition-colors">
                        {project.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(project)}
                          className="text-[var(--light-grey)] hover:text-[var(--neon-green)]"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteProject.mutate(project.id)}
                          className="text-[var(--light-grey)] hover:text-[var(--hot-pink)]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[var(--light-grey)] mb-4 text-sm">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(Array.isArray(project.technologies) 
                        ? project.technologies 
                        : project.technologies.split(',')
                      ).map((tech: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-[var(--hot-pink)] text-[var(--dark-navy)] text-xs"
                        >
                          {tech.trim()}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {project.liveUrl && (
                        <Button
                          size="sm"
                          asChild
                          className="retro-button-outline-green flex-1"
                        >
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Live
                          </a>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button
                          size="sm"
                          asChild
                          className="retro-button-outline-pink flex-1"
                        >
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-1" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}