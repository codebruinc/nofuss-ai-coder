'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { DeploymentStage } from '@/components/deploy/DeploymentStage';
import { Project } from '@/types';

export default function DeployStagePage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch(`/api/projects/${params.id}`);
        
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
  }, [params.id]);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-red-700 mb-2">Error</h3>
            <p className="text-red-600 mb-4">{error || 'Project not found'}</p>
            <Button
              variant="secondary"
              onClick={handleGoToDashboard}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Deployment Stage</h1>
        <DeploymentStage project={project} />
      </div>
    </div>
  );
}