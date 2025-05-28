'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIdeaChat } from '@/hooks/useIdeaChat';
import { ChatInterface } from '@/components/idea/ChatInterface';
import { ProjectSummary } from '@/components/idea/ProjectSummary';
import { LoadingState } from '@/components/idea/LoadingState';
import { IdeaSummary } from '@/types';

export default function IdeaClarificationPage({ params }: { params: { id: string } }) {
  const { messages, isLoading, error, sendMessage, exportToSummary } = useIdeaChat(params.id);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [summary, setSummary] = useState<IdeaSummary | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  // Fetch project data to check if we already have a summary
  useEffect(() => {
    const fetchProject = async () => {
      setIsLoadingProject(true);
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.project.idea_summary) {
            setSummary(data.project.idea_summary);
          }
        }
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setIsLoadingProject(false);
      }
    };
    
    fetchProject();
  }, [params.id]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleFinalize = async () => {
    setIsFinalizing(true);
    try {
      const generatedSummary = await exportToSummary();
      if (generatedSummary) {
        setSummary(generatedSummary);
      }
    } catch (err) {
      console.error('Error finalizing idea:', err);
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleProceedToBuild = () => {
    setIsTransitioning(true);
    // Log the transition to the build stage
    fetch(`/api/idea/export/${params.id}`)
      .then(() => {
        router.push(`/projects/${params.id}/build`);
      })
      .catch(err => {
        console.error('Error transitioning to build stage:', err);
        setIsTransitioning(false);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Idea Clarification</h1>
        
        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        {isLoadingProject ? (
          <LoadingState message="Loading project details..." />
        ) : isTransitioning ? (
          <LoadingState message="Transitioning to Build Stage..." />
        ) : summary ? (
          <ProjectSummary
            summary={summary}
            onProceedToBuild={handleProceedToBuild}
            isLoading={isTransitioning}
          />
        ) : (
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onFinalize={handleFinalize}
            isFinalizing={isFinalizing}
          />
        )}
      </div>
    </div>
  );
}