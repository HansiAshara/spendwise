# Deployment Guide

This document describes the deployment options, environment variables, build procedures, and configuration considerations for SpendWise.

---

## 1. Supported Deployment Targets

The repository includes configuration supporting two primary deployment methods:
1. **Serverless Deployment (Vercel)**
2. **Containerized Deployment (Docker)**

---

## 2. Serverless Deployment on Vercel

### Architecture
* **Frontend (`apps/web`)**: Next.js 16 App Router application deployed as a standard Vercel project.
* **Backend (`apps/api`)**: Adapted to run as a serverless function via the root [`vercel.json`](file:///d:/spendwise/vercel.json) and [`api/index.ts`](file:///d:/spendwise/api/index.ts) bridge.

```text
Incoming Request ➔ vercel.json rewrite ➔ api/index.ts ➔ apps/api/src/index.ts (Express App)
```

### Configuration (`vercel.json`)
```json
{
  "version": 2,
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index"
    }
  ]
}
```

> [!IMPORTANT]
> **Vercel Monorepo Note**: The root `vercel.json` rewrites all routes `/(.*)` to `/api/index`, which routes all traffic into the Express API. When deploying to Vercel, the frontend (`apps/web`) and the backend API are typically deployed as **two separate Vercel projects**:
> 1. **Project 1 (API)**: Root directory `.`, uses `vercel.json` to expose the Express backend.
> 2. **Project 2 (Web)**: Root directory `apps/web`, uses standard Next.js build (`next build`).

---

## 3. Containerized Deployment (Docker)

### Multi-Stage Dockerfile (`apps/api/Dockerfile`)
The backend provides a multi-stage Docker build based on `node:20-bookworm-slim`:

* **Stage 1 (Builder)**: Installs development dependencies, generates Prisma client (`npx prisma generate`), and compiles TypeScript via `npm run build` into `dist/`.
* **Stage 2 (Production)**: Copies only production dependencies (`npm install --omit=dev`), the generated Prisma client, and the compiled `dist/` directory, exposing port `5000`.

### Building the Docker Image Manually
```bash
# Build the Docker image from apps/api context
docker build -t spendwise-api -f apps/api/Dockerfile apps/api
```

---

## 4. Required Production Environment Variables

### Backend API Variables
Configure these variables in your deployment environment (e.g., Vercel Project Settings, Docker environment, or container runner):

| Variable | Required | Safe Placeholder Example | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | `5000` | Port for Express HTTP listener (defaults to 5000). |
| `NODE_ENV` | Yes | `production` | Enables production error masking and logging. |
| `CORS_ORIGIN` | Yes | `https://spendwise.yourdomain.com` | Whitelisted frontend origin for CORS. |
| `DATABASE_URL` | Yes | `postgresql://user:pass@host:5432/spendwise?sslmode=require` | Connection string for production PostgreSQL database. |
| `JWT_SECRET` | Yes | `min_32_char_cryptographically_secure_random_string` | Secret key used to sign and verify JWT tokens. |
| `JWT_EXPIRES_IN` | Optional | `7d` | Token expiration period. |
| `GEMINI_API_KEY` | Yes | `your_production_google_gemini_api_key` | API key for Google Gemini AI financial advice. |
| `CLOUDINARY_CLOUD_NAME` | Optional | `your_cloudinary_cloud_name` | Cloudinary cloud identifier for avatar uploads. |
| `CLOUDINARY_API_KEY` | Optional | `123456789012345` | Cloudinary API access key. |
| `CLOUDINARY_API_SECRET` | Optional | `your_cloudinary_api_secret` | Cloudinary API secret. |
| `SMTP_HOST` | Optional | `smtp.sendgrid.net` | Outgoing SMTP server hostname for password reset. |
| `SMTP_PORT` | Optional | `587` | SMTP port (587 for STARTTLS). |
| `SMTP_USER` | Optional | `apikey` | SMTP authentication username. |
| `SMTP_PASS` | Optional | `your_smtp_api_password` | SMTP authentication password. |
| `SMTP_FROM` | Optional | `SpendWise <noreply@yourdomain.com>` | Sender email header for outgoing notifications. |
| `FRONTEND_URL` | Optional | `https://spendwise.yourdomain.com` | Base URL used when formatting password reset links. |
| `GOOGLE_CLIENT_ID` | Optional | `123456-abc.apps.googleusercontent.com` | Google OAuth client ID for verifying Google Sign-In tokens. |

### Frontend Variables
Configure these variables in your frontend deployment environment:

| Variable | Required | Safe Placeholder Example | Description |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Yes | `https://api.yourdomain.com` | Public base URL of the SpendWise backend API. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`| Optional | `123456-abc.apps.googleusercontent.com` | Google OAuth Client ID loaded into Google Identity Services. |

---

## 5. Production Database Synchronization

Before starting the backend in production, ensure the database schema is pushed and initial categories are seeded:

```bash
cd apps/api

# 1. Push schema to production PostgreSQL
npx prisma db push

# 2. Seed initial categories
npm run seed
```

---

## 6. Continuous Deployment (CD) Flow

* **Automated CI**: GitHub Actions ([`.github/workflows/ci.yml`](file:///d:/spendwise/.github/workflows/ci.yml)) tests the backend with a transient PostgreSQL container and validates the frontend Next.js production build on every commit.
* **CD Pipeline**: Automatic deployment is managed via Vercel's GitHub integration. When commits merge into `main` and CI passes, Vercel triggers automated production deployments for connected projects.

---

## 7. Identified Deployment Gaps & Inconsistencies

During code inspection, the following discrepancies were identified in the existing deployment files:

1. **`docker-compose.yml` Database Mismatch**:
   - `docker-compose.yml` defines an MS SQL Server container (`mcr.microsoft.com/mssql/server:2022-latest`) with `DATABASE_URL: "sqlserver://mssql:1433;..."`.
   - The active Prisma schema (`apps/api/prisma/schema.prisma`) specifies `provider = "postgresql"`.
   - *Impact*: Running `docker-compose up` will result in a connection failure because the Prisma client is built for PostgreSQL, not SQL Server.

2. **`Dockerfile` Entrypoint**:
   - `apps/api/Dockerfile` line 77 sets `CMD ["node", "dist/index.js"]`.
   - `apps/api/src/index.ts` only exports the Express `app` without executing `app.listen()`. The HTTP listener is located in `apps/api/src/server.ts` (which compiles to `dist/server.js`).
   - *Impact*: Running the container with `dist/index.js` will immediately terminate after loading the module without binding port 5000. For standalone container execution, the command should be `CMD ["node", "dist/server.js"]`.
