'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

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

interface DeploymentInstructionsProps {
  instructions: DeploymentInstructions;
  onBack: () => void;
}

export function DeploymentInstructions({ instructions, onBack }: DeploymentInstructionsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <Button
          variant="secondary"
          onClick={onBack}
          className="mb-4"
        >
          ← Back to Options
        </Button>
        <h2 className="text-2xl font-bold mb-2">{instructions.title}</h2>
        <p className="text-gray-600">{instructions.description}</p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Step-by-Step Instructions</h3>
        <div className="space-y-6">
          {instructions.steps.map((step, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">{step.title}</h4>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="text-gray-700">{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {instructions.resources.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Additional Resources</h3>
          <ul className="bg-gray-50 rounded-lg p-4">
            {instructions.resources.map((resource, index) => (
              <li key={index} className="mb-2">
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}