import React from 'react';
import { format } from 'date-fns';
import { Image, FileText, Music, Video, Download } from 'lucide-react';
import { Message } from '../types';
import { clsx } from 'clsx';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isFromClient = message.isFromClient;
  
  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className={clsx(
      "flex mb-4",
      isFromClient ? "justify-start" : "justify-end"
    )}>
      <div className={clsx(
        "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
        isFromClient 
          ? "bg-gray-100 text-gray-900" 
          : "bg-emerald-600 text-white"
      )}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium opacity-75">
            {message.sender}
          </span>
          <span className="text-xs opacity-75">
            {format(message.timestamp, 'HH:mm')}
          </span>
        </div>
        
        {message.isMedia ? (
          <div className="flex items-center space-x-2">
            {getMediaIcon(message.mediaType || 'document')}
            <span className="text-sm">
              {message.mediaType === 'image' ? 'Image' : 
               message.mediaType === 'document' ? 'Document' :
               message.mediaType === 'audio' ? 'Audio' :
               message.mediaType === 'video' ? 'Video' : 'Media'}
            </span>
            {message.mediaUrl && (
              <a 
                href={message.mediaUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        )}
      </div>
    </div>
  );
}