import React, { useState, useEffect } from 'react';
import { ChatList } from '../components/ChatList';
import { ChatMessage } from '../components/ChatMessage';
import { AIReplyBox } from '../components/AIReplyBox';
import { Chat, Message } from '../types';
import { Search, Filter } from 'lucide-react';

export function Dashboard() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'taken_over' | 'converted'>('all');

  // Mock data - in real app, this would come from Firebase/Supabase
  useEffect(() => {
    const mockChats: Chat[] = [
      {
        id: '1',
        title: 'Paper bag inquiry for restaurant',
        clientName: 'Ahmad Restaurant',
        clientPhone: '+60123456789',
        status: 'active',
        tags: ['paper bag', 'F&B', 'restaurant'],
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 12,
        lastMessage: 'What are the minimum order quantities?',
        lastMessageAt: new Date()
      },
      {
        id: '2',
        title: 'Sampul Raya custom printing',
        clientName: 'Siti Wedding Services',
        clientPhone: '+60187654321',
        status: 'taken_over',
        tags: ['sampul raya', 'wedding', 'custom printing'],
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 8,
        lastMessage: 'Can you send samples?',
        lastMessageAt: new Date()
      },
      {
        id: '3',
        title: 'Bulk order for kampung event',
        clientName: 'Kampung Committee',
        clientPhone: '+60199876543',
        status: 'converted',
        tags: ['kampung', 'bulk order', 'event'],
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 25,
        lastMessage: 'Thank you for the delivery!',
        lastMessageAt: new Date()
      }
    ];
    setChats(mockChats);
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      // Mock messages for selected chat
      const mockMessages: Message[] = [
        {
          id: '1',
          chatId: selectedChatId,
          sender: 'Ahmad Restaurant',
          text: 'Hi, I need paper bags for my restaurant. Can you help?',
          timestamp: new Date(2024, 0, 15, 10, 30),
          isMedia: false,
          isFromClient: true
        },
        {
          id: '2',
          chatId: selectedChatId,
          sender: 'You',
          text: 'Hello! Yes, we can definitely help you with paper bags. What type of food service are you looking for?',
          timestamp: new Date(2024, 0, 15, 10, 35),
          isMedia: false,
          isFromClient: false
        },
        {
          id: '3',
          chatId: selectedChatId,
          sender: 'Ahmad Restaurant',
          text: 'We serve nasi lemak and other local dishes. Need eco-friendly bags.',
          timestamp: new Date(2024, 0, 15, 10, 40),
          isMedia: false,
          isFromClient: true
        },
        {
          id: '4',
          chatId: selectedChatId,
          sender: 'Ahmad Restaurant',
          text: 'What are the minimum order quantities?',
          timestamp: new Date(2024, 0, 15, 11, 0),
          isMedia: false,
          isFromClient: true
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedChatId]);

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || chat.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSendReply = (reply: string) => {
    if (selectedChatId) {
      const newMessage: Message = {
        id: Date.now().toString(),
        chatId: selectedChatId,
        sender: 'You',
        text: reply,
        timestamp: new Date(),
        isMedia: false,
        isFromClient: false
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  return (
    <div className="flex h-full">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Chats</h2>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="taken_over">Taken Over</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-y-auto p-4" style={{ height: 'calc(100vh - 200px)' }}>
          <ChatList
            chats={filteredChats}
            selectedChatId={selectedChatId || undefined}
            onSelectChat={setSelectedChatId}
          />
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedChat.clientName}</h3>
                  <p className="text-sm text-gray-600">{selectedChat.clientPhone}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedChat.status}
                    onChange={(e) => {
                      // Update chat status
                      setChats(prev => prev.map(chat => 
                        chat.id === selectedChatId 
                          ? { ...chat, status: e.target.value as Chat['status'] }
                          : chat
                      ));
                    }}
                    className="px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="taken_over">Taken Over</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>

            {/* AI Reply Box */}
            <AIReplyBox
              chatId={selectedChatId}
              messages={messages}
              onSendReply={handleSendReply}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat to start</h3>
              <p className="text-gray-600">Choose a conversation from the list to view messages and generate AI replies</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}