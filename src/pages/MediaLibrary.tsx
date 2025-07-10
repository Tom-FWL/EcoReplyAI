import React, { useState } from 'react';
import { Upload, Search, Filter, Image, FileText, Music, Video, Download } from 'lucide-react';
import { MediaFile } from '../types';

export function MediaLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document' | 'audio' | 'video'>('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Mock media files
  const [mediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      filename: 'paper-bag-sample.jpg',
      url: 'https://images.pexels.com/photos/4916024/pexels-photo-4916024.jpeg?auto=compress&cs=tinysrgb&w=300',
      type: 'image',
      size: 245760,
      uploadedAt: new Date(),
      linkedChatIds: ['1', '2'],
      tags: ['paper bag', 'sample', 'brown']
    },
    {
      id: '2',
      filename: 'sampul-raya-design.pdf',
      url: '#',
      type: 'document',
      size: 1048576,
      uploadedAt: new Date(),
      linkedChatIds: ['2'],
      tags: ['sampul raya', 'design', 'wedding']
    },
    {
      id: '3',
      filename: 'packaging-catalog.pdf',
      url: '#',
      type: 'document',
      size: 2097152,
      uploadedAt: new Date(),
      linkedChatIds: [],
      tags: ['catalog', 'packaging', 'products']
    }
  ]);

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <Image className="w-8 h-8 text-blue-600" />;
      case 'document': return <FileText className="w-8 h-8 text-red-600" />;
      case 'audio': return <Music className="w-8 h-8 text-purple-600" />;
      case 'video': return <Video className="w-8 h-8 text-green-600" />;
      default: return <FileText className="w-8 h-8 text-gray-600" />;
    }
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Handle file upload logic here
    console.log('Files to upload:', files);
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Media Library</h1>
          <p className="text-gray-600">Manage images, documents, and other media files</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx,.ai"
            onChange={handleFileUpload}
            className="hidden"
            id="media-upload"
          />
          <label
            htmlFor="media-upload"
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Media</span>
          </label>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search media files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="document">Documents</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
              selectedFiles.includes(file.id) ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
            }`}
            onClick={() => toggleFileSelection(file.id)}
          >
            <div className="flex items-center justify-between mb-3">
              {getFileIcon(file.type)}
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(file.url, '_blank');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {file.type === 'image' && (
              <div className="mb-3">
                <img
                  src={file.url}
                  alt={file.filename}
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
            
            <h3 className="font-medium text-gray-900 mb-1 truncate">{file.filename}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {(file.size / 1024 / 1024).toFixed(1)} MB
            </p>
            
            {file.linkedChatIds.length > 0 && (
              <p className="text-xs text-blue-600 mb-2">
                Linked to {file.linkedChatIds.length} chat{file.linkedChatIds.length > 1 ? 's' : ''}
              </p>
            )}
            
            {file.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {file.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {file.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{file.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No media files found</h3>
          <p className="text-gray-600">Upload some media files to get started</p>
        </div>
      )}
    </div>
  );
}