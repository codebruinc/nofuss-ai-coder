'use client';

import { useState } from 'react';
import { Message, ApiResponse, ChatResponse } from '@/types';

export function useIdeaChat(projectId: string) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: `You are an expert web development consultant who helps users clarify their website requirements.
Your goal is to help users refine their website ideas into clear, specific project specifications.
Ask questions to understand their needs, target audience, desired features, and design preferences.
Guide the conversation to extract specific details about:
1. Website purpose and goals
2. Target audience
3. Key features and functionality
4. Design preferences (colors, style, layout)
5. Content sections needed

At the end of the conversation, you'll help create a structured specification that will be used to build their website.`
    },
    {
      role: 'assistant',
      content: 'Hi there! I\'m here to help you clarify your website requirements. What kind of website would you like to build? Please describe your idea in a few sentences.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    const userMessage: Message = {
      role: 'user',
      content
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/idea/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          messages: [...messages, userMessage],
        }),
      });
      
      if (!response.ok) {
        const errorData: ApiResponse<null> = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
      
      const data: ChatResponse = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      return assistantMessage;
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending the message');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const exportToSummary = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a special message to ask GPT-4o to generate a summary
      const summaryRequestMessage: Message = {
        role: 'user',
        content: `Based on our conversation, please create a structured summary of the website requirements in the following JSON format:
{
  "purpose": "Brief description of the website's purpose",
  "target_audience": "Description of the target audience",
  "key_features": ["Feature 1", "Feature 2", "Feature 3"],
  "design_preferences": {
    "color_scheme": "Description of color preferences",
    "style": "Description of style (e.g., modern, classic, minimalist)",
    "layout": "Description of layout preferences"
  },
  "content_sections": ["Section 1", "Section 2", "Section 3"]
}
Please provide ONLY the JSON with no additional text.`
      };
      
      // Send the summary request to the API
      const response = await fetch('/api/idea/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          messages: [...messages, summaryRequestMessage],
          isSummaryRequest: true,
        }),
      });
      
      if (!response.ok) {
        const errorData: ApiResponse<null> = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }
      
      const data: ChatResponse = await response.json();
      
      // Parse the JSON response
      let summary;
      try {
        // Extract JSON if it's wrapped in code blocks or has extra text
        const jsonContent = data.response.replace(/```json\s*|\s*```/g, '').trim();
        summary = JSON.parse(jsonContent);
      } catch (err) {
        console.error('Error parsing summary JSON:', err);
        throw new Error('Failed to parse summary response');
      }
      
      // Save the summary to the project in Supabase
      const saveResponse = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea_summary: summary,
        }),
      });
      
      if (!saveResponse.ok) {
        const errorData: ApiResponse<null> = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to save summary');
      }
      
      return summary;
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the summary');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    exportToSummary,
  };
}