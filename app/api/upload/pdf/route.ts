import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { PDFParse } from 'pdf-parse';
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

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const textResult = await parser.getText();
    await parser.destroy();

    // Create chunks from PDF text
    const text = textResult.text;
    const pageCount = textResult.total;
    const chunks = chunkText(text, 500, 50);

    // Create simple embeddings
    const chunksWithEmbeddings = chunks.map((chunk) => ({
      text: chunk,
      embedding: simpleEmbedding(chunk),
      pageNumber: Math.ceil(chunk.length / 3000),
    }));

    // Save file
    await connectDB();
    const uploadsDir = join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    // Save document metadata to DB
    const document = new UploadedDocument({
      name: file.name,
      fileType: 'pdf',
      filePath: `/uploads/${fileName}`,
      uploadedBy: userId,
      chunks: chunksWithEmbeddings,
      metadata: {
        pageCount,
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
          pageCount,
          chunkCount: chunks.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] PDF upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload PDF', details: String(error) },
      { status: 500 }
    );
  }
}

function chunkText(text: string, chunkSize: number, overlapSize: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize - overlapSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

function simpleEmbedding(text: string): number[] {
  // Simple embedding using character codes
  const embedding: number[] = new Array(128).fill(0);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    embedding[i % 128] += charCode / 1000;
  }
  return embedding.map((v) => v / (text.length / 128));
}
