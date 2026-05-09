'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ToolTracePanel } from './ToolTracePanel';
import { Card } from '@/components/ui/card';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tools?: ToolExecution[];
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
  const [selectedToolTrace, setSelectedToolTrace] = useState<ToolExecution[] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        if (data.tools) {
          setSelectedToolTrace(data.tools);
        }
      } else {
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Error: ${data.error || 'Failed to process your question'}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
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
    }
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Chat Area */}
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
          <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
        </div>
      </div>

      {/* Tool Trace Panel */}
      {selectedToolTrace && selectedToolTrace.length > 0 && (
        <ToolTracePanel tools={selectedToolTrace} />
      )}
    </div>
  );
}
