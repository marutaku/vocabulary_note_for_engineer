# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from scrapy.exceptions import DropItem

from document_crawler.items import DocumentCrawlerItem
from document_crawler.paragraph import ParagraphPreprocessor
from document_crawler.settings import MINIMUM_WORDS_IN_PARAGRAPH


class DocumentCrawlerPipeline:
    def __init__(self) -> None:
        self.paragraph_processor = ParagraphPreprocessor(MINIMUM_WORDS_IN_PARAGRAPH)

    def process_item(self, item, spider):
        paragraphs = item["paragraphs"]
        processed_paragraphs = [
            self.paragraph_processor.process_paragraph(p) for p in paragraphs
        ]
        if (len(processed_paragraphs) == 0) or (
            len(processed_paragraphs[0].normalized_words) == 0
        ):
            raise DropItem(
                f"Crawled item(url: {item['url']}) dropped because it has no paragraphs"
            )
        return DocumentCrawlerItem(
            title=item["title"], url=item["url"], paragraphs=processed_paragraphs
        )
