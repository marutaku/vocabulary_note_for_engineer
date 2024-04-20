import json
import sys
from hashlib import sha256

from firebase_admin import credentials, firestore, initialize_app

from document_crawler.types import Example, Record


def load_json_file(file_path: str):
    with open(file_path, "r") as f:
        return json.load(f)


def load_json_from_stdin():
    return json.load(sys.stdin)


def get_sha256_hash(text: str) -> str:
    return sha256(text.encode()).hexdigest()


def insert_example(firestore_db, word: str, example: Example):
    example_hash = get_sha256_hash(example["url"])
    doc_ref = (
        firestore_db.collection("words")
        .document(word)
        .collection("examples")
        .document(example_hash)
    )
    doc = doc_ref.get()
    if doc.exists:
        return
    doc_ref.set(example)


def insert_word(firestore_db, word: str, record: Record):
    doc_ref = firestore_db.collection("words").document(word)
    doc = doc_ref.get()
    if not doc.exists:
        doc_ref.set(
            {
                "meaning": record["meaning"],
            }
        )
    for example in record["examples"]:
        insert_example(firestore_db, word, example)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("service_account_key_path", type=str)
    parser.add_argument("--json_file_path", type=str)
    args = parser.parse_args()

    cred = initialize_app(
        credential=credentials.Certificate(args.service_account_key_path)
    )
    db = firestore.client()

    if args.json_file_path:
        data = load_json_file(args.json_file_path)
    else:
        data = load_json_from_stdin()
    for word, record in data.items():
        print(f"Inserting word: {word} with {len(record['examples'])} examples.")
        insert_word(db, word, record)
