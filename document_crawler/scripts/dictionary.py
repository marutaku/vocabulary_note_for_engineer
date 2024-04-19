from document_crawler.dictionary import EnglishDictionary

if __name__ == "__main__":
    import sys

    db_path = sys.argv[1]
    word = sys.argv[2]
    dictionary = EnglishDictionary(db_path)
    definition = dictionary.get_word_info(word)
    if definition is None:
        print("No definition found.")
    else:
        print("\n".join(definition.meaning_lines))
