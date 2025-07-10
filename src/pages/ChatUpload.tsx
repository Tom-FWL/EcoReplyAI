import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { WhatsAppParser } from '../lib/whatsapp-parser';

export function ChatUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    size: number;
    status: 'processing' | 'completed' | 'error';
    messageCount?: number;
    clientName?: string;
  }>>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const fileInfo = {
          name: file.name,
          size: file.size,
          status: 'processing' as const
        };
        
        setUploadedFiles(prev => [...prev, fileInfo]);
        
        // Process the file
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const messages = WhatsAppParser.parseWhatsAppExport(content);
            const clientInfo = WhatsAppParser.extractClientInfo(messages);
            
            setUploadedFiles(prev => prev.map(f => 
              f.name === file.name 
                ? { 
                    ...f, 
                    status: 'completed', 
                    messageCount: messages.length,
                    clientName: clientInfo.clientName
                  }
                : f
            ));
          } catch (error) {
            setUploadedFiles(prev => prev.map(f => 
              f.name === file.name ? { ...f, status: 'error' } : f
            ));
          }
        };
        reader.readAsText(file);
      } else {
        const fileInfo = {
          name: file.name,
          size: file.size,
          status: 'error' as const
        };
        setUploadedFiles(prev => [...prev, fileInfo]);
      }
    });
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Chat Upload</h1>
        <p className="text-gray-600">Upload WhatsApp chat exports (.txt files) to analyze and manage client conversations</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging 
            ? 'border-emerald-400 bg-emerald-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Drop WhatsApp chat files here</h3>
          <p className="text-gray-600 mb-4">or click to browse and select files</p>
          <input
            type="file"
            multiple
            accept=".txt"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer transition-colors"
          >
            Select Files
          </label>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h4 className="font-medium text-blue-900 mb-2">How to export WhatsApp chats:</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Open WhatsApp on your phone</li>
          <li>Go to the chat you want to export</li>
          <li>Tap the three dots menu → More → Export chat</li>
          <li>Choose "Without Media" for faster processing</li>
          <li>Save the .txt file and upload it here</li>
        </ol>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024).toFixed(1)} KB
                      {file.messageCount && ` • ${file.messageCount} messages`}
                      {file.clientName && ` • ${file.clientName}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.status === 'processing' && (
                    <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  {file.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <button
                    onClick={() => removeFile(file.name)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}