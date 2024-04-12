import { createAuthMiddleware } from './middleware/auth';
import { serve } from '@hono/node-server';
import firebaseApp from './firebase';
import { OpenAPIHono } from '@hono/zod-openapi';
import { searchRoute } from './routes/search';

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          ok: false,
          errors: result.error.errors.map((e) => e.message),
          source: 'custom_error_handler',
        },
        422,
      );
    }
  },
});

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
});

app.use('/api/*', createAuthMiddleware(firebaseApp));
app.openapi(searchRoute, async (c) => {
  const { word } = c.req.valid('param');
  return c.json({
    word: word,
    meaning: 'こんにちは',
    links: ['https://example.com'],
  });
});

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Vocabulary for Engineer API',
  },
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
