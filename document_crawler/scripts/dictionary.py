import sqlite3


class EnglishDictionary(object):
    def __init__(self, sqlite_db_file: str) -> None:
        self.conn = sqlite3.connect(sqlite_db_file)
        self.conn.row_factory = sqlite3.Row

    def get_word_definition(self, word: str) -> str | None:
        cursor = self.conn.cursor()
        cursor.execute("SELECT mean FROM items WHERE word=?", (word,))
        result = cursor.fetchone()
        if result is not None:
            return result[0]
        return None


if __name__ == "__main__":
    import sys

    db_path = sys.argv[1]
    word = sys.argv[2]
    dictionary = EnglishDictionary(db_path)
    definition = dictionary.get_word_definition(word)
    if definition is None:
        print("No definition found.")
    else:
        print("\n".join([text.strip() for text in definition.split("/")]))
