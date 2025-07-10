import React, { useState } from 'react';
import { format } from 'date-fns';
import { TrendingUp, DollarSign, Calendar, User, Package, Search, Filter } from 'lucide-react';
import { Deal } from '../types';

export function ConvertedDeals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'potential' | 'negotiating' | 'closed' | 'lost'>('all');

  // Mock deals data
  const [deals] = useState<Deal[]>([
    {
      id: '1',
      chatId: '3',
      clientName: 'Kampung Committee',
      productType: 'Paper bags for community event',
      estimatedValue: 2500,
      status: 'closed',
      convertedAt: new Date(2024, 0, 20),
      notes: 'Bulk order of 1000 paper bags delivered successfully'
    },
    {
      id: '2',
      chatId: '2',
      clientName: 'Siti Wedding Services',
      productType: 'Custom sampul raya printing',
      estimatedValue: 1800,
      status: 'negotiating',
      convertedAt: new Date(2024, 0, 18),
      notes: 'Waiting for final design approval'
    },
    {
      id: '3',
      chatId: '1',
      clientName: 'Ahmad Restaurant',
      productType: 'Eco-friendly food packaging',
      estimatedValue: 3200,
      status: 'potential',
      convertedAt: new Date(2024, 0, 15),
      notes: 'Interested in monthly recurring orders'
    }
  ]);

  const getStatusColor = (status: Deal['status']) => {
    switch (status) {
      case 'potential': return 'bg-yellow-100 text-yellow-800';
      case 'negotiating': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Deal['status']) => {
    switch (status) {
      case 'potential': return 'Potential';
      case 'negotiating': return 'Negotiating';
      case 'closed': return 'Closed';
      case 'lost': return 'Lost';
      default: return status;
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.productType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || deal.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.estimatedValue, 0);
  const closedDeals = filteredDeals.filter(deal => deal.status === 'closed');
  const closedValue = closedDeals.reduce((sum, deal) => sum + deal.estimatedValue, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Converted Deals</h1>
        <p className="text-gray-600">Track and manage your converted opportunities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Deals</p>
              <p className="text-2xl font-bold text-gray-900">{filteredDeals.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">RM {totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Closed Deals</p>
              <p className="text-2xl font-bold text-gray-900">RM {closedValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="potential">Potential</option>
            <option value="negotiating">Negotiating</option>
            <option value="closed">Closed</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Deals List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="ml-3 font-medium text-gray-900">{deal.clientName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{deal.productType}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">RM {deal.estimatedValue.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                      {getStatusLabel(deal.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(deal.convertedAt, 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600 max-w-xs truncate">
                    {deal.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
          <p className="text-gray-600">Start converting chats to deals to see them here</p>
        </div>
      )}
    </div>
  );
}