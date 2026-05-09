'use client';

import { Message } from './ChatPanel';
import { Card } from '@/components/ui/card';

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-2xl ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isUser
              ? 'bg-slate-700 border border-slate-600'
              : 'bg-blue-600/20 border border-blue-500/30'
          }`}
        >
          {isUser ? (
            <span className="text-sm font-semibold text-slate-300">U</span>
          ) : (
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col gap-2">
          <Card
            className={`px-4 py-3 ${
              isUser
                ? 'bg-blue-600 border-blue-500/50 text-white'
                : 'bg-slate-800/50 border-slate-700 text-slate-200'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </Card>
          <p className="text-xs text-slate-500 px-1">
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
