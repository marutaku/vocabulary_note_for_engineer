.PHONY: lint fmt crawl typecheck

lint:
	poetry run ruff check .

fmt:
	poetry run ruff format .

crawl:
	poetry run scrapy crawl technical_docs -O $(export_feed_path)

typecheck:
	poetry run mypy .