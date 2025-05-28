'use client';

import React from 'react';
import { IdeaSummary } from '@/types';
import { Button } from '@/components/ui/Button';

interface ProjectSummaryProps {
  summary: IdeaSummary;
  onProceedToBuild: () => void;
  isLoading: boolean;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({
  summary,
  onProceedToBuild,
  isLoading = false,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Project Specification</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Purpose</h3>
          <p className="text-gray-700">{summary.purpose}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Target Audience</h3>
          <p className="text-gray-700">{summary.target_audience}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Key Features</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {summary.key_features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Design Preferences</h3>
          <div className="pl-5 space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Color Scheme:</span> {summary.design_preferences.color_scheme}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Style:</span> {summary.design_preferences.style}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Layout:</span> {summary.design_preferences.layout}
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Content Sections</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {summary.content_sections.map((section, index) => (
              <li key={index}>{section}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-8">
        <Button
          variant="primary"
          onClick={onProceedToBuild}
          isLoading={isLoading}
          className="w-full"
        >
          Proceed to Build Stage
        </Button>
        <p className="text-sm text-gray-500 mt-2 text-center">
          This specification will be used to guide the build process
        </p>
      </div>
    </div>
  );
};