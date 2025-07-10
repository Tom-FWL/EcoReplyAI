export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Chat {
  id: string;
  title: string;
  clientName: string;
  clientPhone: string;
  status: 'active' | 'taken_over' | 'converted';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastMessage?: string;
  lastMessageAt?: Date;
}

export interface Message {
  id: string;
  chatId: string;
  sender: string;
  text: string;
  timestamp: Date;
  isMedia: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'document' | 'audio' | 'video';
  isFromClient: boolean;
}

export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  type: 'image' | 'document' | 'audio' | 'video';
  size: number;
  uploadedAt: Date;
  linkedChatIds: string[];
  tags: string[];
}

export interface AIReply {
  id: string;
  chatId: string;
  generatedText: string;
  status: 'pending' | 'approved' | 'rejected' | 'sent';
  createdAt: Date;
  editedText?: string;
}

export interface Deal {
  id: string;
  chatId: string;
  clientName: string;
  productType: string;
  estimatedValue: number;
  status: 'potential' | 'negotiating' | 'closed' | 'lost';
  convertedAt: Date;
  notes?: string;
}