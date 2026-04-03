# ContentPush SaaS

Production-oriented open-source SaaS starter for social automation, generated from Context.docx requirements.

## What is included

- Next.js dashboard for content generation, scheduling, and billing UI
- Express API with JWT auth, AI generation, posts, schedules, and Stripe checkout session endpoint
- Role-based authorization (admin/member)
- Worker process with BullMQ + Redis for scheduled publishing
- Expo mobile app for iOS and Android
- Prisma schema for users, social accounts, posts, schedules, automations, and subscriptions
- Docker Compose for local PostgreSQL + Redis
- Open-source-first AI path using Ollama (with OpenAI fallback)

## Tech choices (autonomous decisions)

- Frontend: Next.js App Router + TypeScript
- Mobile: Expo React Native (single codebase for iOS and Android)
- Backend: Node.js + Express + Prisma + PostgreSQL
- Queue: BullMQ + Redis
- AI: Ollama local model first, OpenAI optional fallback
- Billing: Stripe Checkout subscriptions
- Deployment (free/public options):
  - Frontend: Vercel Hobby
  - API/Worker: Railway/Render free tiers
  - DB: Neon/Supabase free tier
  - Redis: Upstash free tier

## Quick start

1. Copy `.env.example` to `.env` and fill values.
2. Start infra:

```bash
docker compose up -d
```

3. Install deps:

```bash
npm install
```

4. Generate prisma client and migrate:

```bash
npx prisma migrate dev --schema prisma/schema.prisma --name init
```

5. Run apps in separate terminals:

```bash
npm run dev:api
npm run dev:worker
npm run dev:web
npm run dev:mobile
```

## Test and build

```bash
npm run test
npm run build
```

## Endpoint reference

See docs/endpoints.md.

## GitHub push

This repo can be pushed with:

```bash
git init
git add .
git commit -m "feat: full SaaS with authz, mobile apps, tests"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## No-code / low-code accelerators

See docs/nocode-stack.md for n8n, Appsmith, and Supabase-based alternatives that can be layered on top.
