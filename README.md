# StackWatch

StackWatch is an open-source, production-grade observability platform inspired by **Better Stack**. It provides real-time uptime monitoring, incident alerting, and performance tracking for your websites and APIs. Engineered with a microservices architecture, it ensures reliability and scalability.

![StackWatch Architecture](./architecture/stackwatch-architecture.excalidraw.png)

## 🚀 Features

-   **Real-time Uptime Monitoring**: Distributed health checks for your services.
-   **Incident Alerting**: Instant email notifications when services go down.
-   **Performance Metrics**: Track response times and latency trends via TimescaleDB.
-   **Monorepo Architecture**: Efficient code sharing and build pipelines using TurboRepo.
-   **Authentication**: Secure user management with Better Auth.

## �️ Tech Stack

### Core
-   **Runtime**: [Bun](https://bun.sh/) (Fast JavaScript runtime)
-   **Monorepo Tooling**: [TurboRepo](https://turbo.build/)
-   **Language**: TypeScript

### Services
-   **Frontend**: Next.js 14, React, TailwindCSS, Shadcn UI
-   **Backend API**: Node.js, Express
-   **Background Workers**: Node.js, BullMQ

### Infrastructure
-   **Relational Database**: PostgreSQL (Users, Sites, Config)
-   **Time-Series Database**: TimescaleDB (Metrics, Latency logs)
-   **Queue & Caching**: Redis (Task scheduling, Job queues)
-   **Containerization**: Docker & Docker Compose

## 📂 Project Structure

This project is organized as a monorepo.

| Path | Service | Description |
| :--- | :--- | :--- |
| `apps/web` | **Web Dashboard** | Next.js admin interface for managing monitors and viewing analytics. |
| `apps/api` | **API Server** | Express REST API handling users, monitors, and data retrieval. |
| `apps/pusher-service` | **Scheduler** | Fetches active monitors from DB and pushes jobs to Redis Streams (Producer). |
| `apps/worker-service` | **Uptime Worker** | Consumes jobs, pings websites, records metrics to TimescaleDB, and triggers alerts (Consumer). |
| `apps/email-service` | **Notification** | Consumes email jobs from BullMQ and sends SMTP alerts. |
| `packages/` | **Shared Libs** | Shared configurations, database clients (`@repo/database`), and utilities. |

## ⚙️ Environment Configuration

You must configure environment variables for the application to run.

### `.env.docker` (Recommended for Docker)
This file is used when running with `docker-compose`.

> **Note**: In Docker, services communicate using internal container hostnames (e.g., `stackwatch-db`, `stackwatch-redis`).

```env
# --- General ---
# The URL for the web dashboard (accessed by browser)
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_generated_secret_here

# --- API ---
BACKEND_PORT=3001
BACKEND_URL=http://stackwatch-api:3001/api

# --- CORS ---
MAINORIGINS=http://stackwatch-api:3001
MAINORIGINS2=http://localhost:3000

# --- Databases ---
# Internal Docker URL for PostgreSQL
DATABASE_URL="postgresql://postgres:stackwatch@stackwatch-db:5432/stackwatch"

# Internal Docker URL for Redis
REDIS_URL=redis://stackwatch-redis:6379

# --- Time-Series (TimescaleDB) ---
HOST=stackwatch-timeseries
TS_PORT=5432
DATABASE_NAME=metrics
USERNAME_NAME=tsdb
PASSWORD_NAME=tsdb

# --- Worker Configuration ---
REGION_ID="region_usa"
WORKER_ID="usa:worker:01"
TIME_INTERVAL=3 # Check interval in minutes

# --- Email Service ---
EMAIL_SERVICE="gmail"
EMAIL_SERVICE_USER="your-email@gmail.com"
EMAIL_SERVICE_PASS="your-app-password"
```

### Local Development `.env`
If running manually (without Docker Compose), update hostnames to `localhost` and ports to exposed host ports (e.g., DB on `5434`, TSDB on `5435`).

## 🐳 Docker Setup (Recommended)

The easiest way to run StackWatch is using Docker Compose. This spins up all services, databases, and queues with a single command.

### Prerequisites
- Docker & Docker Compose installed.

### 1. Build and Run
```bash
docker-compose up --build
```
This command will:
1.  Build all application images.
2.  Start PostgreSQL, TimescaleDB, and Redis.
3.  Run automated database migrations (`stackwatch-init-migrations`).
4.  Start all application services.

### 2. Access the Application
-   **Web Dashboard**: [http://localhost:3000](http://localhost:3000)
-   **API**: [http://localhost:3001](http://localhost:3001)

### Docker Commands Reference

| Command | Description |
| :--- | :--- |
| `docker-compose up -d` | Start services in background. |
| `docker-compose up --build` | Rebuild images and start. |
| `docker-compose down` | Stop and remove containers. |
| `docker-compose down -v` | Stop and **delete all data** (volumes). |
| `docker-compose logs -f [service]` | View logs (e.g., `docker-compose logs -f stackwatch-worker-service`). |

## 🔧 Manual Setup (Without Docker)

If you prefer to run services individually on your machine:

### 1. Install Dependencies
```bash
bun install
```

### 2. Start Infrastructure
You still need the databases. You can spin them up via Docker:

```bash
# PostgreSQL (Port 5434)
docker run -d -p 5434:5432 -e POSTGRES_PASSWORD=stackwatch -e POSTGRES_DB=stackwatch postgres

# TimescaleDB (Port 5435)
docker run -d -p 5435:5432 -e POSTGRES_PASSWORD=tsdb -e POSTGRES_DB=metrics timescale/timescaledb:latest-pg16

# Redis (Port 6379)
docker run -d -p 6379:6379 redis
```

### 3. Configure Env
Create `.env` files in `apps/api`, `apps/web`, `apps/worker-service` pointing to `localhost` and the ports above (`5434`, `5435`).

### 4. Database Migration
Initialize the database schema:
```bash
bun run --cwd packages/database db:push
```

### 5. Start Services
Run these in separate terminals:

```bash
# API
bun run --cwd apps/api dev

# Web
bun run --cwd apps/web dev

# Worker System
bun run --cwd apps/pusher-service dev
bun run --cwd apps/worker-service dev
bun run --cwd apps/email-service dev
```

## 🔌 Service Ports

| Service | Host Port | Internal Port | Description |
| :--- | :--- | :--- | :--- |
| **Web** | `3000` | `3000` | Frontend Interface |
| **API** | `3001` | `3001` | Backend API |
| **PostgreSQL** | `5434` | `5432` | Main Database |
| **TimescaleDB** | `5435` | `5432` | Metrics Database |
| **Redis** | `6379` | `6379` | Queue/Cache |

## � Production Notes

1.  **Environment Variables**: Ensure `BETTER_AUTH_SECRET` is a strong, random string.
2.  **Database Persistence**: Ensure Docker volumes are backed up.
3.  **Security**:
    -   Put the API and Web Dashboard behind a reverse proxy (Nginx/Traefik) with SSL.
    -   Restrict `MAINORIGINS` to your actual domain.
4.  **Scaling**: The `worker-service` is stateless and can be scaled horizontally to handle more monitors.

## 🤝 Contribution

We welcome contributions!

1.  **Add a Service**: Create a new folder in `apps/`, add `package.json`, and verify `turbo.json` config.
2.  **Linting**: Run `bun run lint` before committing.
3.  **Conventions**: usage of `camelCase` for code, `kebab-case` for filenames.

---

Built with ❤️ using [TurboRepo](https://turbo.build/) and [Bun](https://bun.sh/).