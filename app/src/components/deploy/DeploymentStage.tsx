'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project, DeploymentInstructions as DeploymentInstructionsType } from '@/types';
import { DeployChat } from '@/components/deploy/DeployChat';
import { DeploymentOptions } from '@/components/deploy/DeploymentOptions';
import { DeploymentInstructions } from '@/components/deploy/DeploymentInstructions';
import { DeploymentSuccess } from '@/components/deploy/DeploymentSuccess';
import { useDeployStage } from '@/hooks/useDeployStage';
import { useDeploymentStatus } from '@/hooks/useDeploymentStatus';
import { Button } from '@/components/ui/Button';

interface DeploymentStageProps {
  project: Project;
}

export function DeploymentStage({ project }: DeploymentStageProps) {
  const router = useRouter();
  const [view, setView] = useState<'chat' | 'options' | 'instructions' | 'success'>('chat');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<DeploymentInstructionsType | null>(null);
  
  const { 
    deploymentOptions,
    isLoadingInstructions,
    fetchDeploymentInstructions
  } = useDeployStage({ projectId: project.id });
  
  const {
    status,
    deploymentUrl,
    updateStatus
  } = useDeploymentStatus({ projectId: project.id });

  const handleSelectOption = async (optionId: string) => {
    setSelectedPlatform(optionId);
    await fetchDeploymentInstructions(optionId);
    setView('instructions');
  };

  const handleBackToOptions = () => {
    setView('options');
    setSelectedPlatform(null);
    setInstructions(null);
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleShowOptions = () => {
    setView('options');
  };

  const handleShowChat = () => {
    setView('chat');
  };

  const handleDeploymentSuccess = async (platform: string, url?: string) => {
    await updateStatus('deployed', url);
    setSelectedPlatform(platform);
    setView('success');
  };

  const renderContent = () => {
    switch (view) {
      case 'chat':
        return (
          <div className="h-[500px]">
            <DeployChat project={project} />
            <div className="mt-4 flex justify-end">
              <Button
                variant="secondary"
                onClick={handleShowOptions}
                className="mr-2"
              >
                View Deployment Options
              </Button>
              <Button
                variant="primary"
                onClick={handleGoToDashboard}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        );
      
      case 'options':
        return (
          <div>
            <DeploymentOptions
              options={deploymentOptions}
              selectedOption={selectedPlatform}
              onSelectOption={handleSelectOption}
            />
            <div className="mt-6 flex justify-between">
              <Button
                variant="secondary"
                onClick={handleShowChat}
              >
                Back to Chat
              </Button>
              <Button
                variant="primary"
                onClick={handleGoToDashboard}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        );
      
      case 'instructions':
        if (isLoadingInstructions) {
          return (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading deployment instructions...</p>
            </div>
          );
        }
        
        if (!instructions) {
          return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-red-700 mb-2">Error</h3>
              <p className="text-red-600 mb-4">Failed to load deployment instructions. Please try again.</p>
              <Button
                variant="secondary"
                onClick={handleBackToOptions}
              >
                Back to Options
              </Button>
            </div>
          );
        }
        
        return (
          <DeploymentInstructions
            instructions={instructions}
            onBack={handleBackToOptions}
          />
        );
      
      case 'success':
        return (
          <DeploymentSuccess
            projectName={project.name}
            deploymentUrl={deploymentUrl || undefined}
            platform={selectedPlatform || 'the selected platform'}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Project: {project.name}</h2>
        <p className="text-gray-600">{project.description}</p>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-700">
          Great job building your website! Now it's time to deploy it so everyone can see it online.
          Our DeployHelper will guide you through the process with beginner-friendly instructions.
        </p>
      </div>
      
      {renderContent()}
    </div>
  );
}