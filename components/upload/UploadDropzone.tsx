'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface UploadResult {
  name: string;
  type: 'pdf' | 'csv';
  chunkCount?: number;
  pageCount?: number;
  rowCount?: number;
  uploadedAt: string;
}

interface StoredDocument {
  _id: string;
  name: string;
  fileType: 'pdf' | 'csv';
  metadata: { pageCount?: number; rowCount?: number; fileSize: number };
  createdAt: string;
}

function formatBytes(bytes: number) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function UploadDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [error, setError] = useState('');
  const [storedDocs, setStoredDocs] = useState<StoredDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocs = useCallback(() => {
    setLoadingDocs(true);
    fetch('/api/documents')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setStoredDocs(d); })
      .catch(console.error)
      .finally(() => setLoadingDocs(false));
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files ? Array.from(e.target.files) : []);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFiles = async (files: File[]) => {
    const valid = files.filter((f) => {
      const name = f.name.toLowerCase();
      return (
        f.type === 'application/pdf' || name.endsWith('.pdf') ||
        f.type === 'text/csv' || f.type === 'application/csv' ||
        f.type === 'application/vnd.ms-excel' || name.endsWith('.csv')
      );
    });

    if (valid.length === 0) {
      setError('Please upload PDF or CSV files only.');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    const newResults: UploadResult[] = [];

    for (let i = 0; i < valid.length; i++) {
      const file = valid[i];
      setProgress(Math.round(((i) / valid.length) * 90));

      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const endpoint = isPdf ? '/api/upload/pdf' : '/api/upload/csv';

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'x-user-id': '000000000000000000000001' },
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(`Failed to upload "${file.name}": ${data.error || 'Unknown error'}`);
        } else {
          newResults.push({
            name: file.name,
            type: isPdf ? 'pdf' : 'csv',
            chunkCount: data.document?.chunkCount,
            pageCount: data.document?.pageCount,
            rowCount: data.document?.rowCount,
            uploadedAt: new Date().toISOString(),
          });
        }
      } catch {
        setError(`Network error uploading "${file.name}". Please try again.`);
      }
    }

    setProgress(100);
    setResults((prev) => [...newResults, ...prev]);
    setUploading(false);
    fetchDocs();
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
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
        <p className="text-slate-400 mb-4 text-sm">PDF or CSV — drag &amp; drop or click to browse</p>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="border-slate-600 text-slate-300 hover:text-white"
        >
          {uploading ? <><Spinner className="mr-2 h-4 w-4" />Uploading...</> : 'Select Files'}
        </Button>
        <input ref={fileInputRef} type="file" multiple accept=".pdf,.csv" onChange={handleFileSelect} className="hidden" />
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Uploading &amp; parsing...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-950/40 border border-red-700/50 text-red-300 text-sm">
          <svg className="h-4 w-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* This-session success cards */}
      {results.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white">Just uploaded</h4>
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-green-950/30 border border-green-700/40">
              <div className="h-8 w-8 rounded bg-green-600/20 border border-green-500/30 flex items-center justify-center shrink-0">
                <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{r.name}</p>
                <p className="text-xs text-slate-400">
                  {r.type.toUpperCase()}
                  {r.pageCount != null && ` · ${r.pageCount} pages`}
                  {r.rowCount != null && ` · ${r.rowCount} rows`}
                  {r.chunkCount != null && ` · ${r.chunkCount} searchable chunks`}
                </p>
              </div>
              <span className="text-xs text-green-400 font-medium shrink-0">Uploaded</span>
            </div>
          ))}
        </div>
      )}

      {/* Previously uploaded documents */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-white">
          All uploaded documents
          {!loadingDocs && <span className="text-slate-400 font-normal ml-1">({storedDocs.length})</span>}
        </h4>

        {loadingDocs ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-slate-800/50 animate-pulse" />
            ))}
          </div>
        ) : storedDocs.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-slate-500 text-sm rounded-lg border border-slate-700 bg-slate-800/20">
            No documents uploaded yet.
          </div>
        ) : (
          <div className="space-y-2">
            {storedDocs.map((doc) => (
              <div key={doc._id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 bg-slate-800/30">
                <div className={`h-8 w-8 rounded flex items-center justify-center shrink-0 text-xs font-bold ${
                  doc.fileType === 'pdf'
                    ? 'bg-red-600/20 border border-red-500/30 text-red-400'
                    : 'bg-green-600/20 border border-green-500/30 text-green-400'
                }`}>
                  {doc.fileType.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                  <p className="text-xs text-slate-400">
                    {doc.metadata?.fileSize ? formatBytes(doc.metadata.fileSize) : ''}
                    {doc.metadata?.pageCount != null && ` · ${doc.metadata.pageCount} pages`}
                    {doc.metadata?.rowCount != null && ` · ${doc.metadata.rowCount} rows`}
                    {' · '}
                    {new Date(doc.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
