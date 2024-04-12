import { z } from '@hono/zod-openapi';

export const InvalidRequestSchema = z.object({
  error: z.string().openapi({ example: 'Invalid request' }),
});

export const NotFoundSchema = z.object({
  error: z.string().openapi({ example: 'Not found' }),
});
