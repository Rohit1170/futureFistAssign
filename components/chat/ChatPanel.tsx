'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Card } from '@/components/ui/card';

interface RateLimitInfo {
  requestsRemaining: number;
  requestsLimit: number;
  tokensRemaining: number;
  tokensLimit: number;
  resetsIn: string;
  isLimited: boolean;
}

function RateLimitBar({ info }: { info: RateLimitInfo | null }) {
  if (!info) return null;
  const { requestsRemaining, requestsLimit, resetsIn, isLimited } = info;

  const isRed = isLimited || requestsRemaining < 3;
  const isYellow = !isRed && requestsRemaining < 10;

  const colorClass = isRed
    ? 'bg-red-950/40 border-red-700/50 text-red-300'
    : isYellow
    ? 'bg-yellow-950/40 border-yellow-700/50 text-yellow-300'
    : 'bg-slate-800/40 border-slate-700/50 text-slate-400';

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs mb-2 ${colorClass}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isRed ? 'bg-red-400' : isYellow ? 'bg-yellow-400' : 'bg-green-400'}`} />
      {isLimited
        ? `⚠ Rate limited${resetsIn ? ` — resets in ${resetsIn}` : ''}`
        : `API: ${requestsRemaining}/${requestsLimit} requests remaining${resetsIn ? ` • resets in ${resetsIn}` : ''}`}
    </div>
  );
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tools?: ToolExecution[];
  type?: 'rate_limited';
}

export interface ToolExecution {
  name: string;
  status: 'running' | 'success' | 'failed';
  duration?: number;
  result?: string;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI analytics assistant. Ask me questions about your business data, such as movie performance, regional engagement, marketing ROI, or trends.',
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchRateLimit = useCallback(() => {
    fetch('/api/groq/rate-limit')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d && !d.error) setRateLimitInfo(d); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchRateLimit();
    const interval = setInterval(fetchRateLimit, 10_000);
    return () => clearInterval(interval);
  }, [fetchRateLimit]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response || data.message,
          timestamp: new Date(),
          tools: data.tools,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else if (response.status === 429 || data.error === 'rate_limited') {
        const retryAfter = data.retryAfter ?? 30;
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          type: 'rate_limited',
          content: `Rate limit reached — I need a short break!\nThe AI service allows limited requests per minute. Please wait ~${retryAfter} seconds and try again.`,
          timestamp: new Date(),
        }]);
      } else {
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Error: ${data.error || 'Failed to process your question'}`,
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error('[v0] Chat error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'An error occurred. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      fetchRateLimit();
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-auto mb-4 space-y-4 pr-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {loading && (
            <div className="flex gap-2 items-center">
              <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-slate-400">Processing your request...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-auto">
          <RateLimitBar info={rateLimitInfo} />
          <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
