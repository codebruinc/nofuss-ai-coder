import { useState, useEffect } from 'react';
import { DeploymentStatus } from '@/types';

interface UseDeploymentStatusProps {
  projectId: string;
}

interface UseDeploymentStatusReturn {
  status: DeploymentStatus;
  deploymentUrl: string | null;
  isLoading: boolean;
  error: string | null;
  updateStatus: (status: DeploymentStatus, deploymentUrl?: string) => Promise<boolean>;
}

export function useDeploymentStatus({ projectId }: UseDeploymentStatusProps): UseDeploymentStatusReturn {
  const [status, setStatus] = useState<DeploymentStatus>('not_deployed');
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the current deployment status
  useEffect(() => {
    const fetchDeploymentStatus = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch(`/api/deploy/status?projectId=${projectId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch deployment status');
        }
        
        const data = await response.json();
        setStatus(data.status);
        setDeploymentUrl(data.deploymentUrl || null);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching deployment status:', err);
        setError('Failed to load deployment status. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchDeploymentStatus();
  }, [projectId]);

  // Update the deployment status
  const updateStatus = async (newStatus: DeploymentStatus, newDeploymentUrl?: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/deploy/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          status: newStatus,
          deploymentUrl: newDeploymentUrl
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update deployment status');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStatus(newStatus);
        if (newDeploymentUrl) {
          setDeploymentUrl(newDeploymentUrl);
        }
        return true;
      } else {
        throw new Error(data.error || 'Failed to update deployment status');
      }
    } catch (err) {
      console.error('Error updating deployment status:', err);
      setError('Failed to update deployment status. Please try again.');
      return false;
    }
  };

  return {
    status,
    deploymentUrl,
    isLoading,
    error,
    updateStatus
  };
}