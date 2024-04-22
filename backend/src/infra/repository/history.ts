import { Firestore, getFirestore, FieldValue } from 'firebase-admin/firestore';
import { App } from 'firebase-admin/app';

class HistoryRecord {
  constructor(
    public count: FieldValue,
    public lastSearched: FieldValue,
  ) {}
  public static converter = {
    toFirestore(history: HistoryRecord): HistoryRecord {
      return {
        count: history.count,
        lastSearched: history.lastSearched,
      };
    },
    fromFirestore(
      snapshot: FirebaseFirestore.QueryDocumentSnapshot,
    ): HistoryRecord {
      const data = snapshot.data();
      return new HistoryRecord(data.count, data.lastSearched.toDate());
    },
  };
}

export interface HistoryRepository {
  addHistory(userId: string, word: string): Promise<void>;
}

export class HistoryRepositoryImpl implements HistoryRepository {
  store: Firestore;
  constructor(app: App) {
    this.store = getFirestore(app);
  }
  async addHistory(userId: string, word: string): Promise<void> {
    const docRef = this.store
      .collection('User')
      .doc(userId)
      .collection('history')
      .doc(word);
    await docRef.set(
      HistoryRecord.converter.toFirestore({
        count: FieldValue.increment(1),
        lastSearched: FieldValue.serverTimestamp(),
      }),
    );
  }
}
