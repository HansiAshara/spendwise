# API Reference

This document provides a comprehensive reference for all implemented HTTP endpoints in the SpendWise REST API.

---

## 1. General Conventions

### Base URL
All API routes are prefixed with `/api`.
* Local: `http://localhost:5000/api`
* Production: `https://your-domain.com/api`

### Authentication
Protected endpoints require an HTTP `Authorization` header containing a valid JSON Web Token (JWT):
```http
Authorization: Bearer <jwt_token>
```
If the token is missing, invalid, or expired, the API immediately responds with `401 Unauthorized`.

### Standard Response Envelopes
All responses follow a consistent JSON envelope defined in [`apps/api/src/utils/response.ts`](file:///d:/spendwise/apps/api/src/utils/response.ts):

#### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

#### Validation Error (HTTP 422)
When input validation fails via Zod middleware, the response includes an `errors` array:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be greater than 0"
    }
  ]
}
```

> [!NOTE]
> No OpenAPI/Swagger specification file exists in the repository. This document serves as the canonical endpoint reference.

---

## 2. Health & Status Endpoints

### 2.1. Server Root
* **Method**: `GET`
* **Path**: `/`
* **Auth**: Public
* **Status**: `200 OK`
* **Response**:
  ```json
  {
    "message": "SpendWise API is running!"
  }
  ```

### 2.2. Health Check
* **Method**: `GET`
* **Path**: `/api/health`
* **Auth**: Public
* **Status**: `200 OK`
* **Response**:
  ```json
  {
    "success": true,
    "message": "SpendWise API is running ✅",
    "timestamp": "2026-10-14T11:30:00.000Z"
  }
  ```

---

## 3. Authentication & Profile Endpoints (`/api/auth`)

### 3.1. Register Account
* **Method**: `POST`
* **Path**: `/api/auth/register`
* **Auth**: Public
* **Body**:
  ```json
  {
    "name": "Nimal Perera",
    "email": "nimal@example.com",
    "password": "SecurePassword123"
  }
  ```
* **Status Codes**: `201 Created`, `409 Conflict` (email already registered), `422 Unprocessable Entity` (validation failed).
* **Response**:
  ```json
  {
    "success": true,
    "message": "Account created successfully",
    "data": {
      "user": {
        "id": 1,
        "name": "Nimal Perera",
        "email": "nimal@example.com",
        "currency": "LKR",
        "avatarUrl": null,
        "createdAt": "2026-10-14T11:00:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```

### 3.2. Login
* **Method**: `POST`
* **Path**: `/api/auth/login`
* **Auth**: Public
* **Body**:
  ```json
  {
    "email": "nimal@example.com",
    "password": "SecurePassword123"
  }
  ```
* **Status Codes**: `200 OK`, `401 Unauthorized` (invalid email or password), `422 Unprocessable Entity`.

### 3.3. Google Sign-In
* **Method**: `POST`
* **Path**: `/api/auth/google`
* **Auth**: Public
* **Body**:
  ```json
  {
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
  }
  ```
* **Status Codes**: `200 OK`, `401 Unauthorized` (invalid Google token), `400 Bad Request`.

### 3.4. Logout
* **Method**: `POST`
* **Path**: `/api/auth/logout`
* **Auth**: Public
* **Status**: `200 OK`
* **Description**: Confirms logout. Stateless JWT invalidation is handled client-side.

### 3.5. Get Current User Profile
* **Method**: `GET`
* **Path**: `/api/auth/me`
* **Auth**: Required (`Bearer <token>`)
* **Status Codes**: `200 OK`, `401 Unauthorized`, `404 Not Found`.

### 3.6. Update Profile Name / Email
* **Method**: `PATCH`
* **Path**: `/api/auth/me`
* **Auth**: Required
* **Body**:
  ```json
  {
    "name": "Nimal P.",
    "email": "nimal.new@example.com"
  }
  ```
* **Status Codes**: `200 OK`, `409 Conflict` (new email already taken), `422 Unprocessable Entity`.

### 3.7. Change Password
* **Method**: `PATCH`
* **Path**: `/api/auth/change-password`
* **Auth**: Required
* **Body**:
  ```json
  {
    "currentPassword": "OldPassword123",
    "newPassword": "NewPassword456"
  }
  ```
* **Status Codes**: `200 OK`, `400 Bad Request` (incorrect current password or same password), `422 Unprocessable Entity`.

### 3.8. Update Preferred Currency
* **Method**: `PATCH`
* **Path**: `/api/auth/currency`
* **Auth**: Required
* **Body**:
  ```json
  {
    "currency": "USD"
  }
  ```
* **Status Codes**: `200 OK`, `400 Bad Request`.

### 3.9. Update Avatar
* **Method**: `PATCH`
* **Path**: `/api/auth/avatar`
* **Auth**: Required
* **Body**:
  ```json
  {
    "avatarUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
  ```
* **Status**: `200 OK`. Uploads image to Cloudinary and returns updated user with Cloudinary secure URL.

### 3.10. Update Notification Preferences
* **Method**: `PATCH`
* **Path**: `/api/auth/notifications`
* **Auth**: Required
* **Body**:
  ```json
  {
    "notifyBudgetAlerts": true,
    "notifyWeeklySummary": true,
    "notifyMonthlyReport": false
  }
  ```

### 3.11. Get Account Statistics
* **Method**: `GET`
* **Path**: `/api/auth/stats`
* **Auth**: Required
* **Response**:
  ```json
  {
    "success": true,
    "data": {
      "expenseCount": 42,
      "budgetCount": 5,
      "memberMonths": 3
    }
  }
  ```

### 3.12. Delete Account
* **Method**: `DELETE`
* **Path**: `/api/auth/me`
* **Auth**: Required
* **Body**:
  ```json
  {
    "password": "SecurePassword123"
  }
  ```
* **Status**: `200 OK`. Cascades deletion to all expenses and budgets.

### 3.13. Forgot Password
* **Method**: `POST`
* **Path**: `/api/auth/forgot-password`
* **Auth**: Public
* **Body**:
  ```json
  {
    "email": "nimal@example.com"
  }
  ```
* **Status**: `200 OK`. Generates reset token and dispatches email via SMTP. Always returns success message to avoid email enumeration.

### 3.14. Reset Password
* **Method**: `POST`
* **Path**: `/api/auth/reset-password`
* **Auth**: Public
* **Body**:
  ```json
  {
    "token": "4a7b9c2d...",
    "newPassword": "NewSecurePassword123"
  }
  ```

---

## 4. Expenses Endpoints (`/api/expenses`)

All expense endpoints require authentication.

### 4.1. List Expenses
* **Method**: `GET`
* **Path**: `/api/expenses`
* **Query Parameters**:
  * `month` (optional, integer `1`-`12`)
  * `year` (optional, integer e.g., `2026`)
  * `categoryId` (optional, integer)
  * `startDate` (optional, ISO date string e.g., `2026-05-01`)
  * `endDate` (optional, ISO date string e.g., `2026-05-31`)
* **Response**:
  ```json
  {
    "success": true,
    "message": "Expenses fetched successfully",
    "data": {
      "expenses": [
        {
          "id": 10,
          "amount": "1500.00",
          "note": "Lunch with teammates",
          "date": "2026-05-15T00:00:00.000Z",
          "createdAt": "2026-05-15T06:30:00.000Z",
          "updatedAt": "2026-05-15T06:30:00.000Z",
          "userId": 1,
          "categoryId": 2,
          "category": {
            "id": 2,
            "name": "Food",
            "icon": "🍔",
            "color": "#FF6384"
          }
        }
      ],
      "total": 1500,
      "count": 1
    }
  }
  ```

### 4.2. Create Expense
* **Method**: `POST`
* **Path**: `/api/expenses`
* **Body**:
  ```json
  {
    "amount": 1500.50,
    "categoryId": 2,
    "date": "2026-05-15",
    "note": "Lunch with teammates"
  }
  ```
* **Status**: `201 Created`.

### 4.3. Get Single Expense
* **Method**: `GET`
* **Path**: `/api/expenses/:id`
* **Status**: `200 OK` or `404 Not Found` (if expense does not exist or belongs to another user).

### 4.4. Update Expense
* **Method**: `PUT`
* **Path**: `/api/expenses/:id`
* **Body**: Any subset of `amount`, `categoryId`, `date`, `note`.
* **Status**: `200 OK` or `404 Not Found`.

### 4.5. Delete Expense
* **Method**: `DELETE`
* **Path**: `/api/expenses/:id`
* **Status**: `200 OK` or `404 Not Found`.

### 4.6. Expense Summary by Category
* **Method**: `GET`
* **Path**: `/api/expenses/summary?month=5&year=2026`
* **Response**:
  ```json
  {
    "success": true,
    "data": {
      "summary": [
        {
          "categoryId": 2,
          "categoryName": "Food",
          "icon": "🍔",
          "color": "#FF6384",
          "total": 12500,
          "count": 8
        }
      ],
      "grandTotal": 12500,
      "month": 5,
      "year": 2026
    }
  }
  ```

---

## 5. Budget Endpoints (`/api/budgets`)

All budget endpoints require authentication.

### 5.1. List Budgets
* **Method**: `GET`
* **Path**: `/api/budgets?month=5&year=2026`
* **Description**: Returns all budgets for the specified month, enriched with current spent amount, remaining amount, and percentage spent.

### 5.2. Create Budget
* **Method**: `POST`
* **Path**: `/api/budgets`
* **Body**:
  ```json
  {
    "amount": 20000,
    "categoryId": 2,
    "month": 5,
    "year": 2026
  }
  ```
* **Status**: `201 Created`, `409 Conflict` (budget for category/month already exists).

### 5.3. Update Budget
* **Method**: `PUT`
* **Path**: `/api/budgets/:id`
* **Body**:
  ```json
  {
    "amount": 25000
  }
  ```

### 5.4. Delete Budget
* **Method**: `DELETE`
* **Path**: `/api/budgets/:id`
* **Status**: `200 OK` or `404 Not Found`.

---

## 6. Analytics Endpoints (`/api/analytics`)

All analytics endpoints require authentication.

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/analytics/dashboard?month=5&year=2026` | `GET` | Aggregated dashboard view: total spent, remaining budget, top category, daily average, recent expenses. |
| `/api/analytics/summary?month=5&year=2026` | `GET` | Category distribution data formatted for donut/pie charts. |
| `/api/analytics/monthly` | `GET` | Monthly spending totals for the past 6 calendar months (bar chart). |
| `/api/analytics/daily?month=5&year=2026` | `GET` | Day-by-day spending sequence for area/line trend charts. |

---

## 7. Category Endpoints (`/api/categories`)

### 7.1. List Categories
* **Method**: `GET`
* **Path**: `/api/categories`
* **Auth**: Required
* **Response**: Returns seeded categories sorted alphabetically, with the `Other` category positioned last.

---

## 8. AI Insights Endpoints (`/api/insights`)

### 8.1. Generate Financial Insights
* **Method**: `GET`
* **Path**: `/api/insights`
* **Auth**: Required
* **Description**: Analyzes the authenticated user's expenses from the past 30 days and queries Google Gemini (`gemini-2.5-flash` with fallback to `gemini-1.5-flash`).
* **Response**:
  ```json
  {
    "success": true,
    "message": "Insights generated successfully",
    "data": {
      "summary": "You spent 42% of your monthly budget on dining out.",
      "tips": [
        {
          "title": "Prepare lunch at home twice a week",
          "description": "Food accounted for LKR 12,500 over 8 meals. Packing lunch twice a week could reduce this by 25%.",
          "potentialSaving": 3100,
          "category": "Food",
          "priority": "high"
        }
      ],
      "dataPoints": 15,
      "totalSpent": 28400,
      "categoryBreakdown": { ... }
    }
  }
  ```

---

## 9. Export Endpoints (`/api/export`)

All export endpoints require authentication.

| Endpoint | Method | Output Type | Description |
| :--- | :--- | :--- | :--- |
| `/api/export/preview` | `GET` | `application/json` | Returns preview metadata (record count, total amount, category breakdown) for given `startDate`, `endDate`, and optional `categoryId`. |
| `/api/export/pdf` | `GET` | `application/pdf` | Streams a formatted PDF report with tabular expense records and summary headers. |
| `/api/export/csv` | `GET` | `text/csv` | Streams a downloadable CSV file containing expense dates, categories, notes, and amounts. |
