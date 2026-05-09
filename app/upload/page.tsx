'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadDropzone } from '@/components/upload/UploadDropzone';

export default function UploadPage() {
  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-auto">
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Upload Documents</h1>
          <p className="text-slate-400">Upload PDFs or CSV files to include them in your analytics</p>
        </div>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Upload File</CardTitle>
            <CardDescription className="text-slate-400">
              Drag and drop your file or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadDropzone />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Supported Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-blue-400">•</span>
                <span><strong>PDF</strong> - Text and scanned documents</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">•</span>
                <span><strong>CSV</strong> - Comma-separated values with headers</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
