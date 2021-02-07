# すべてのサービスを起動
.PHONY: up
up:
	docker-compose up -d

# すべてのサービスを停止
.PHONY: down
down:
	docker-compose down

# developコンテナに入る
.PHONY: shell
shell:
	docker-compose exec develop bash

# developコンテナの上でWebサーバを起動する
.PHONY: server
server:
	docker-compose exec develop bash scripts/run_local_server.sh

# すべてのコンテナとイメージを削除する
.PHONY: delete-all
delete-all:
	bash scripts/delete_all_containers_and_images.sh

# テストを実行する
.PHONY: test
test:
	docker-compose exec -T develop bash scripts/run_algorithm_tests.sh
