'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface DeploymentSuccessProps {
  projectName: string;
  deploymentUrl?: string;
  platform: string;
}

export function DeploymentSuccess({ projectName, deploymentUrl, platform }: DeploymentSuccessProps) {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleViewSite = () => {
    if (deploymentUrl) {
      window.open(deploymentUrl, '_blank');
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold text-green-700 mb-2">Deployment Successful!</h2>
      
      <p className="text-green-600 mb-6">
        Congratulations! Your website "{projectName}" has been successfully deployed to {platform}.
        {deploymentUrl ? ' You can now view your site online.' : ''}
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        {deploymentUrl && (
          <Button
            variant="primary"
            onClick={handleViewSite}
          >
            View Your Website
          </Button>
        )}
        
        <Button
          variant="secondary"
          onClick={handleGoToDashboard}
        >
          Return to Dashboard
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-white rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">What's Next?</h3>
        <ul className="text-left text-gray-600 space-y-2">
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Share your website with friends and family</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Gather feedback and make improvements</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Create another project on NoFuss AI Coder</span>
          </li>
        </ul>
      </div>
    </div>
  );
}