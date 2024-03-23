import json
from collections import defaultdict
from typing import Generator

from document_crawler.items import DocumentCrawlerItem


def load_json_line_file(file_path: str) -> Generator[DocumentCrawlerItem, None, None]:
    with open(file_path, "r") as f:
        for line in f:
            yield DocumentCrawlerItem(**json.loads(line))


def aggregate_examples(json_line_path: str) -> dict[str, list[str]]:
    word_examples_dict: dict[str, list[str]] = defaultdict(list)
    for item in load_json_line_file(json_line_path):
        paragraphs = item.paragraphs
        for paragraph in paragraphs:
            print(paragraph)
            for word in paragraph.normalized_words:
                word_examples_dict[word].append(paragraph.text)
    return word_examples_dict


if __name__ == "__main__":
    import sys

    json_line_path = sys.argv[1]
    export_json_filepath = sys.argv[2]
    result = aggregate_examples(json_line_path)
    with open(export_json_filepath, "w") as f:
        json.dump(result, f)
