import { RouteHandler } from '@hono/zod-openapi';
import { searchRoute } from '../../routes/search';
import { App } from 'firebase-admin/app';
import { WordUseCase, WordUseCaseImpl } from '../../usecase/word';

export class WordController {
  wordUsecase: WordUseCase;
  constructor(app: App) {
    this.wordUsecase = new WordUseCaseImpl(app);
  }
  search: RouteHandler<typeof searchRoute> = async (ctx) => {
    const { word } = ctx.req.valid('query');
    const wordWithExamples = await this.wordUsecase.searchWord(word);
    if (!wordWithExamples) {
      return ctx.json(
        {
          error: 'Word not found',
        },
        404,
      );
    }
    return ctx.json({
      word: word,
      meaning: wordWithExamples.meaning,
      examples: wordWithExamples.examples,
    });
  };
}
