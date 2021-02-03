.PHONY: up
up:
	docker-compose up

.PHONY: shell
shell:
	docker-compose run develop bash

.PHONY: down
down:
	docker-compose down