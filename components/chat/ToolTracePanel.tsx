'use client';

import { ToolExecution } from './ChatPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ToolTracePanelProps {
  tools: ToolExecution[];
}

export function ToolTracePanel({ tools }: ToolTracePanelProps) {
  const getStatusIcon = (status: ToolExecution['status']) => {
    switch (status) {
      case 'success':
        return (
          <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
        );
    }
  };

  return (
    <Card className="w-64 bg-slate-900/50 border-slate-700 h-full overflow-auto">
      <CardHeader>
        <CardTitle className="text-white text-sm">Tool Execution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tools.map((tool, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2">
              {getStatusIcon(tool.status)}
              <span className="text-sm font-medium text-slate-200">{tool.name}</span>
            </div>
            {tool.duration && (
              <div className="pl-6 text-xs text-slate-400">
                Duration: {tool.duration}ms
              </div>
            )}
            {tool.result && (
              <div className="pl-6 text-xs text-slate-400 bg-slate-800/50 p-2 rounded border border-slate-700/50 max-h-20 overflow-y-auto">
                {typeof tool.result === 'string' ? tool.result : JSON.stringify(tool.result).substring(0, 100)}...
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
