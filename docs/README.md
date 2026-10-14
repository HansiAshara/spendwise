# SpendWise Developer Documentation

Welcome to the technical documentation for the **SpendWise** repository. This documentation is written for software engineers maintaining, testing, and extending the SpendWise codebase.

SpendWise is organized as an npm workspaces monorepo containing a modern Next.js frontend (`apps/web`) and an Express/Prisma REST API backend (`apps/api`).

---

## Documentation Index

| Document | Description |
| :--- | :--- |
| **[Getting Started](getting-started.md)** | Prerequisites, local installation, environment variables, database setup, and troubleshooting common problems. |
| **[Architecture](architecture.md)** | High-level system design, monorepo workspace structure, component responsibilities, data flow, and Mermaid architecture diagram. |
| **[Database Guide](database.md)** | Prisma ORM configuration, schema models, constraints, relationships, seeding, and Mermaid Entity-Relationship (ER) diagram. |
| **[API Reference](api.md)** | Exhaustive endpoint documentation with HTTP methods, URL parameters, request payloads, response bodies, and error formatting. |
| **[Authentication & Security](authentication-and-security.md)** | Details on local JWT authentication, Google OAuth verification, password hashing, route protection, data ownership isolation, and identified security gaps. |
| **[Development & Testing](development-and-testing.md)** | Workspace commands, coding patterns, step-by-step guide to adding features, test architecture (unit and integration), and CI workflow breakdown. |
| **[Deployment Guide](deployment.md)** | Production build commands, Docker setup, Vercel serverless integration, deployment variables, and identified configuration discrepancies. |

---

## Recommended Reading Order

For a new developer onboarding onto SpendWise, the recommended reading flow is:

1. **[Getting Started](getting-started.md)**: Set up your local machine, environment variables, database, and run both services.
2. **[Architecture](architecture.md)**: Understand how the client, backend, database, and third-party services interact.
3. **[Database Guide](database.md)**: Familiarize yourself with the data models (`User`, `Category`, `Expense`, `Budget`) and user-scoping rules.
4. **[API Reference](api.md)**: Review existing endpoints and standard JSON response envelopes before building new features.
5. **[Authentication & Security](authentication-and-security.md)**: Learn how access tokens, route protection, and ownership checks safeguard user data.
6. **[Development & Testing](development-and-testing.md)**: Learn existing development workflows, coding conventions, and testing practices before opening pull requests.
7. **[Deployment Guide](deployment.md)**: Review container and cloud hosting mechanics when preparing releases.
