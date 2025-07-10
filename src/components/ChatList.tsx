import React from 'react';
import { format } from 'date-fns';
import { MessageSquare, Clock, Tag } from 'lucide-react';
import { Chat } from '../types';
import { clsx } from 'clsx';

interface ChatListProps {
  chats: Chat[];
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
}

export function ChatList({ chats, selectedChatId, onSelectChat }: ChatListProps) {
  const getStatusColor = (status: Chat['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'taken_over': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Chat['status']) => {
    switch (status) {
      case 'active': return 'Active';
      case 'taken_over': return 'Taken Over';
      case 'converted': return 'Converted';
      default: return status;
    }
  };

  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={clsx(
            "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
            selectedChatId === chat.id
              ? "bg-emerald-50 border-emerald-200"
              : "bg-white border-gray-200 hover:border-gray-300"
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <h3 className="font-medium text-gray-900 truncate">{chat.clientName}</h3>
            </div>
            <span className={clsx(
              "px-2 py-1 rounded-full text-xs font-medium",
              getStatusColor(chat.status)
            )}>
              {getStatusLabel(chat.status)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {chat.lastMessage || 'No messages yet'}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{format(chat.updatedAt, 'MMM d, HH:mm')}</span>
            </div>
            <span>{chat.messageCount} messages</span>
          </div>
          
          {chat.tags.length > 0 && (
            <div className="flex items-center space-x-1 mt-2">
              <Tag className="w-3 h-3 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {chat.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {chat.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{chat.tags.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}