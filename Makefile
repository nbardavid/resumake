.PHONY: up down restart logs

up:
	docker-compose up -d --build

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f
