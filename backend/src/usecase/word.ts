import { WordRepository, WordRepositoryImpl } from './../infra/repository/word';
import { App } from 'firebase-admin/app';
import { Word } from '../domain/word';

export interface WordUseCase {
  searchWord(word: string): Promise<Word | null>;
}

export class WordUseCaseImpl implements WordUseCase {
  wordRepository: WordRepository;
  constructor(app: App) {
    this.wordRepository = new WordRepositoryImpl(app);
  }
  async searchWord(word: string): Promise<Word | null> {
    return this.wordRepository.getWord(word, 3);
  }
}
