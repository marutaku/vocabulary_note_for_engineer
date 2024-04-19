import sqlite3
from dataclasses import dataclass


@dataclass
class Definition:
    word: str
    meaning: str

    @property
    def meaning_lines(self) -> list[str]:
        return [text.strip() for text in self.meaning.split("/")]


class EnglishDictionary(object):
    def __init__(self, db_path: str):
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()

    def __del__(self):
        self.conn.close()

    def get_word_info(self, word: str):
        self.cursor.execute("SELECT word, mean FROM items WHERE word=?", (word,))
        record = self.cursor.fetchone()
        if record is None:
            return None
        return Definition(word=record[0], meaning=record[1])
