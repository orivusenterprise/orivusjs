# OrivusJS v0.1 (Alpha)

> **The AI-Native Full-Stack Framework.**
> Built for the era of Generative AI. Modular Domain-Driven Design, Type-Safe from Database to UI.

## The Vision

**Software development is evolving.** We are moving from "writing code" to "describing intent".

OrivusJS exists to bridge this gap. It is not just a framework; it is a **Platform** designed for the age where AI writes the implementation, but Humans define the architecture.

We believe in:
1.  **Intent over Syntax**: You define the *What* (Spec), Orivus handles the *How*.
2.  **Verticality**: Code should be organized by Feature, not by Technology.
3.  **Type-Safety as Law**: If it compiles, it works.

## 🌟 Philosophy

OrivusJS is an **AI-Native Framework** built for **speed**. It delivers the ultimate experience for both Developers and AI, bridging the gap between Human Intent and Execution.

- **AI-Native**: The codebase is structured to be easily understood and manipulated by LLMs.
- **Domain-Driven**: Logic is encapsulated in vertical slices (`src/domain/`), not scattered across technical layers.
- **Type-Safe**: End-to-end type safety using TypeScript, Prisma, tRPC, and Zod.

## 🏗️ Architecture

### Directory Structure

```
src/
├── app/                 # Next.js App Router (UI Layer)
│   ├── page.tsx         # Landing Page
│   └── globals.css      # Design System (Tailwind)
├── domain/              # Vertical Slices (Business Logic)
│   └── user/            # Example Domain: User
│       ├── user.model.ts    # Zod/Prisma Definitions
│       ├── user.router.ts   # tRPC Router (API)
│       └── user.spec.ts     # AI Context & Metadata
├── server/              # Server Infrastructure
│   └── trpc/            # tRPC Configuration
│       └── router.ts    # Root App Router
└── orivus/              # Core Framework Logic
    └── core/            # Shared Utilities (DB, etc.)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/orivus/orivusjs.git

# Install dependencies
npm install

# Initialize Database
npx prisma generate
npx prisma db push

# Start Development Server
npm run dev
```

## 🛠️ How to Create a New Module

In v0.1, we follow a manual "Spec-First" workflow (to be automated in v0.2).

1.  **Create Domain Folder**: `mkdir src/domain/post`
2.  **Define Schema**: Add your model to `prisma/schema.prisma`.
3.  **Create Router**: Create `src/domain/post/post.router.ts`.
    ```typescript
    import { router, publicProcedure } from "@/server/trpc/router";
    import { z } from "zod";

    export const postRouter = router({
      list: publicProcedure.query(({ ctx }) => {
        return ctx.db.post.findMany();
      }),
    });
    ```
4.  **Register Router**: Add it to `src/server/trpc/router.ts`.

## 🔮 Roadmap

### v0.1: The Foundation (Current)
- [x] **Vertical Domain Architecture**: Scalable folder structure (`src/domain/[feature]`).
- [x] **Type-Safe Core**: End-to-end type safety with tRPC, Prisma, and Zod.
- [x] **Minimalist Landing**: Clean, professional entry point.
- [x] **Spec-Driven Basics**: Initial implementation of `spec.ts` for domain definition.

### v0.2: The AI Engine (Next)
- [ ] **Orivus CLI**: `orivus gen` to scaffold domains from specs.
- [ ] **Natural Language Specs**: Define modules using plain English in `.orivus` files.
- [ ] **Auto-Wiring**: Automatic registration of routers and UI components.

### v1.0: The Platform
- [ ] **Orivus Studio**: A local dashboard to visualize your architecture and manage domains.
- [ ] **One-Click Deploy**: Optimized for Vercel/AWS with zero config.
- [ ] **Agentic Workflow**: Built-in AI agents that fix bugs and refactor code automatically.

---
*Architected by **Johann Pino**.*
*Building the future of AI-Native Development.*
