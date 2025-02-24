# Table of Contents

1. [About this Project](#about-this-project)
2. [Overview](#overview)
3. [Project Structure](#project-structure)
4. [Running the Project](#running-the-project)
   - [Install Docker & Docker Compose](#1%EF%B8%8F%E2%83%A3-install-docker--docker-compose)
   - [Configure Environment Variables](#2%EF%B8%8F%E2%83%A3-configure-environment-variables)
   - [Start the Project](#3%EF%B8%8F%E2%83%A3-start-the-project)
5. [Logs and services](#logs-and-services)
6. [Running Tests](#running-tests)
7. [API Docs (Swagger)](#api-docs-swagger)
8. [Database Migrations](#database-migrations)
   - [Generate New Migrations](#generate-new-migrations)
   - [Apply Migrations](#apply-migrations)
     - [Restart Docker Services](#option-1-restart-docker-services)
     - [Run Migrations Manually](#option-2-run-migrations-manually)

---

# About this Project
This project was made for the **Didomi Backend Engineering Challenge**.  
Challenge details: [Didomi Backend Challenge](https://github.com/didomi/challenges/tree/master/backend)

---

# Overview

This is a monorepo which includes the users and consents services, along with a shared library. To showcase my skills effectively, I applied Domain-Driven Design (DDD) principles and followed Clean Architecture for the users service. For the consents service, I opted for a simpler approach, adhering to NestJS's default modular structure.

I have used one PostgreSQL database for each service and RabbitMQ for messaging and communication between both.

## Project Structure

```
/monorepo-root
  /apps       
    /consents
    /users    
  /libs       
    /common   
    /messaging
    /database
```

---

# Running the Project
### 1️. Install Docker & Docker Compose
This project uses **Docker** and **Docker Compose** for containerized execution. Ensure both are installed.

### 2️. Configure Environment Variables
Each service requires a `.env` file. Copy the example files and rename them:

```bash
cp apps/consents/.env.example apps/consents/.env
cp apps/users/.env.example apps/users/.env
```

### 3️. Start the Project
Run the following command to start all services in **detached mode**:

```bash
docker compose up -d
```

#### Note: Node version used: v22.14.0

---

# Logs and services

## To view the logs of the **users** and **consents** services, run:

```bash
docker compose logs -f users
docker compose logs -f consents
```

## PostgreSQL
### Users Service DB
```
DB_HOST=postgres
DB_PORT=5432
DB_USER=root
DB_PASSWORD=root
DB_NAME=users_db
```

### Consents Service DB
```
DB_PORT=5432
DB_USER=root
DB_PASSWORD=root
DB_NAME=consents_db
```
## RabbitMQ
- Go to http://localhost:15672 to check RabbitMQ messages and queues.
---

# Running Tests

Run all **unit tests**:
```bash
npm run test
```

Run **unit tests for a specific service**:
```bash
# Users service tests
npm run test apps/users

# Consents service tests
npm run test apps/consents
```

---

# API Docs (Swagger)
Each service provides **Swagger API documentation**:

- **Users API Docs** → [http://localhost:3001/docs](http://localhost:3001/docs)
- **Consents API Docs** → [http://localhost:3002/docs](http://localhost:3002/docs)

---

# Database Migrations

### Generate New Migrations
To generate a new migration, run the appropriate command for the service:

```bash
export DB_HOST=localhost && npm run migration:users:generate --name=MigrationName
```

```bash
export DB_HOST=localhost && npm run migration:consents:generate --name=MigrationName
```

### Apply Migrations
You can apply new migrations in two ways:

#### **Option 1: Restart Docker Services**
```bash
docker compose restart
```

#### **Option 2: Run Migrations Manually**
```bash
export DB_HOST=localhost && npm run migration:users:run
```
```bash
export DB_HOST=localhost && npm run migration:consents:run
```

