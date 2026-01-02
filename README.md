# Clean Architecture API

This project is a RESTful API built with TypeScript and the Bun runtime. It implements a Clean Architecture approach to separate business logic from infrastructure concerns. 

It features a complete authentication system using JWT and a granular Role-Based Access Control (RBAC) mechanism.

## Core Architecture

The codebase is structured around Clean Architecture principles, creating a clear separation of concerns.

-   **`src/core`**: This directory contains the application's core business logic. It is completely independent of any external frameworks or tools.
    -   **`entities`**: Domain objects (e.g., `User`, `Permission`).
    -   **`repositories`**: Interfaces defining the contracts for data persistence (e.g., `UserRepository`). The implementations are injected from the `infra` layer.
    -   **`use-cases`**: Application-specific business rules and operations.
    -   **`ports`**: Interfaces for other external services, like password hashing or token generation.

-   **`src/infra`**: This directory contains the implementations of the interfaces defined in `core`. It handles all interactions with external systems.
    -   **`database`**: Contains the Drizzle ORM schemas and repository implementations for a PostgreSQL database.
    -   **`http`**: The Fastify web server, including controllers, routes, and middleware.
    -   **`services`**: Concrete implementations of ports.
    -   **`di`**: A dependency injection container to manage and inject dependencies throughout the application.
    
Dependencies always flow inward: **`infra`** depends on **`core`**, never the opposite.
    
## Technology Stack

-   **Runtime**: [Bun](https://bun.sh/)
-   **Framework**: [Fastify](https://fastify.dev/)
-   **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **Schema Validation**: [Zod](https://zod.dev/)
-   **Authentication**: JSON Web Tokens (JWT)
-   **Formatter and Linter**: [Biome](https://biomejs.dev/)

## Project Structure

```text
src
├───main.ts             # Application entry point
├───@types/             # TypeScript declaration files for modules
├───config/             # Environment variable management
├───core/               # Domain & application business logic
│   ├───constants/      # Application-wide constants
│   ├───entities/       # Core domain objects
│   ├───errors/         # Custom application-specific errors
│   ├───ports/          # Abstract interfaces for external services
│   ├───repositories/   # Abstract repository interfaces
│   └───use-cases/      # Application-specific business rules, grouped by feature
│
└───infra/              # Infrastructure layer (frameworks, drivers, tools)
    ├───database/       # Database-specific logic (Drizzle)
    │   ├───repositories/ # Drizzle implementations of core repository interfaces
    │   └───schemas/      # Drizzle ORM table definitions
    │
    ├───di/             # Dependency Injection container setup
    ├───http/           # Web-specific logic (Fastify)
    │   ├───controllers/  # Route handlers connecting HTTP to use-cases
    │   ├───dtos/         # Data Transfer Objects and validation schemas (Zod)
    │   ├───plugins/      # Fastify plugins
    │   └───routes/       # API route definitions
    │
    ├───services/       # Concrete implementations of core ports
    └───utils/          # Utility functions

drizzle/                # Drizzle-kit database migration files
test/                   # Automated tests
```

## Getting Started

### Prerequisites

-   [Bun](https://bun.sh/docs/installation)
-   A running PostgreSQL instance

### 1. Environment Variables

Copy the example environment file and update it with your configuration

```bash
cp .env.example .env.local
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Run Database Migrations

This command applies the SQL migrations located in the `drizzle` directory to your database schema.

```bash
bun run migrations:run
```

### 4. Run the Application

To start the development server with hot-reloading:

```bash
bun run dev
```

The server will be available at `http://localhost:3333` or the port defined in your environment variables.

## Testing

This project uses Bun's built-in test runner. Tests are written to validate the application's use cases in isolation.

Tests for core logic are performed by providing mock implementations of the repository and service interfaces (found in the `test/` directory).

Test files are co-located with the source code, using the `*.test.ts` naming convention.

To run all tests, execute:

```bash
bun test
```

## Scripts

-   `bun run dev`: Start the dev server.
-   `bun run start`: Start the production server.
-   `bun run migrations:generate`: Generate a new migration based on schema changes.
-   `bun run migrations:run`: Apply pending migrations.
-   `bun run lint`: Lint and format the codebase.
