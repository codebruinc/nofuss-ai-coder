'use client';

import { useState, useEffect } from 'react';
import { Project, ApiResponse, ProjectsResponse } from '@/types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        const errorData: ApiResponse<null> = await response.json();
        throw new Error(errorData.error || 'Failed to fetch projects');
      }
      
      const data: ProjectsResponse = await response.json();
      setProjects(data.projects || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching projects');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (name: string, description: string = '') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });
      
      if (!response.ok) {
        const errorData: ApiResponse<null> = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }
      
      const data = await response.json();
      
      // Refresh the projects list
      await fetchProjects();
      
      return data.project;
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the project');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
  };
}