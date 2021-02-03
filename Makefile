.PHONY: up
up:
	docker-compose up -d

.PHONY: shell
shell:
	docker-compose exec develop bash

.PHONY: down
down:
	docker-compose down

.PHONY: server
server:
	python manage.py runserver 0:8000