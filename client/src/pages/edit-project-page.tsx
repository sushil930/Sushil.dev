import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import AddProjectForm from '../components/admin/add-project-form';
import { Project } from '@shared/schema';

const fetchProject = async (id: string): Promise<Project> => {
  const response = await fetch(`/api/projects/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network response was not ok' }));
    throw new Error(errorData.message || 'Failed to fetch project');
  }
  return response.json();
};

const EditProjectPage = () => {
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const { data: project, isLoading, isError, error } = useQuery<Project>({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: !!projectId,
  });

  if (isLoading) {
    return <div className="text-center py-10 font-pixel text-[var(--neon-green)]">Loading project for editing...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 font-pixel text-red-500">Error loading project: {error instanceof Error ? error.message : 'An unknown error occurred.'}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-pixel text-3xl md:text-4xl text-[var(--neon-green)] mb-8 text-center">
        Edit Project
      </h1>
      {project && <AddProjectForm initialData={project} projectId={project.id} />}
    </div>
  );
};

export default EditProjectPage;
