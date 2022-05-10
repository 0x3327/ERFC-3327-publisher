.PHONY: lint
lint:
	eslint . --ext .js,.jsx,.ts,.tsx

.PHONY: prettier
prettier:
	prettier --write .
