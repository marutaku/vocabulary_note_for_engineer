import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { Example } from '../../domain/example';
import { App } from 'firebase-admin/app';

class ExampleRecord {
  constructor(
    public sentence: string,
    public url: string,
  ) {}
  public static converter = {
    toFirestore(example: ExampleRecord): ExampleRecord {
      return {
        sentence: example.sentence,
        url: example.url,
      };
    },
    fromFirestore(
      snapshot: FirebaseFirestore.QueryDocumentSnapshot,
    ): ExampleRecord {
      const data = snapshot.data();
      return new ExampleRecord(data.sentence, data.url);
    },
  };
}

export interface ExampleRepository {
  fetchExamples(word: string, limit: number): Promise<Example[]>;
}

export class ExampleRepositoryImpl implements ExampleRepository {
  store: Firestore;
  constructor(app: App) {
    this.store = getFirestore(app);
  }
  async fetchExamples(word: string, limit: number): Promise<Example[]> {
    const snapshot = await this.store
      .collection('words')
      .doc(word)
      .collection('examples')
      .withConverter(ExampleRecord.converter)
      .limit(limit)
      .get();
    return snapshot.docs.map((doc) => {
      const exampleRecord = doc.data();
      return new Example(exampleRecord.sentence, exampleRecord.url);
    });
  }
}
