.PHONY: start
start:
	deno run --watch --allow-net --allow-read --allow-env --allow-write main.ts

.PHONY: format
format:
	deno fmt

.PHONY: test
test:
	deno fmt --check
	deno lint
	deno check .
	deno test --allow-net --allow-read --allow-env=PORT --check
