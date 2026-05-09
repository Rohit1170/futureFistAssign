'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { KPIGrid } from '@/components/insights/KPIGrid';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalQueries: 1247,
    avgResponseTime: 2.34,
    successRate: 98.2,
    activeUsers: 12,
  });

  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-auto">
      <div className="max-w-full space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400">Ask questions about your business data and get AI-powered insights</p>
        </div>

        {/* KPI Grid */}
        <KPIGrid stats={stats} />

        {/* Main Content */}
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600">
              Chat with AI
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-blue-600">
              Recent Queries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Ask a Question</CardTitle>
                <CardDescription className="text-slate-400">
                  Use natural language to query your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Queries</CardTitle>
                <CardDescription className="text-slate-400">
                  Your recent questions and responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32 text-slate-400">
                  <p>No recent queries yet. Ask a question to get started.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
