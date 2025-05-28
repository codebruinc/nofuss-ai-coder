'use client';

import React, { useEffect, useState } from 'react';
import { Project } from '@/types';
import { BoltClient } from '@/lib/bolt/client';
import { Button } from '@/components/ui/Button';

interface DeployChatProps {
  project: Project;
}

export function DeployChat({ project }: DeployChatProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Initialize the DeployHelper chat
    const initializeDeployHelper = async () => {
      try {
        setIsLoading(true);
        
        // Get the initial messages for the DeployHelper role
        const initialMessages = BoltClient.getDeployHelperMessages(project);
        setMessages(initialMessages);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing DeployHelper:', err);
        setError('Failed to initialize the deployment helper. Please try again.');
        setIsLoading(false);
      }
    };

    initializeDeployHelper();
  }, [project]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isSending) return;

    try {
      setIsSending(true);
      
      // Add the user message to the chat
      const userMessage = {
        role: 'user',
        content: userInput
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setUserInput('');
      
      // Send the message to the API
      const response = await fetch('/api/deploy/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          projectId: project.id
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      // Add the assistant response to the chat
      setMessages(prevMessages => [...prevMessages, {
        role: 'assistant',
        content: data.content
      }]);
      
      setIsSending(false);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-red-700 mb-2">Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button
          variant="secondary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Initializing deployment helper...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="h-full flex flex-col">
          <div className="flex-1 p-4 overflow-auto">
            {messages.filter(message => message.role !== 'system').map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'assistant' ? 'flex' : ''}`}>
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3 flex-shrink-0">
                    <span>D</span>
                  </div>
                )}
                <div className={`p-4 rounded-lg ${
                  message.role === 'assistant' 
                    ? 'bg-gray-100 flex-1' 
                    : 'bg-blue-50 ml-auto'
                }`}>
                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="relative">
              <textarea 
                className="w-full border border-gray-300 rounded-lg p-3 pr-12 resize-none"
                rows={3}
                placeholder="Type your message here..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
              ></textarea>
              <button 
                className={`absolute right-3 bottom-3 rounded-full w-8 h-8 flex items-center justify-center ${
                  isSending || !userInput.trim() 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-500 text-white'
                }`}
                onClick={handleSendMessage}
                disabled={isSending || !userInput.trim()}
              >
                {isSending ? (
                  <span className="animate-spin">⟳</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to format message content with Markdown
function formatMessage(content: string): string {
  // Simple markdown formatting
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/## (.*?)\n/g, '<h2>$1</h2>')
    .replace(/# (.*?)\n/g, '<h1>$1</h1>');
}