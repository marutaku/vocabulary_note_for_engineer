import json
from collections import defaultdict
from typing import Generator

from document_crawler.dictionary import EnglishDictionary
from document_crawler.items import DocumentCrawlerItem
from document_crawler.types import Example, Record


def load_json_line_file(file_path: str) -> Generator[DocumentCrawlerItem, None, None]:
    with open(file_path, "r") as f:
        for line in f:
            yield DocumentCrawlerItem.from_dict(json.loads(line))


def is_valid_word(word: str) -> bool:
    return word.isalpha()


def aggregate_examples(
    json_line_path: str, dictionary: EnglishDictionary
) -> dict[str, Record]:
    word_examples_dict: dict[str, Record] = defaultdict(
        lambda: {"examples": [], "meaning": ""}
    )
    for item in load_json_line_file(json_line_path):
        for paragraph in item.paragraphs:
            for word in paragraph.normalized_words:
                if not is_valid_word(word):
                    continue
                definition = dictionary.get_word_info(word)
                if definition is None:
                    continue
                if not word_examples_dict.get(word):
                    word_examples_dict[word]["meaning"] = definition.formatted_meaning
                word_examples_dict[word]["examples"].append(
                    {"url": item.url, "text": paragraph.text}
                )
    return word_examples_dict


def remove_duplicate_examples(example_list: list[Example]) -> list[Example]:
    seen = set()
    result = []
    for example in example_list:
        example_tuple = tuple(example.items())
        if example_tuple not in seen:
            seen.add(example_tuple)
            result.append(example)
    return result


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("json_line_path", type=str)
    parser.add_argument("export_json_filepath", type=str)
    parser.add_argument("dictionary_path", type=str)
    parser.add_argument("--max_examples", type=int, default=5)
    args = parser.parse_args()
    dictionary = EnglishDictionary(args.dictionary_path)
    result = aggregate_examples(args.json_line_path, dictionary)
    example_list_map: dict[str, Record] = {}
    for word, record in result.items():
        example_list_map[word] = record
        example_list_map[word]["examples"] = sorted(
            remove_duplicate_examples(record["examples"]),
            key=lambda x: len(x["text"]),
            reverse=True,
        )[: args.max_examples]
    with open(args.export_json_filepath, "w") as f:
        json.dump(example_list_map, f, indent=2, ensure_ascii=False)
