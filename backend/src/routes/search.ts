import { createRoute, z } from '@hono/zod-openapi';
import { InvalidRequestSchema, NotFoundSchema } from './common';

export const SearchParamSchema = z.object({
  word: z.string().openapi({ example: 'Hello' }),
});

export const SearchResponseSchema = z
  .object({
    word: z.string().openapi({ example: 'Hello', description: '単語の原形' }),
    // 単語の意味
    meaning: z
      .string()
      .openapi({ example: 'こんにちは', description: '単語の意味' }),
    links: z.array(z.string()).openapi({
      example: ['https://example.com'],
      description: '単語が使用されているWebサイトのリンク',
    }),
  })
  .openapi('User');

export const searchRoute = createRoute({
  method: 'get',
  path: '/api/words/search',
  description: 'search word',
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    params: SearchParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SearchResponseSchema,
        },
      },
      description: 'search word success',
    },
    400: {
      content: {
        'application/json': {
          schema: InvalidRequestSchema,
        },
      },
      description: 'invalid request',
    },
    404: {
      content: {
        'application/json': {
          schema: NotFoundSchema,
        },
      },
      description: 'not found',
    },
  },
});

export default searchRoute;
