import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ProjectCard } from '../../lib/types';

const fetchProjects = async (): Promise<ProjectCard[]> => {
  const response = await fetch('/api/projects');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const deleteProject = async (id: string) => {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete project');
  }
  return response.json();
};

const ManageProjects: React.FC = () => {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const queryClient = useQueryClient();
  const { data: projects, isLoading, error } = useQuery<ProjectCard[]>({ 
    queryKey: ['/api/projects'], 
    queryFn: fetchProjects 
  });

    const deleteMutation = useMutation({ 
    mutationFn: deleteProject,
    onSuccess: (data) => {
      console.log('Project deleted successfully:', data);
      setFeedback({ type: 'success', message: data.message || 'Project deleted successfully!' });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error: Error) => {
      console.error('Error deleting project:', error);
      setFeedback({ type: 'error', message: error.message || 'An unknown error occurred.' });
    },
    onMutate: () => {
      setFeedback(null);
    }
  });

    const handleDelete = (id: string | number | undefined) => {
    console.log('Attempting to delete project with ID:', id);
    if (typeof id !== 'string') {
        console.error('Invalid project ID for deletion');
        return;
    }
        if (window.confirm('Are you sure you want to delete this project?')) {
      console.log('User confirmed deletion for ID:', id);
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="bg-[var(--dark-navy)] text-[var(--light-grey)] p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto my-8">
            <h2 className="font-pixel text-2xl text-[var(--neon-green)] mb-6 border-b-2 border-[var(--pixel-orange)] pb-2">Manage Projects</h2>
      {feedback && (
        <div className={`p-4 mb-4 rounded-md font-retro ${feedback.type === 'success' ? 'bg-green-900/50 text-green-300 border border-green-500' : 'bg-red-900/50 text-red-300 border border-red-500'}`}>
          {feedback.message}
        </div>
      )}
      <div className="space-y-4">
        {projects?.map((project) => (
          <div key={project.id} className="flex items-center justify-between bg-[var(--charcoal-grey)] p-4 rounded-md border border-[var(--neon-green)]/30">
            <div>
              <h3 className="font-pixel text-lg text-[var(--pixel-orange)]">{project.title}</h3>
              <p className="font-retro text-sm text-[var(--light-grey)]/80">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/edit-project/${project.id}`}
                className="retro-button font-pixel text-xs text-[var(--neon-green)] border-2 border-[var(--neon-green)] px-4 py-2 hover:bg-[var(--neon-green)] hover:text-[var(--dark-navy)] transition-colors duration-200"
              >
                EDIT
              </Link>
              <button
                onClick={() => handleDelete(project.id)}
                disabled={typeof project.id !== 'string' || (deleteMutation.isPending && typeof project.id === 'string' && deleteMutation.variables === project.id)}
                className="retro-button font-pixel text-xs text-[var(--hot-pink)] border-2 border-[var(--hot-pink)] px-4 py-2 hover:bg-[var(--hot-pink)] hover:text-[var(--dark-navy)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending && typeof project.id === 'string' && deleteMutation.variables === project.id ? 'DELETING...' : 'DELETE'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProjects;
