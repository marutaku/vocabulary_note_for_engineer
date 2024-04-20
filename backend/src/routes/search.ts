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
    examples: z
      .array(
        z.object({
          // 例文
          sentence: z
            .string()
            .openapi({ example: 'Hello, World!', description: '例文' }),
          // 例文が使用されているWebサイトのリンク
          url: z.string().url().openapi({
            example: 'https://example.com',
            description: '例文が使用されているWebサイトのリンク',
          }),
        }),
      )
      .openapi({
        example: [
          {
            sentence: 'Hello, World!',
            url: 'https://example.com',
          },
        ],
        description: '単語が使用されているWebサイトのリンク',
      }),
  })
  .openapi('SearchResponseSchema');

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
    query: SearchParamSchema,
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
