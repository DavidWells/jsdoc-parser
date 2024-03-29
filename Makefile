
TESTS = test/*.test.js
REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--ui exports \
		--reporter $(REPORTER) \
		$(TESTS)

.PHONY: test docs
