# Authentication & Security

This document details the authentication architecture, credential handling, route protection, data ownership isolation, and identified security considerations within SpendWise.

---

## 1. Authentication Flows

SpendWise implements three distinct authentication mechanisms: Local Email/Password, Google OAuth 2.0 (Identity Services), and Secure Password Reset.

### 1.1. Local Email & Password
1. **Registration (`POST /api/auth/register`)**:
   - The payload (`name`, `email`, `password`) is validated using `registerSchema` (Zod).
   - Passwords must be at least 6 characters in length.
   - The password is hashed using `bcryptjs` with **12 salt rounds** before storage in the `users` table (`passwordHash`).
   - A signed JWT token is returned alongside the sanitized user record (excluding password hash).
2. **Login (`POST /api/auth/login`)**:
   - Compares the plain password against the stored bcrypt hash using `bcrypt.compare()`.
   - On successful verification, issues a signed JWT token.
   - On mismatch, returns a generic `401 Unauthorized` (`"Invalid email or password"`).

### 1.2. Google OAuth 2.0 Sign-In (`POST /api/auth/google`)
- The frontend renders Google Identity Services (`apps/web/components/auth/GoogleSignInButton.tsx`).
- When the user signs in with Google, Google delivers an `idToken` to the browser.
- The frontend posts the `idToken` to `/api/auth/google`.
- The backend verifies the token using Google's official SDK:
  ```typescript
  // apps/api/src/services/auth.service.ts
  const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
  })
  ```
- If the token is valid, SpendWise locates the user by email or creates a new user with `authProvider: "google"` and `passwordHash: null`.
- A SpendWise JWT token is generated and returned to the client.

### 1.3. Password Reset Flow
1. **Request (`POST /api/auth/forgot-password`)**:
   - Generates a cryptographically secure random token: `crypto.randomBytes(32).toString('hex')`.
   - Calculates a SHA-256 hash of the token and stores `resetTokenHash` with `resetTokenExpiry` (15 minutes).
   - Dispatches an email via Nodemailer (`apps/api/src/config/mailer.ts`) containing the raw token link.
   - Always returns a generic success message to prevent user email enumeration.
2. **Reset (`POST /api/auth/reset-password`)**:
   - Computes SHA-256 of the submitted token and verifies it matches `resetTokenHash` and `resetTokenExpiry > now()`.
   - Hashes the new password with bcrypt (12 salt rounds) and clears the reset token fields.

---

## 2. Token & Session Handling

SpendWise utilizes **stateless JSON Web Tokens (JWT)**. No session state or active token records are stored in the database.

| Attribute | Implementation Details |
| :--- | :--- |
| **Signing Algorithm** | HMAC-SHA256 (`HS256`) via `jsonwebtoken`. |
| **Secret Key** | Configured via `JWT_SECRET` in `apps/api/.env`. |
| **Expiration** | Configured via `JWT_EXPIRES_IN` (defaults to `7d`). |
| **Payload Data** | Minimal identifier payload: `{ userId: number, email: string }`. |

### Client-Side Token Storage & Transmission
1. **Storage**:
   - `localStorage.setItem('spendwise_token', token)`: Persists across browser tabs and sessions.
   - `document.cookie = 'spendwise_token=...; SameSite=Strict'`: Enables server-side proxy route protection in Next.js.
2. **Transmission**:
   - Attached automatically to every outgoing Axios HTTP request as `Authorization: Bearer <token>` (`apps/web/lib/api.ts`).
3. **Route Guarding**:
   - `apps/web/proxy.ts` (Next.js Edge Proxy) inspects the `spendwise_token` cookie. Unauthenticated visitors accessing `/dashboard/*`, `/expenses`, `/budgets`, `/insights`, or `/settings` are redirected to `/login`.

---

## 3. Route Protection & Data Isolation

### Backend Route Guard (`protect` Middleware)
Located in [`apps/api/src/middleware/auth.middleware.ts`](file:///d:/spendwise/apps/api/src/middleware/auth.middleware.ts):

1. Reads the `Authorization` header.
2. Rejects the request with `401 Unauthorized` if the header is absent or does not start with `Bearer `.
3. Verifies the token using `jwt.verify(token, env.jwtSecret)`.
4. Binds `{ userId, email }` to the Express request: `req.user = { userId, email }`.

### Tenant Isolation & Ownership Enforcement
SpendWise enforces data isolation at the service query layer:
- **Zero Cross-Tenant Visibility**: All queries selecting, modifying, or deleting expenses or budgets include `where: { userId: req.user.userId }`.
- **404 Masking**: If a user attempts to view, modify, or delete a resource ID belonging to another user (e.g., `GET /api/expenses/999`), the service returns `Expense not found` (HTTP 404). It never returns 403 Forbidden, preventing attackers from discovering whether a resource ID exists.

---

## 4. Implemented Security Controls

- **Secure HTTP Headers (Helmet)**:
  - `apps/api/src/index.ts` invokes `helmet()`, setting standard security headers including `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, and `X-Frame-Options: SAMEORIGIN`.
- **CORS Configuration**:
  - Whitelists origins matching `env.corsOrigin`, `http://localhost:3000`, `https://spendwise-web-zeta.vercel.app`, and `.vercel.app` subdomains.
- **Input Sanitization & Validation (Zod)**:
  - All incoming request bodies are validated against strict Zod schemas before controllers execute (`apps/api/src/middleware/validate.middleware.ts`).
  - Extra unmodeled fields sent by clients are stripped during `safeParse`.
- **Production Error Masking**:
  - `apps/api/src/middleware/error.middleware.ts` suppresses error stack traces in production environments (`NODE_ENV === 'production'`), returning only a generic error message.

---

## 5. Identified Security Gaps & Considerations

A code-level inspection highlights the following areas for enhancement:

| Area | Current Code State | Developer Consideration |
| :--- | :--- | :--- |
| **Rate Limiting** | `express-rate-limit` is listed in `package.json` dependencies, but is **not mounted** as middleware in `apps/api/src/index.ts` or on auth routes. | Brute-force attacks against `/api/auth/login` and `/api/auth/register` are not throttled at the Express application layer. |
| **Stateless Logout / Invalidation** | `POST /api/auth/logout` returns `{ success: true }` without invalidating the token. | Because JWTs are stateless and no token blacklist or Redis store exists, an exported JWT remains valid until its 7-day expiration even after the user logs out. |
| **Refresh Tokens** | Not implemented. Access tokens have a long lifetime (7 days). | Industry practice recommends short-lived access tokens (15m) paired with rotating refresh tokens. |
| **Cookie Flags** | `spendwise_token` cookie is set in browser JavaScript (`useAuthStore.ts`) with `SameSite=Strict`. | The cookie lacks `HttpOnly` (cannot be set via client JS) and `Secure` flags, leaving it readable by client-side scripts. |
