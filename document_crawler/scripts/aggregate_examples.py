import json
from collections import defaultdict
from typing import Generator

from document_crawler.items import DocumentCrawlerItem


def load_json_line_file(file_path: str) -> Generator[DocumentCrawlerItem, None, None]:
    with open(file_path, "r") as f:
        for line in f:
            yield DocumentCrawlerItem.from_dict(json.loads(line))


def aggregate_examples(json_line_path: str) -> dict[str, set[str]]:
    word_examples_dict: dict[str, set[str]] = defaultdict(set)
    for item in load_json_line_file(json_line_path):
        paragraphs = item.paragraphs
        for paragraph in paragraphs:
            for word in paragraph.normalized_words:
                word_examples_dict[word].add(paragraph.text)
    return word_examples_dict


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("json_line_path", type=str)
    parser.add_argument("export_json_filepath", type=str)
    parser.add_argument("--max_examples", type=int, default=5)
    args = parser.parse_args()
    result = aggregate_examples(args.json_line_path)
    example_list_map = {}
    for word, examples in result.items():
        example_list_map[word] = sorted(
            list(examples), key=lambda x: len(x), reverse=True
        )[: args.max_examples]
    with open(args.export_json_filepath, "w") as f:
        json.dump(example_list_map, f, indent=2, ensure_ascii=False)
