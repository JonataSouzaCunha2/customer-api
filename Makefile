test:
	docker-compose up -d
	docker-compose exec -T application npm test