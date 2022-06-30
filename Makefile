.PHONY: start
start:
	deno run --watch --allow-net --allow-read=public,pages --allow-env=PORT main.ts

.PHONY: format
format:
	deno fmt

.PHONY: test
test:
	deno fmt --check
	deno lint
	deno test --allow-net --allow-read=public,pages --allow-env=PORT --check=all
