import { WordRepository, WordRepositoryImpl } from './../infra/repository/word';
import { App } from 'firebase-admin/app';
import { Word } from '../domain/word';
import {
  HistoryRepository,
  HistoryRepositoryImpl,
} from '../infra/repository/history';

export interface WordUseCase {
  searchWord(word: string): Promise<Word | null>;
}

export class WordUseCaseImpl implements WordUseCase {
  wordRepository: WordRepository;
  historyRepository: HistoryRepository;
  constructor(app: App) {
    this.wordRepository = new WordRepositoryImpl(
      app,
      './data/dictionary.sqlite3',
    );
    this.historyRepository = new HistoryRepositoryImpl(app);
  }
  async searchWord(word: string): Promise<Word | null> {
    const result = await this.wordRepository.getWord(word, 3);
    if (!result) {
      return result;
    }
    await this.historyRepository.addHistory('user1', word);
    return result;
  }
}
