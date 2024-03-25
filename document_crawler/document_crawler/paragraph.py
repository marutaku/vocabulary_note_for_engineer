import re
import string

import spacy

from document_crawler.items import Paragraph


class ParagraphPreprocessor(object):
    def __init__(self, minimum_words_in_paragraph: int) -> None:
        self.minimum_words_in_paragraph = minimum_words_in_paragraph
        self.nlp = spacy.load("en_core_web_sm")
        self.regex_clean_html_tags = re.compile(r"<.*?>")

    def extract_all_normalized_words(self, paragraph: str) -> list[str]:
        # Replace URL-like strings
        paragraph = re.sub(r"(http|https)://[^\s]+", "", paragraph)
        paragraph = paragraph.lower()
        words = [e for e in self.nlp(paragraph)]
        normalized_words = [word.lemma_ for word in words]
        normalized_words = [
            word for word in normalized_words if word not in string.punctuation
        ]
        return normalized_words

    def remove_html_tags(self, paragraph: str) -> str:
        return re.sub(self.regex_clean_html_tags, "", paragraph)

    def clean_paragraph(self, paragraph: str) -> str:
        paragraph = self.remove_html_tags(paragraph)
        paragraph = paragraph.strip().replace("\n", " ")
        paragraph = re.sub(r"\s{3,}", "", paragraph)
        return paragraph

    def filter_paragraphs(
        self,
        paragraphs: list[str],
    ) -> list[str]:
        return [
            paragraph
            for paragraph in paragraphs
            if len(paragraph.split(" ")) >= self.minimum_words_in_paragraph
        ]

    def preprocess_paragraphs(self, paragraphs: list[str]) -> list[Paragraph]:
        cleaned_paragraphs = [
            self.clean_paragraph(paragraph) for paragraph in paragraphs
        ]
        filtered_paragraphs = self.filter_paragraphs(cleaned_paragraphs)
        return [
            Paragraph(
                text=paragraph,
                normalized_words=self.extract_all_normalized_words(paragraph),
            )
            for paragraph in filtered_paragraphs
        ]
