from typing import Iterable, cast
from urllib.parse import urlparse

import scrapy
from scrapy import Request

from document_crawler.items import CrawledDocumentCrawlerItem


class TechnicalDocsSpider(scrapy.Spider):
    name = "technical_docs"
    allowed_domains = ["*"]

    def start_requests(self) -> Iterable[Request]:
        # TODO: Load the `start_urls` from some data source
        # Below code is just a placeholder
        dummy_urls = [
            "https://pkg.go.dev/goa.design/goa",
            "https://docs.scrapy.org/en/latest/index.html",
        ]
        for url in dummy_urls:
            yield Request(url, dont_filter=True)

    def parse(self, response):
        url = response.url
        title = response.css("title::text").get()
        paragraphs = response.css("p::text")
        paragraph_texts = [cast(str, p.get()) for p in paragraphs]
        yield CrawledDocumentCrawlerItem(
            title=title, url=url, paragraphs=paragraph_texts
        )
        links = response.css("a::attr(href)").getall()
        for link in links:
            # check domain is same as `response.url`
            current_response_domain = urlparse(response.url).netloc
            link_domain = urlparse(link).netloc
            if current_response_domain != link_domain:
                continue
            yield Request(link, callback=self.parse)
