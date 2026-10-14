# Getting Started

This guide explains how to set up, configure, and run the SpendWise project locally on your development machine.

---

## 1. Prerequisites

Before setting up SpendWise, ensure you have the following installed:

| Tool | Supported / Required Version | Notes |
| :--- | :--- | :--- |
| **Node.js** | `>= 20.x` | Verified in CI (`ubuntu-latest`, node 20) and Dockerfile (`node:20-bookworm-slim`). |
| **npm** | `>= 9.x` | Monorepo uses npm workspaces (`workspaces: ["apps/*"]`). |
| **PostgreSQL** | `>= 14.x` | The active Prisma schema uses `provider = "postgresql"`. Local instance or managed cloud instance (e.g., Neon, Supabase, AWS RDS). |
| **Git** | Any modern version | For version control. |

---

## 2. Clone and Install Dependencies

SpendWise is configured as an **npm workspaces monorepo**. All dependencies for both the frontend (`apps/web`) and backend (`apps/api`) should be installed from the repository root:

```bash
# 1. Clone the repository
git clone https://github.com/HansiAshara/spandwise.git
cd spendwise

# 2. Install dependencies for all workspaces
npm install
```

> [!NOTE]
> When `npm install` runs, the backend workspace automatically executes a `postinstall` hook (`prisma generate`) to compile the Prisma client.

---

## 3. Environment Configuration

SpendWise requires environment configuration in both the backend and frontend workspaces. Example templates are provided in the repository.

### Backend Configuration (`apps/api/.env`)

Create `apps/api/.env` by copying `apps/api/.env.example` or creating the file with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/spendwise?schema=public"

# Authentication
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d

# AI Services (Google Gemini)
GEMINI_API_KEY=your_google_gemini_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Media Storage (Cloudinary - Optional for avatar uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (SMTP - Optional for password resets)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="SpendWise <noreply@spendwise.com>"
FRONTEND_URL=http://localhost:3000

# Google OAuth (Optional - for Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> [!IMPORTANT]
> The backend server strictly validates environment variables on boot (`apps/api/src/config/env.ts`). If `DATABASE_URL`, `JWT_SECRET`, or `GEMINI_API_KEY` is missing or empty, the server will intentionally throw an error and terminate immediately.

### Frontend Configuration (`apps/web/.env.local`)

Create `apps/web/.env.local` by copying `apps/web/.env.example`:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Google OAuth Client ID (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

## 4. Database Setup & Seeding

The database schema is defined using Prisma (`apps/api/prisma/schema.prisma`).

```bash
# Navigate to the API workspace
cd apps/api

# 1. Generate the Prisma client
npx prisma generate

# 2. Push the schema to your PostgreSQL database
npx prisma db push

# 3. Seed default expense categories
npm run seed
```

### Seeding Information
Running `npm run seed` executes `prisma/seed.ts`, which populates the `categories` table with 8 default categories (Education, Food, Health, Transport, Utilities, Entertainment, Shopping, and Other) using `upsert` queries to prevent duplicate records.

> [!NOTE]
> SpendWise uses `npx prisma db push` rather than `npx prisma migrate dev` because the existing migration history in `apps/api/prisma/migrations/` was initially generated against SQL Server, while the active schema target is PostgreSQL.

---

## 5. Starting the Application

You can start both applications concurrently from the root directory in separate terminal windows:

### Terminal 1: Backend API
```bash
npm run dev:api
```
* **Command run internally**: `npm run dev --workspace=apps/api` (`nodemon --watch src --ext ts --exec tsx src/server.ts`)
* **Default Port**: `5000`
* **Reload behavior**: Automatically reloads when files in `apps/api/src/` change.

### Terminal 2: Frontend Web App
```bash
npm run dev:web
```
* **Command run internally**: `npm run dev --workspace=apps/web` (`next dev`)
* **Default Port**: `3000`
* **Local URL**: [http://localhost:3000](http://localhost:3000)

---

## 6. Verifying the Setup

1. **Verify Backend Health**:
   Open a terminal or browser and query the health endpoint:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected response:
   ```json
   {
     "success": true,
     "message": "SpendWise API is running ✅",
     "timestamp": "2026-10-14T11:30:00.000Z"
   }
   ```

2. **Verify Frontend**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser. You should see the SpendWise landing page. Click **Register** to create a test user and verify database connectivity.

---

## 7. Common Setup Problems & Solutions

### Problem 1: Server fails to start with `Missing required environment variable`
* **Cause**: `apps/api/src/config/env.ts` executes `requireEnv()` for required keys (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`).
* **Fix**: Ensure your `apps/api/.env` file exists and that all three required variables contain valid, non-empty values.

### Problem 2: Prisma fails with `P1001: Can't reach database server`
* **Cause**: PostgreSQL is not running, or connection credentials in `DATABASE_URL` are incorrect.
* **Fix**: Verify your PostgreSQL server is active on the expected port (typically `5432`). Test the connection string using `psql` or a GUI client (e.g. pgAdmin, DBeaver).

### Problem 3: CORS error in the browser when making API requests
* **Cause**: The origin sent by the browser does not match `CORS_ORIGIN` in `apps/api/.env`.
* **Fix**: Ensure `CORS_ORIGIN` in `apps/api/.env` is set to `http://localhost:3000` during local development.

### Problem 4: `Port 5000 already in use`
* **Cause**: Another service or an orphaned Node.js instance is occupying port 5000.
* **Fix**: Terminate the existing process using the port, or change `PORT=5001` in `apps/api/.env` and update `NEXT_PUBLIC_API_URL=http://localhost:5001` in `apps/web/.env.local`.

### Problem 5: Missing Prisma Client types or `@prisma/client` runtime errors
* **Cause**: Prisma client was not regenerated after changes or dependency installation.
* **Fix**: Run `npx prisma generate` inside `apps/api/`.
