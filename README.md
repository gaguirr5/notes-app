# My Wall 📌

A full-stack notes application built with a production-oriented architecture — layered backend design, JWT authentication, automated testing, containerization, and CI/CD.

[![CI](https://github.com/gaguirr5/notes-app/actions/workflows/ci.yml/badge.svg)](https://github.com/gaguirr5/notes-app/actions/workflows/ci.yml)
[![Deployed on Vercel](https://img.shields.io/badge/deployed-vercel-black)](https://mywallapp.vercel.app)

**Live app:** [mywallapp.vercel.app](https://mywallapp.vercel.app)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Roadmap](#roadmap)

---

## Features

- **Authentication** — JWT-based sessions in httpOnly cookies, bcrypt password hashing, rate-limited login/signup
- **Notes CRUD** — full create/read/update/delete, scoped and authorized per user
- **Theming** — light/dark mode with system-preference detection and persistence
- **Responsive UI** — mobile-first layout built with MUI
- **Validated on both ends** — client-side UX validation backed by independent server-side enforcement

## Tech Stack

**Frontend:** Next.js 16 (App Router) · TypeScript · MUI · react-hook-form · SWR
**Backend:** Next.js API Routes, layered API → Service → Repository architecture
**Database:** MongoDB (native driver)
**Auth:** Custom JWT (httpOnly cookies)
**Rate limiting:** Upstash Redis
**Testing:** Vitest (unit/integration) · Cypress (E2E)
**Infrastructure:** Docker (multi-stage build) · GitHub Actions CI · Vercel · MongoDB Atlas

## Architecture

Backend follows a layered API → Service → Repository pattern. Services hold business logic and depend on repositories via constructor injection, making them fully unit-testable in isolation without a real database connection. Routes handle only HTTP concerns — auth checks, request validation, and mapping service errors to status codes.

## Getting Started

### Prerequisites

- Node.js 20+
- A MongoDB connection string ([Atlas](https://www.mongodb.com/atlas) or local)
- An [Upstash](https://upstash.com) Redis database (free tier is sufficient)

### Installation

```bash
git clone https://github.com/gaguirr5/notes-app.git
cd notes-app
npm install
```

Create `.env.local`:

```env
DB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

Start the dev server:

```bash
npm run dev
```

## Testing

```bash
npm run test        # Vitest — unit & integration tests
npm run lint         # ESLint
npx cypress open      # Cypress — E2E (requires the dev server running)
```

## Docker

```bash
docker build -t notes-app .
docker run -p 3000:3000 --env-file .env.local notes-app
```

The image uses a multi-stage build with Next.js's `standalone` output, keeping the final runtime image minimal.

## CI/CD

Every push and pull request runs lint → test → build via GitHub Actions. `main` is branch-protected — PRs cannot merge until all checks pass.

## Roadmap

Actively developed. Planned improvements, tracked on the [project board](https://github.com/users/gaguirr5/projects):

- Password reset / account recovery flow
- CSRF token layer, in addition to the existing `sameSite` cookie protection
- IP-based rate limiting alongside the current email-scoped limiting
- Expanded Cypress coverage across the full auth and notes lifecycle

---

Built as an end-to-end learning project covering the full lifecycle of a modern web application, from architecture through deployment.
