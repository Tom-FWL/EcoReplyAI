import { Message } from '../types';

// Define the desired output structure
export interface StructuredChatMessage {
  sender: string;
  message: string;
  timestamp: string; // ISO format
}

// Keep the internal parsed message structure for intermediate processing if needed
export interface ParsedMessageInternal extends StructuredChatMessage {
 isMedia: boolean;
  mediaType?: 'image' | 'document' | 'audio' | 'video'; // Optional for internal use
}

export class WhatsAppParser {
  static parseWhatsAppExport(content: string): ParsedMessage[] {
    const messages: ParsedMessage[] = [];
    const lines = content.split('\n');
    
    // WhatsApp export format: [DD/MM/YYYY, HH:MM:SS] Sender Name: Message content
    const messageRegex = /^\[(\d{1,2}\/\d{1,2}\/\d{4}),\s(\d{1,2}:\d{2}:\d{2})\]\s([^:]+):\s(.+)$/;
    
    for (const line of lines) {
      const match = line.match(messageRegex);
      if (match) {
        const [, date, time, sender, text] = match;
        
        // Parse date and time
        const [day, month, year] = date.split('/').map(Number);
        const [hours, minutes, seconds] = time.split(':').map(Number);
        const timestamp = new Date(year, month - 1, day, hours, minutes, seconds);

        // Check if message contains media
        const isMedia = text.includes('<Media omitted>') || 
                        text.includes('document omitted') ||
                        text.includes('image omitted') ||
                        text.includes('audio omitted') ||
                        text.includes('video omitted');
        
        // Format the timestamp to ISO string
        const isoTimestamp = timestamp.toISOString();

        let mediaType: 'image' | 'document' | 'audio' | 'video' | undefined;
        if (isMedia) {
          if (text.includes('image')) mediaType = 'image';
          else if (text.includes('document')) mediaType = 'document';
          else if (text.includes('audio')) mediaType = 'audio';
          else if (text.includes('video')) mediaType = 'video';
        } else {
          // If not media, include the message text
        }        
        
        messages.push({ 
          sender: sender.trim(),
          text: text.trim(),
          timestamp,
          isMedia,
          mediaType
        });
      }
    }
    
    return messages;
  }
  
  static extractClientInfo(messages: ParsedMessage[]): { clientName: string; clientPhone: string } {
    // Extract client information from parsed messages
    const senders = messages.map(msg => msg.sender);
    const uniqueSenders = [...new Set(senders)];
    
    // Assume the first sender that's not "You" is the client
    const clientName = uniqueSenders.find(sender => sender !== 'You') || 'Unknown Client';
    
    return {
      clientName,
      clientPhone: 'Unknown' // Would be extracted from filename or contact info
    };
  }
  
  static generateChatTitle(messages: ParsedMessage[]): string {
    if (messages.length === 0) return 'Empty Chat';
    
    const firstMessage = messages[0];
    const preview = firstMessage.text.substring(0, 50);
    
    return preview.length < firstMessage.text.length ? `${preview}...` : preview;
  }
}