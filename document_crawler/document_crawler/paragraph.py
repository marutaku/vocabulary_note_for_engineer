from nltk.stem.porter import PorterStemmer

from document_crawler.items import Paragraph


class ParagraphPreprocessor(object):
    def __init__(self, minimum_words_in_paragraph: int) -> None:
        self.minimum_words_in_paragraph = minimum_words_in_paragraph
        self.stemmer = PorterStemmer()

    def extract_all_normalized_words(self, paragraph: str) -> list[str]:
        words = paragraph.split()
        normalized_words = [self.stemmer.stem(word) for word in words]
        return normalized_words

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
        filtered_paragraphs = self.filter_paragraphs(paragraphs)
        return [
            Paragraph(
                text=paragraph,
                normalized_words=self.extract_all_normalized_words(paragraph),
            )
            for paragraph in filtered_paragraphs
        ]
