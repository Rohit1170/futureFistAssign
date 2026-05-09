import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const ChatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(5000),
  conversationId: z.string().optional(),
});

export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;

export const PDFUploadSchema = z.object({
  fileName: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
});

export type PDFUploadInput = z.infer<typeof PDFUploadSchema>;

export const ToolCallSchema = z.object({
  toolName: z.string(),
  args: z.record(z.any()),
});

export type ToolCall = z.infer<typeof ToolCallSchema>;
