import React from 'react';
import { Message } from '@/types';
import { Icon } from '@/components/ui/Icon';

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLast = false
}) => {
  const isUser = message.role === 'user';
  
  // Format message content to handle markdown-like syntax
  const formatContent = (content: string) => {
    // Replace ** with bold
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace * with italic
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace newlines with <br>
    formattedContent = formattedContent.replace(/\n/g, '<br>');
    
    // Replace URLs with links
    formattedContent = formattedContent.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>'
    );
    
    return formattedContent;
  };
  
  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <Icon name="idea" size="sm" />
          </div>
        </div>
      )}
      
      <div
        className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
          isUser
            ? 'bg-primary text-white rounded-tr-none'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-700'
        } ${isLast ? 'animate-pulse-slow' : ''}`}
      >
        <div
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
          className="prose prose-sm max-w-none dark:prose-invert"
        />
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white">
            <Icon name="user" size="sm" />
          </div>
        </div>
      )}
    </div>
  );
};