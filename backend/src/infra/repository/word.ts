import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { Word } from '../../domain/word';
import { App } from 'firebase-admin/app';
import { lemmatizer } from 'lemmatizer';
import { ExampleRepository, ExampleRepositoryImpl } from './example';

class WordRecord {
  constructor(
    public surface: string,
    public meaning: string,
  ) {}
  public static converter = {
    toFirestore(word: WordRecord): WordRecord {
      return {
        surface: word.surface,
        meaning: word.meaning,
      };
    },
    fromFirestore(
      snapshot: FirebaseFirestore.QueryDocumentSnapshot,
    ): WordRecord {
      const data = snapshot.data();
      return new WordRecord(data.id, data.meaning);
    },
  };
}

export interface WordRepository {
  getWord(word: string, maxExamples: number): Promise<Word | null>;
}

export class WordRepositoryImpl implements WordRepository {
  store: Firestore;
  exampleRepository: ExampleRepository;
  constructor(app: App) {
    this.store = getFirestore(app);
    this.exampleRepository = new ExampleRepositoryImpl(app);
  }
  async getWord(word: string, maxExamples: number): Promise<Word | null> {
    const lemmatizedWord = await this.lemmatize(word);
    const docRef = this.store
      .collection('words')
      .withConverter(WordRecord.converter)
      .doc(lemmatizedWord);
    const doc = await docRef.get();
    const wordRecord = doc.data();
    if (!wordRecord) {
      return null;
    }
    const examples = await this.exampleRepository.fetchExamples(
      word,
      maxExamples,
    );
    return new Word(wordRecord.surface, wordRecord.meaning, examples);
  }

  lemmatize(word: string): string {
    return lemmatizer(word);
  }
}
