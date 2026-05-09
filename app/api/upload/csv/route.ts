import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import Papa from 'papaparse';
import UploadedDocument from '@/models/UploadedDocument';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'text/csv') {
      return NextResponse.json({ error: 'Only CSV files are supported' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const csvText = buffer.toString('utf-8');

    // Parse CSV
    const parsed = Papa.parse(csvText, { header: true });
    const rows = parsed.data as any[];

    // Create chunks from CSV data
    const chunks: string[] = [];
    const chunkSize = 20; // rows per chunk

    for (let i = 0; i < rows.length; i += chunkSize) {
      const rowChunk = rows.slice(i, i + chunkSize);
      const chunkText = rowChunk
        .map((row) => JSON.stringify(row))
        .join('\n');
      chunks.push(chunkText);
    }

    // Create embeddings
    const chunksWithEmbeddings = chunks.map((chunk) => ({
      text: chunk,
      embedding: simpleEmbedding(chunk),
    }));

    // Save file
    await connectDB();
    const uploadsDir = join(process.cwd(), 'uploads');
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    // Save document metadata to DB
    const document = new UploadedDocument({
      name: file.name,
      fileType: 'csv',
      filePath: `/uploads/${fileName}`,
      uploadedBy: userId,
      chunks: chunksWithEmbeddings,
      metadata: {
        rowCount: rows.length,
        fileSize: file.size,
      },
    });

    await document.save();

    return NextResponse.json(
      {
        success: true,
        document: {
          id: document._id,
          name: document.name,
          rowCount: rows.length,
          chunkCount: chunks.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] CSV upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload CSV', details: String(error) },
      { status: 500 }
    );
  }
}

function simpleEmbedding(text: string): number[] {
  // Simple embedding using character codes
  const embedding: number[] = new Array(128).fill(0);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    embedding[i % 128] += charCode / 1000;
  }
  return embedding.map((v) => v / (text.length / 128 || 1));
}
