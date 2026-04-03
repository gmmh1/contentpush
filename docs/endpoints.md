# API Endpoints

Base URL: http://localhost:5000

## Health

- GET /health

## Authentication

- POST /auth/register
  - body: { "email": "user@example.com", "password": "Password123" }
- POST /auth/login
  - body: { "email": "user@example.com", "password": "Password123" }
  - response: { "token": "..." }
- GET /auth/me
  - auth: Bearer token

## AI

- POST /ai/generate
  - auth: Bearer token
  - body: { "topic": "fitness tips for founders" }

## Posts and Scheduling

- GET /posts
  - auth: Bearer token
- POST /posts
  - auth: Bearer token
  - body: { "content": "...", "platform": "x", "publishAt": "2026-04-05T10:00:00Z" }
- GET /posts/all
  - auth: Bearer token
  - role: admin only

## Billing

- POST /billing/checkout-session
  - auth: Bearer token
  - requires STRIPE_SECRET_KEY and STRIPE_PRICE_ID

## Admin

- GET /admin/users
  - auth: Bearer token
  - role: admin only
- PATCH /admin/users/:id/role
  - auth: Bearer token
  - role: admin only
  - body: { "role": "member" }

## Deployment readiness checks

1. GET /health returns 200.
2. Register + login flow returns JWT.
3. GET /auth/me returns current user and role.
4. POST /ai/generate returns content.
5. POST /posts with publishAt adds a queue job and worker logs simulated publish.
6. Admin endpoints are denied for non-admin and allowed for admin.
7. Stripe checkout endpoint returns URL when Stripe env is configured.
