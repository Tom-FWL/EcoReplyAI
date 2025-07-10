import React, { useState } from 'react';
import { Send, Edit, Wand2, Loader2 } from 'lucide-react';
import { openAIService } from '../lib/openai';
import { Message } from '../types';

interface AIReplyBoxProps {
  chatId: string;
  messages: Message[];
  onSendReply: (reply: string) => void;
}

export function AIReplyBox({ chatId, messages, onSendReply }: AIReplyBoxProps) {
  const [generatedReply, setGeneratedReply] = useState('');
  const [editedReply, setEditedReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleGenerateReply = async () => {
    setIsGenerating(true);
    try {
      const recentMessages = messages.slice(-10); // Get last 10 messages
      const reply = await openAIService.generateReply(recentMessages.map(msg => ({
        sender: msg.sender,
        text: msg.text,
        timestamp: msg.timestamp
      })));
      setGeneratedReply(reply);
      setEditedReply(reply);
    } catch (error) {
      console.error('Error generating reply:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendReply = () => {
    const finalReply = isEditing ? editedReply : generatedReply;
    onSendReply(finalReply);
    setGeneratedReply('');
    setEditedReply('');
    setIsEditing(false);
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="mb-4">
        <button
          onClick={handleGenerateReply}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          <span>{isGenerating ? 'Generating...' : 'Generate AI Reply'}</span>
        </button>
      </div>

      {generatedReply && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-purple-900">AI Generated Reply</h4>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-purple-600 hover:text-purple-800"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            
            {isEditing ? (
              <textarea
                value={editedReply}
                onChange={(e) => setEditedReply(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                rows={4}
                placeholder="Edit your reply..."
              />
            ) : (
              <p className="text-gray-800 whitespace-pre-wrap">{generatedReply}</p>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSendReply}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Send className="w-4 h-4" />
              <span>Send Reply</span>
            </button>
            <button
              onClick={() => {
                setGeneratedReply('');
                setEditedReply('');
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}