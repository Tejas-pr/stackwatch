# StackWatch

StackWatch is an all-in-one observability platform inspired by **Better Stack** for monitoring logs, uptime, and application performance. It allows you to track your services, visualize metrics, and get alerted when things go wrong.

![Architecture](./architecture/stackwatch-architecture.excalidraw.png)

## 🚀 Features

- **Uptime Monitoring**: Global latency and uptime tracking from multiple regions.
- **Log Management**: Centralized logging for easy debugging and auditing.
- **Performance Tracking**: Monitor application performance metrics.
- **Real-time Alerts**: Get notified immediately when incidents occur.
- **Monorepo Architecture**: specific separation of concerns between API, Dashboard, and Workers.

## 📦 Services Overview

This project is organized as a monorepo using **TurboRepo**.

| Service            | Path                  | Description                                                      | Stack                                    |
| :----------------- | :-------------------- | :--------------------------------------------------------------- | :--------------------------------------- |
| **Web Dashboard**  | `apps/web`            | The administrative interface for viewing metrics and logs.       | Next.js, React, TailwindCSS, Better Auth |
| **API Server**     | `apps/api`            | The core REST API handling user requests and logic.              | Node.js, Express, Prisma                 |
| **Worker Service** | `apps/worker-service` | Background service that performs the actual uptime checks/pings. | Node.js, Redis (Queue), TimescaleDB      |
| **Pusher Service** | `apps/pusher-service` | Handles real-time data pushes and interval-based events.         | Node.js, Redis,               |

## 🛠️ Tech Stack

- **Package Manager**: `bun`
- **Monorepo**: TurboRepo
- **Database (Relational)**: PostgreSQL
- **Database (Time-Series)**: TimescaleDB
- **ORM**: Prisma
- **Authentication**: Better Auth

## ⚙️ Environment Variables

To run the application, you need to configure environment variables for each service.

### Common Variables

These are used across multiple services (Web, API).

```env
DATABASE_URL="postgresql://postgres:stackwatch@localhost:5434/stackwatch"
BETTER_AUTH_SECRET="your_generated_secret"
BETTER_AUTH_URL="http://localhost:3000"
BACKEND_PORT=3001
BACKEND_URL="http://localhost:3001/api"
```

### Service-Specific Variables
Configuration for the monitoring agents.

```env
MAINORIGINS=
MAINORIGINS2=

BACKEND_PORT=3001
BACKEND_URL=http://localhost:3001/api

DATABASE_URL="postgresql://postgres:stackwatch@localhost:5434/stackwatch"

BETTER_AUTH_SECRET=H1Tu2QUjxpt94vRIkxEz5kHUFOVGXGGP
BETTER_AUTH_URL=http://localhost:3000

STREAM_NAME=stackwatch:websites
COUNT=5

HOST=localhost
PORT=5435
DATABASE_NAME=metrics
USERNAME_NAME=tsdb
PASSWORD_NAME=tsdb
MAX=10

TIME_INTERVAL=3
REGION_ID="region_usa"
WORKER_ID="usa:worker:01"
```

## ⚡ Getting Started

### Prerequisites

- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/) (for databases)

### 1. Start Infrastructure

Start the required databases (PostgreSQL and TimescaleDB).

**TimescaleDB (Metrics):**

```bash
docker run -d \
  -p 5434:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=stackwatch \
  -e POSTGRES_DB=stackwatch \
  -v stackwatch_pgdata:/var/lib/postgresql/data \
  --name stackwatch \
  postgres

docker run -d -p 5435:5432 --name stackwatch-timescale \
  -e POSTGRES_USER=tsdb \
  -e POSTGRES_DB=metrics \
  -e POSTGRES_PASSWORD=tsdb \
  -v ts_data:/var/lib/postgresql/data \
  timescale/timescaledb:latest-pg16
```

**PostgreSQL (Application Data):**
Ensure your main Postgres instance is running on port **5434** (as per your `.env`) or update the `DATABASE_URL` to match your local setup.

### 2. Install Dependencies

```bash
bun install
```

### 3. Database Setup

Initialize the schema and push changes to the database.

```bash
bun run db:push
# or
bun run db:migrate:dev
```

### 4. Configure Environment

Create `.env` files in `apps/web/`, `apps/api/`, `apps/worker-service/`, and `apps/pusher-service/` with the values described in the [Environment Variables](#-environment-variables) section above.

### 5. Run Development Server

Start all applications simultaneously:

```bash
bun run dev
```

This will launch:

- **Web**: `http://localhost:3000`
- **API**: `http://localhost:3001`
- **Workers**: Background processes

## 🚧 Roadmap & In Progress

The following items are currently under active development:

- **CI/CD Pipelines**: Github Actions workflows for automated testing and deployment.
- **Docker Orchestration**: Full `docker-compose.yml` to spin up the entire stack (App + DBs) with a single command.
- **Enhanced Alerting**: Integrations with Slack/Email/SMS.

---

Inspired by [Better Stack](https://betterstack.com/)

### TODO:
1. Refresh token and access token.
2. Docker and docker compose files.
3. Email trigger service.
4. Write tests.
5. Notification service.