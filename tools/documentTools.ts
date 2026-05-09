import UploadedDocument from '@/models/UploadedDocument';
import connectDB from '@/lib/mongodb';

export async function searchDocuments(params: {
  query: string;
  fileType?: 'pdf' | 'csv';
  limit?: number;
}) {
  try {
    await connectDB();

    const filter: any = {};
    if (params.fileType) filter.fileType = params.fileType;

    const documents = await UploadedDocument.find(filter).select('name fileType chunks createdAt');

    if (documents.length === 0) {
      return {
        success: true,
        data: [],
        message: 'No documents have been uploaded yet.',
      };
    }

    const queryWords = params.query
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const results: Array<{
      documentName: string;
      fileType: string;
      excerpt: string;
      score: number;
    }> = [];

    for (const doc of documents) {
      for (const chunk of doc.chunks) {
        const chunkLower = chunk.text.toLowerCase();
        const score = queryWords.filter((w) => chunkLower.includes(w)).length;
        if (score > 0) {
          results.push({
            documentName: doc.name,
            fileType: doc.fileType,
            excerpt: chunk.text.slice(0, 600),
            score,
          });
        }
      }
    }

    results.sort((a, b) => b.score - a.score);

    return {
      success: true,
      data: results.slice(0, params.limit || 5),
      totalDocuments: documents.length,
    };
  } catch (error) {
    console.error('[documentTools] searchDocuments error:', error);
    return { success: false, error: 'Failed to search documents' };
  }
}
