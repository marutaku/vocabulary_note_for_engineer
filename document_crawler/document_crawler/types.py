from typing import TypedDict


class Example(TypedDict):
    url: str
    text: str


class Record(TypedDict):
    meaning: str
    examples: list[Example]
