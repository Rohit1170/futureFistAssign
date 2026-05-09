import { NextRequest, NextResponse } from 'next/server';
import { orchestrateTools } from '@/services/toolOrchestrator';
import { ChatMessageSchema } from '@/lib/validators';
import QueryLog from '@/models/QueryLog';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = ChatMessageSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { message } = validation.data;

    // Get user ID from headers (set by middleware)
    const userId = new (await import('mongoose')).Types.ObjectId('000000000000000000000001');

    const startTime = Date.now();

    // Orchestrate tools
    const { response, tools } = await orchestrateTools(message);

    const executionTime = Date.now() - startTime;

    // Log the query
    await connectDB();
    const queryLog = new QueryLog({
      userId,
      queryText: message,
      toolsUsed: tools.map((t) => t.name),
      response,
      executionTime,
      status: tools.some((t) => t.status === 'failed') ? 'partial' : 'success',
    });

    await queryLog.save();

    return NextResponse.json(
      {
        response,
        tools: tools.map((t) => ({
          name: t.name,
          status: t.status,
          duration: t.duration,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[v0] Chat error:', error);
    if (error?.message?.startsWith('RATE_LIMIT_EXCEEDED')) {
      return NextResponse.json(
        {
          error: 'rate_limited',
          message: 'Groq API rate limit reached. Please wait 30 seconds and try again.',
          retryAfter: 30,
        },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process message', details: String(error) },
      { status: 500 }
    );
  }
}
