import React, { useState } from 'react';
import { Brain, TrendingUp, MessageSquare, Target, Lightbulb, BarChart3, Zap } from 'lucide-react';
import { generateEmbedding, cosineSimilarity, loadUniversalSentenceEncoder } from '/workspace/EcoReplyAI/src/lib/ai-utils.ts';
import * as tf from '@tensorflow/tfjs';

interface MessageWithEmbedding {
  sender: string;
  message: string;
  timestamp: string;
  embedding?: tf.Tensor;
}

// Interface for the match result, including the type of match
interface MatchResult {
  bestMatch: MessageWithEmbedding | null;
  highestSimilarity: number;
  matchType: 'semantic' | 'keyword' | 'none';
  keywordMatchResponse?: string;
}

export function AISuggestions() {
  // Dummy historical messages with placeholder embeddings
  // In a real application, you would fetch this data from a shared state, context, or API
  const historicalMessages: MessageWithEmbedding[] = [
    {
      sender: "Customer A",
      message: "What is your minimum order quantity?",
      timestamp: "2023-10-27T10:00:00Z",
      embedding: tf.zeros([512]), // Placeholder
    },
    {
      sender: "Customer B",
      message: "How much does shipping cost?",
      timestamp: "2023-10-27T10:05:00Z",
      embedding: tf.zeros([512]), // Placeholder
    },
    {
      sender: "Customer A",
      message: "Can I get a discount for bulk orders?",
      timestamp: "2023-10-27T10:10:00Z",
      embedding: tf.zeros([512]), // Placeholder
    },
  ];

  const [activeTab, setActiveTab] = useState<'insights' | 'recommendations' | 'analytics'>('insights');

  const insights = [
    {
      id: 1,
      type: 'trend',
      title: 'Rising Demand for Eco-Friendly Packaging',
      description: 'Paper bag inquiries have increased 40% this month. Consider promoting eco-friendly options.',
      confidence: 85,
      icon: TrendingUp
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'F&B Clients Need Quick Turnaround',
      description: 'Food service clients often mention urgency. Highlight fast delivery times.',
      confidence: 78,
      icon: Target
    },
    {
      id: 3,
      type: 'pattern',
      title: 'Wedding Season Preparation',
      description: 'Sampul raya inquiries peak 2-3 months before wedding seasons.',
      confidence: 92,
      icon: MessageSquare
    }
  ];

  const recommendations = [
    {
      id: 1,
      category: 'Response Strategy',
      title: 'Use Malaysian-English Mix',
      description: 'Clients respond better to replies that include local expressions like "can lah" or "no problem one".',
      impact: 'High',
      implementation: 'Update AI prompts to include Malaysian colloquialisms'
    },
    {
      id: 2,
      category: 'Pricing Strategy',
      title: 'Avoid Price Discussions Early',
      description: 'Conversations that focus on requirements first have 60% higher conversion rates.',
      impact: 'Medium',
      implementation: 'Train AI to ask about quantity and specifications before pricing'
    },
    {
      id: 3,
      category: 'Follow-up Timing',
      title: 'Optimal Follow-up Window',
      description: 'Follow-up messages sent within 2-4 hours have highest response rates.',
      impact: 'High',
      implementation: 'Set up automated follow-up reminders'
    }
  ];

  const findBestMatch = async (newMessageText: string, historicalMessages: MessageWithEmbedding[]) => {
    const newEmbedding = await generateEmbedding(newMessageText);

    if (!newEmbedding) {
      console.warn('Failed to generate embedding for the new message.');
      return { bestMatch: null, highestSimilarity: -1 };
    }

    let bestMatch: MessageWithEmbedding | null = null;
    let highestSimilarity: number = -1;

    for (const historicalMessage of historicalMessages) {
      if (historicalMessage.embedding) {
        const similarity = cosineSimilarity(newEmbedding, historicalMessage.embedding);
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          bestMatch = historicalMessage;
        }
      }
    }

    // Dispose of the new message's embedding tensor to free up memory
    newEmbedding.dispose();

    return { bestMatch, highestSimilarity };
  };

  const [newTestMessage, setNewTestMessage] = useState('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [suggestedReply, setSuggestedReply] = useState<string | null>(null); // State for the suggested reply

  // Example usage (you'll replace this with actual new messages later)
  // findBestMatch("What is your minimum order quantity?", parsedMessages);

  const analytics = [
    {
      metric: 'Response Rate',
      value: '78%',
      change: '+12%',
      trend: 'up'
    },
    {
      metric: 'Average Response Time',
      value: '24 min',
      change: '-8 min',
      trend: 'up'
    },
    {
      metric: 'Conversion Rate',
      value: '23%',
      change: '+5%',
      trend: 'up'
    },
    {
      metric: 'Customer Satisfaction',
      value: '4.6/5',
      change: '+0.3',
      trend: 'up'
    }
  ];

  const [similarityThreshold, setSimilarityThreshold] = useState(0.7); // State for similarity threshold

  return (

    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Suggestions</h1>
        <p className="text-gray-600">Insights and recommendations to improve your business performance</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'insights', label: 'Insights', icon: Brain },
            { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* AI Matching Test Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test AI Matching</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newTestMessage}
            onChange={(e) => setNewTestMessage(e.target.value)}
            placeholder="Enter a message to test matching..."
            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          />
          <button
            onClick={async () => {
              const result = await findBestMatch(newTestMessage, historicalMessages);
              setMatchResult(result); // Set the match result first
              setMatchResult(result);

              if (!result.bestMatch || result.highestSimilarity < similarityThreshold) {
                // If no good semantic match, try keyword fallback
                // This requires importing findKeywordMatch
                // import { findKeywordMatch } from '/workspace/EcoReplyAI/src/lib/ai-utils.ts';
                // Placeholder call for now:
                // const keywordResponse = findKeywordMatch(newTestMessage);

                // For testing the fallback display:
                const keywordResponse = newTestMessage.toLowerCase().includes('order') ? 'Our minimum order quantity is 500 pcs.' : null;

                if (keywordResponse) {
                  setMatchResult({
                    bestMatch: { message: keywordResponse, sender: 'AI (Keyword)', timestamp: new Date().toISOString() },
                    highestSimilarity: 0, // Indicate it wasn't a semantic match
                    matchType: 'keyword',
                    keywordMatchResponse: keywordResponse // Store the keyword response
                  });
                } else {
                  setMatchResult({ bestMatch: null, highestSimilarity: -1, matchType: 'none' });
                  setSuggestedReply(null); // Clear suggested reply if no match
                }
              } else {
                setMatchResult({ ...result, matchType: 'semantic' });
                // If a semantic match is found, set the suggested reply
                setSuggestedReply(result.bestMatch.message);
              }
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Find Match
          </button>
        </div>
        {matchResult && (
 <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-800">Best Match Found:</h4>
            {matchResult.bestMatch ? (
              <p className="text-sm text-gray-700 mt-1">"{matchResult.bestMatch.message}" (Similarity: {matchResult.highestSimilarity.toFixed(4)})</p>
            ) : (<p className="text-sm text-gray-700 mt-1">No good match found.</p>)}
          </div>
        )}
          </button>
      {/* Suggested AI Reply Section */}
      {suggestedReply && (
        <div className="mt-6 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested AI Reply</h3>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md">
            <p className="text-gray-800">{suggestedReply}</p>
          </div>
        </div>
      )}

        </div>


      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {insights.map((insight) => (
            <div key={insight.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <insight.icon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                  <p className="text-gray-600 mb-3">{insight.description}</p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Confidence:</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-700 ml-2">{insight.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {recommendation.category}
                    </span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                      recommendation.impact === 'High' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {recommendation.impact} Impact
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{recommendation.title}</h3>
                  <p className="text-gray-600 mb-3">{recommendation.description}</p>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm text-gray-700">
                      <strong>Implementation:</strong> {recommendation.implementation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analytics.map((metric) => (
            <div key={metric.metric} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{metric.metric}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {metric.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}