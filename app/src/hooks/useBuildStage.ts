'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Project, IdeaSummary } from '@/types';
import { BoltClient } from '@/lib/bolt/client';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface UseBuildStageProps {
  projectId: string;
}

interface UseBuildStageReturn {
  project: Project | null;
  ideaSummary: IdeaSummary | null;
  isLoading: boolean;
  error: string | null;
  saveProgress: () => Promise<boolean>;
  proceedToDeployment: () => void;
}

export function useBuildStage({ projectId }: UseBuildStageProps): UseBuildStageReturn {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [ideaSummary, setIdeaSummary] = useState<IdeaSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the project data from the API
        const response = await fetch(`/api/idea/export/${projectId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        
        const data = await response.json();
        
        if (!data.summary || !data.project) {
          throw new Error('Invalid project data');
        }
        
        setProject(data.project);
        setIdeaSummary(data.summary);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Failed to load project data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const saveProgress = async (): Promise<boolean> => {
    if (!project) {
      setError('No project data available');
      return false;
    }

    try {
      // Save the current state of the bolt.new project
      const success = await BoltClient.saveProjectState(project.bolt_project_id);
      
      if (!success) {
        throw new Error('Failed to save project state');
      }
      
      // Update the project in Supabase
      const supabase = createBrowserSupabaseClient();
      
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);
      
      if (updateError) {
        throw updateError;
      }
      
      // Log the save action in project history
      const { error: historyError } = await supabase
        .from('project_history')
        .insert({
          project_id: projectId,
          action: 'save_build_progress',
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
      
      if (historyError) {
        console.error('Error logging save action:', historyError);
        // Continue even if logging fails
      }
      
      return true;
    } catch (err) {
      console.error('Error saving progress:', err);
      setError('Failed to save progress. Please try again.');
      return false;
    }
  };

  const proceedToDeployment = () => {
    // Save progress before proceeding to deployment
    saveProgress().then(success => {
      if (success) {
        router.push(`/projects/${projectId}/deploy`);
      }
    });
  };

  return {
    project,
    ideaSummary,
    isLoading,
    error,
    saveProgress,
    proceedToDeployment
  };
}