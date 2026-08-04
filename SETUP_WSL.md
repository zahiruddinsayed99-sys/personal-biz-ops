# Setting up BusinessHub AI locally (WSL)

## 1. Environment Configuration

Copy the template environment variables:
```bash
cp env.example .env
```
Ensure to review the default values and update them if needed, specifically the ones related to secrets.

## 2. Start Services

Start the underlying database, redis and object storage using Docker Compose:

```bash
docker-compose up -d
```

## 3. Verify Connections

Check if the Postgres, Redis and MinIO ports are active locally.

You can verify it by checking the logs of the running containers:

```bash
docker-compose ps
docker-compose logs -f
```
