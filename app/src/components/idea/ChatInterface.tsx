'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Message } from '@/types';
import { Button } from '@/components/ui/Button';
import { ChatMessage } from '@/components/idea/ChatMessage';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Tooltip } from '@/components/ui/Tooltip';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => Promise<void>;
  onFinalize: () => Promise<void>;
  isFinalizing: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onFinalize,
  isFinalizing = false,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isReadyToFinalize, setIsReadyToFinalize] = useState(false);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Check if we have enough conversation to finalize
  useEffect(() => {
    // We need at least 3 user messages to consider the conversation ready to finalize
    const userMessageCount = messages.filter(m => m.role === 'user').length;
    setIsReadyToFinalize(userMessageCount >= 3);
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    await onSendMessage(input);
    setInput('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Card variant="elevated" className="flex flex-col h-[650px] animate-fade-in">
      {/* Chat Header */}
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-light/20 dark:bg-primary-dark/30 flex items-center justify-center mr-3">
            <Icon name="idea" className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Idea Clarification</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Describe your website idea and I'll help refine it into a clear specification
            </p>
          </div>
        </div>
      </CardHeader>
      
      {/* Chat Messages */}
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-1">
        {messages.filter(m => m.role !== 'system').map((message, index, arr) => (
          <ChatMessage
            key={index}
            message={message}
            isLast={index === arr.length - 1 && isLoading}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      
      {/* Input Area */}
      <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col space-y-3 w-full">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your website requirements..."
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-sm
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                transition-all duration-200"
              rows={3}
              disabled={isLoading || isFinalizing}
            />
            <Tooltip content="Press Enter to send, Shift+Enter for new line" position="top">
              <div className="absolute right-3 bottom-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </Tooltip>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              {isReadyToFinalize ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Ready to finalize! You can continue or finalize when ready.</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-info mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Continue the conversation to provide more details about your website idea.</span>
                </>
              )}
            </div>
            
            <div className="flex space-x-2 w-full sm:w-auto">
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim() || isFinalizing}
                size="sm"
                variant="secondary"
                icon={<Icon name="arrow-right" size="sm" />}
                iconPosition="right"
              >
                Send
              </Button>
              <Button
                variant="primary"
                onClick={onFinalize}
                disabled={isLoading || !isReadyToFinalize || isFinalizing}
                isLoading={isFinalizing}
                size="sm"
                icon={<Icon name="check" size="sm" />}
                iconPosition="left"
              >
                Finalize Idea
              </Button>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};