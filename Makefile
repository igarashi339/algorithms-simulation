# すべてのサービスを起動
.PHONY: up
up:
	COMPOSE_HTTP_TIMEOUT=240 docker-compose up -d

# すべてのサービスを停止
.PHONY: down
down:
	docker-compose down

# backendコンテナに入る
.PHONY: shell
shell:
	docker-compose exec backend bash

# すべてのコンテナとイメージを削除する
.PHONY: delete-all
delete-all:
	bash scripts/delete_all_containers_and_images.sh

# テストを実行する
.PHONY: test
test:
	make backend-unit-test
	make backend-function-test

# backendの単体テストを実行する
.PHONY: backend-unit-test
backend-unit-test:
	docker-compose exec -T backend bash scripts/run_unit_test.sh

# backendの機能テストを実行する
.PHONY: backend-function-test
backend-function-test:
	docker-compose exec -T backend bash scripts/run_function_test.sh

# キャッシュを削除してビルドする
.PHONY: build
build:
	docker-compose build --no-cache

# ホストとコンテナのユーザを一致させてfrontendコンテナに入る
.PHONY: dev-shell
dev-shell:
	docker exec -u $(shell id -u) -it algorithms-simulation_frontend_1 sh
