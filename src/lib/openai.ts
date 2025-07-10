// OpenAI integration for AI reply generation
export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateReply(messages: Array<{sender: string; text: string; timestamp: Date}>, systemPrompt?: string): Promise<string> {
    const defaultSystemPrompt = `You are a helpful assistant for a packaging business in Malaysia. 
    Generate professional, conversational replies in Malaysian-English (Bahasa rojak) tone. 
    Focus on being helpful and building relationships. Avoid discussing specific prices - instead, 
    suggest scheduling a call or meeting to discuss requirements in detail.
    
    Keep responses concise, friendly, and professional. Use appropriate Malaysian expressions when natural.`;

    const prompt = systemPrompt || defaultSystemPrompt;
    
    const conversationHistory = messages.map(msg => 
      `${msg.sender}: ${msg.text}`
    ).join('\n');

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: `Based on this conversation history, generate an appropriate reply:\n\n${conversationHistory}` }
          ],
          max_tokens: 300,
          temperature: 0.7
        })
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not generate a reply at this time.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'Sorry, I could not generate a reply at this time.';
    }
  }

  async tagConversation(text: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { 
              role: 'system', 
              content: 'You are a tagging assistant for a packaging business. Based on the conversation content, generate relevant tags. Focus on product types (paper bag, sampul raya, kampung, F&B, etc.), client industry, and conversation topics. Return only the tags as a comma-separated list.' 
            },
            { role: 'user', content: `Tag this conversation: ${text}` }
          ],
          max_tokens: 100,
          temperature: 0.3
        })
      });

      const data = await response.json();
      const tagsString = data.choices[0]?.message?.content || '';
      return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } catch (error) {
      console.error('OpenAI tagging error:', error);
      return [];
    }
  }
}

// Export a singleton instance (in production, you'd get the API key from environment variables)
export const openAIService = new OpenAIService('your-openai-api-key-here');