import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UploadedDocument from '@/models/UploadedDocument';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const docs = await UploadedDocument.find({})
      .select('name fileType metadata createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(docs);
  } catch (error) {
    console.error('[api/documents] error:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
