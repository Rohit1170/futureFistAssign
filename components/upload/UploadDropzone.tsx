'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export function UploadDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(
      (f) => f.type === 'application/pdf' || f.type === 'text/csv'
    );

    if (validFiles.length === 0) {
      alert('Please upload PDF or CSV files only');
      return;
    }

    setUploading(true);

    try {
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const endpoint = file.type === 'application/pdf' ? '/api/upload/pdf' : '/api/upload/csv';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'x-user-id': '000000000000000000000001' },
          body: formData,
        });

        if (response.ok) {
          setUploadedFiles((prev) => [...prev, file]);
        } else {
          const err = await response.json();
          alert(`Upload failed: ${err.error}`);
        }
      }
    } catch (error) {
      console.error('[v0] Upload error:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
        }`}
      >
        <svg className="h-12 w-12 mx-auto mb-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>

        <h3 className="text-lg font-semibold text-white mb-1">Drop your files here</h3>
        <p className="text-slate-400 mb-4">or click to browse</p>

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="border-slate-600 text-slate-300 hover:text-white"
        >
          {uploading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Uploading...
            </>
          ) : (
            'Select Files'
          )}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white">Uploaded Files</h4>
          <ul className="space-y-1">
            {uploadedFiles.map((file, idx) => (
              <li key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-800/50 border border-slate-700">
                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-slate-300">{file.name}</span>
                <span className="text-xs text-slate-500 ml-auto">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
