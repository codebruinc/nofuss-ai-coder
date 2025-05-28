'use client';

import React from 'react';

interface DeploymentOption {
  id: string;
  name: string;
  description: string;
  beginner_friendly: boolean;
  free_tier: boolean;
  steps: string[];
}

interface DeploymentOptionsProps {
  options: DeploymentOption[];
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
}

export function DeploymentOptions({ options, selectedOption, onSelectOption }: DeploymentOptionsProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Choose a Deployment Option</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectOption(option.id)}
            className={`p-4 border rounded-lg flex flex-col items-start text-left transition-colors ${
              selectedOption === option.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="text-xl font-bold">{option.name}</div>
              <div className="flex space-x-2">
                {option.beginner_friendly && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Beginner-friendly
                  </span>
                )}
                {option.free_tier && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Free
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 mb-3">
              {option.description}
            </p>
            
            <div className="text-sm text-gray-500">
              <span className="font-medium">Quick steps:</span>
              <ul className="list-disc pl-5 mt-1">
                {option.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}