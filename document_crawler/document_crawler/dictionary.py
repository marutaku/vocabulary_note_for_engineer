import sqlite3


class Dictionary(object):
    def __init__(self, db_path:str):
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()

    def __del__(self):
        self.conn.close()

    def get_word_info(self, word:str):
        self.cursor.execute("SELECT * FROM words WHERE word=?", (word,))
        return self.cursor.fetchone()