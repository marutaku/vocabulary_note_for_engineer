import re
import string

import nltk
from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import RegexpTokenizer

from document_crawler.items import Paragraph

nltk.download("wordnet")
nltk.download("averaged_perceptron_tagger")


class ParagraphPreprocessor(object):
    def __init__(self, minimum_words_in_paragraph: int) -> None:
        self.minimum_words_in_paragraph = minimum_words_in_paragraph
        self.lemmatizer = WordNetLemmatizer()
        self.regex_clean_html_tags = re.compile(r"<.*?>")
        self.tokenizer = RegexpTokenizer(r"\w+")

    def get_word_pos(self, word: str) -> str:
        # 品詞情報を取り出します
        tag = nltk.pos_tag([word])[0][1][0].upper()
        tag_dict = {
            "J": wordnet.ADJ,
            "N": wordnet.NOUN,
            "V": wordnet.VERB,
            "R": wordnet.ADV,
        }
        return tag_dict.get(tag, wordnet.NOUN)

    def lemmatize(self, word: str) -> str:
        pos = self.get_word_pos(word)
        return self.lemmatizer.lemmatize(word, pos)

    def extract_all_normalized_words(self, paragraph: str) -> list[str]:
        # Replace URL-like strings
        paragraph = re.sub(r"(http|https)://[^\s]+", "", paragraph)
        paragraph = paragraph.lower()
        words = self.tokenizer.tokenize(paragraph)
        normalized_words = [self.lemmatize(word).lower() for word in words]
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
