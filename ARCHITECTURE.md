# OrivusJS Architecture Guide

This document describes the technical architecture of OrivusJS v0.1. It is intended for developers and AI agents contributing to the framework.

## Core Concepts

### 1. Vertical Slices (Domain-Driven Design)
Unlike traditional MVC frameworks that separate code by technology (Controllers, Models, Views), OrivusJS separates code by **Domain Feature**.

- **Goal**: High cohesion, low coupling.
- **Benefit**: You can delete a folder in `src/domain/` and remove a feature entirely without side effects.

### 2. The "Spec" Concept
Every domain module should ideally have a `spec` file (currently `.spec.ts`, future `.orivus`).
- This file acts as the **Source of Truth**.
- It contains metadata, AI instructions (`aiNotes`), and high-level definitions.
- **v0.1 Status**: Used for documentation and context.
- **v0.2 Goal**: Will be used to scaffold code automatically.

### 3. The Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database**: SQLite (Dev) / Postgres (Prod) via Prisma ORM
- **API**: tRPC (Type-safe API without code generation for the client)
- **Styling**: Tailwind CSS (Utility-first)

## Data Flow

1.  **Client (React)**: Calls a tRPC procedure (e.g., `trpc.user.list.useQuery()`).
2.  **tRPC Router**: `src/domain/user/user.router.ts` receives the request.
3.  **Validation**: Zod schemas validate the input.
4.  **Context**: `src/server/trpc/context.ts` provides `db` (Prisma Client) and `user` (Auth).
5.  **Database**: Prisma executes the query against SQLite.
6.  **Response**: Typed data flows back to the React component.

## Anatomy of a Domain (Vertical Slice)

The `src/domain/user` directory serves as the **Canonical Example** for all feature modules in OrivusJS. Every domain should follow this structure to ensure consistency and scalability.

```
src/domain/[name]/
├── [name].spec.ts       # AI Context: The Source of Truth (Intent, Operations, AI Notes).
├── [name].model.ts      # Data Layer: Zod schemas and Type definitions.
├── [name].router.ts     # API Layer: tRPC Router definition (Controller).
├── [name].service.ts    # Business Logic: Reusable functions (optional, keeps Router clean).
├── [name].test.ts       # Testing: Unit/Integration tests for this specific domain.
├── ui/                  # UI Components: Reusable parts (e.g., UserCard, Avatar).
├── screens/             # Views: Full page layouts (e.g., UserProfileScreen) imported by src/app.
└── README.md            # Documentation: Specific details about this domain module.
```

### Key Files Explained

- **`user.spec.ts`**: The most important file for the AI Engine. It describes *what* the module does in high-level terms (Entities, Operations, AI Notes).
- **`user.router.ts`**: The entry point for the frontend. It should validate input (using Zod from `.model.ts`) and call Prisma or Service functions.
- **`screens/`**: Contains the actual page content. `src/app/users/page.tsx` should simply import `<UserProfileScreen />` from here. This keeps the routing layer thin and the logic centralized.

## Data Flow

1.  **Client (React)**: Calls a tRPC procedure (e.g., `trpc.user.list.useQuery()`).
2.  **tRPC Router**: `src/domain/user/user.router.ts` receives the request.
3.  **Validation**: Zod schemas in `user.model.ts` validate the input.
4.  **Context**: `src/server/trpc/context.ts` provides `db` (Prisma Client) and `user` (Auth).
5.  **Database**: Prisma executes the query against SQLite.
6.  **Response**: Typed data flows back to the React component.
