import { useState, useEffect } from 'react';
import { Project } from '@/types';

interface UseDeployStageProps {
  projectId: string;
}

interface UseDeployStageReturn {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
  deploymentOptions: DeploymentOption[];
  selectedOption: string | null;
  setSelectedOption: (option: string | null) => void;
  deploymentInstructions: DeploymentInstructions | null;
  isLoadingInstructions: boolean;
  fetchDeploymentInstructions: (platform: string) => Promise<void>;
}

interface DeploymentOption {
  id: string;
  name: string;
  description: string;
  beginner_friendly: boolean;
  free_tier: boolean;
  steps: string[];
}

interface DeploymentStep {
  title: string;
  description: string;
  details: string[];
}

interface DeploymentResource {
  title: string;
  url: string;
}

interface DeploymentInstructions {
  title: string;
  description: string;
  steps: DeploymentStep[];
  resources: DeploymentResource[];
}

export function useDeployStage({ projectId }: UseDeployStageProps): UseDeployStageReturn {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deploymentOptions, setDeploymentOptions] = useState<DeploymentOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [deploymentInstructions, setDeploymentInstructions] = useState<DeploymentInstructions | null>(null);
  const [isLoadingInstructions, setIsLoadingInstructions] = useState(false);

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        
        const data = await response.json();
        setProject(data.project);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId]);

  // Fetch deployment options
  useEffect(() => {
    const fetchDeploymentOptions = async () => {
      try {
        const response = await fetch('/api/deploy/options');
        
        if (!response.ok) {
          throw new Error('Failed to fetch deployment options');
        }
        
        const data = await response.json();
        setDeploymentOptions(data.options);
      } catch (err) {
        console.error('Error fetching deployment options:', err);
        // Don't set error state here, as it would override the project loading error
      }
    };
    
    if (project) {
      fetchDeploymentOptions();
    }
  }, [project]);

  // Fetch deployment instructions for a specific platform
  const fetchDeploymentInstructions = async (platform: string) => {
    try {
      setIsLoadingInstructions(true);
      
      const response = await fetch(`/api/deploy/instructions/${platform}?projectId=${projectId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch deployment instructions');
      }
      
      const data = await response.json();
      setDeploymentInstructions(data.instructions);
      setSelectedOption(platform);
      setIsLoadingInstructions(false);
    } catch (err) {
      console.error('Error fetching deployment instructions:', err);
      setError('Failed to load deployment instructions. Please try again.');
      setIsLoadingInstructions(false);
    }
  };

  return {
    project,
    isLoading,
    error,
    deploymentOptions,
    selectedOption,
    setSelectedOption,
    deploymentInstructions,
    isLoadingInstructions,
    fetchDeploymentInstructions
  };
}