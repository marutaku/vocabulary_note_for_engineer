# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

from dataclasses import dataclass


@dataclass
class Paragraph:
    text: str
    normalized_words: list[str]


@dataclass
class DocumentCrawlerItem:
    # define the fields for your item here like:
    # name = scrapy.Field()
    title: str
    url: str
    paragraphs: list[Paragraph]

    def __str__(self) -> str:
        return "DocumentCrawlerItem(title={}, url={})".format(self.title, self.url)

    def __repr__(self) -> str:
        return str(self)


@dataclass
class CrawledDocumentCrawlerItem:
    title: str
    url: str
    paragraphs: list[str]

    def __str__(self) -> str:
        return "DocumentCrawlerItem(title={}, url={})".format(self.title, self.url)

    def __repr__(self) -> str:
        return str(self)
