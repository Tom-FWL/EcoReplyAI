import React, { useState } from 'react';
import { Brain, TrendingUp, MessageSquare, Target, Lightbulb, BarChart3 } from 'lucide-react';

export function AISuggestions() {
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