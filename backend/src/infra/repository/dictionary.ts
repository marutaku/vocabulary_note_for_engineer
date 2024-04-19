import { Database } from 'sqlite3';

export interface DictionaryRepository {
  getMeaning(word: string): Promise<string>;
}

export class DictionaryRepositoryImpl implements DictionaryRepository {
  db: Database;
  constructor(databasePath: string) {
    this.db = new Database(databasePath);
  }
  async getMeaning(word: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM items WHERE word = ?',
        [word],
        (err, row: { meaning: string }) => {
          if (err) {
            reject(err);
            return;
          }
          if (!row) {
            return resolve('');
          }
          resolve(row.meaning);
        },
      );
    });
  }
}
