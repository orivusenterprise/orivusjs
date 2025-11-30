# 🚀 OrivusJS
### The AI-Native Full-Stack Framework

OrivusJS is a new kind of full-stack framework — built from the ground up to work *with* AI, not around it.

It combines a modern web stack (Next.js, TypeScript, tRPC, Prisma) with a new development model:
**Spec-Driven Development + AI-Native Architecture.**

OrivusJS is designed for founders, builders, and developers who want to:

- build products fast  
- validate ideas quickly  
- iterate with zero friction  
- collaborate with AI agents as first-class contributors  

> OrivusJS is not the new Rails or the new Laravel —  
> It defines its own category:  
> **The AI-Native Framework for the Next Web.**

---

# 🌟 Core Principles

## 1. AI-Native by Design
AI isn’t an add-on.  
OrivusJS is optimized for LLMs, agents, and MCP from day one.

The structure, conventions, and module system are engineered so AI can understand, generate, and maintain code with clarity.

---

## 2. Full-Stack in a Single Unified System
OrivusJS includes:

- Next.js (UI + server runtime)  
- tRPC (Zero-API backend)  
- Prisma (database + migrations)  
- Domain Modules (business logic)  
- Jobs, emails, and UI adapters  

Everything works together out-of-the-box.

---

## 3. Convention over Configuration
Less thinking.  
More building.

OrivusJS offers a clear, predictable architecture designed for both humans and AI, eliminating unnecessary decisions and boilerplate.

---

## 4. Spec-Driven Development (SDD)
A single SPEC file describes your product —  
and OrivusJS generates:

- models  
- routers  
- UI adapters  
- services  
- tests  
- AI metadata  
- future AI agents  

This enables a new paradigm:  
**AI-generated and AI-maintained software.**

---

## 5. Modular Domain Architecture
Each domain module contains:

- model  
- router  
- service  
- UI layer  
- SPEC metadata  

This allows scalable, enterprise-grade applications without complexity.

---

# 📦 Project Structure (v0.1)

```txt
orivusjs/
├── README.md
├── package.json
├── tsconfig.json
├── orivus.config.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── src/
    ├── app/
    │   ├── (marketing)/
    │   ├── (dashboard)/
    │   └── api/trpc/[trpc]/
    ├── domain/
    │   ├── user/
    │   │   ├── user.model.ts
    │   │   ├── user.router.ts
    │   │   ├── user.service.ts
    │   │   ├── user.ui.tsx
    │   │   └── user.spec.ts
    ├── server/
    │   ├── trpc/
    │   ├── jobs/
    │   └── emails/
    ├── db/client.ts
    └── orivus/
        ├── core/
        ├── cli/
        └── ai/


⸻

🔧 Example: tRPC Router

// src/domain/user/user.router.ts
import { z } from "zod";
import { router, publicProcedure } from "@/server/trpc/router";

export const userRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.user.create({ data: input });
    }),
});


⸻

🧠 Spec-Driven Example (v0.2+)

// user.spec.ts
export const userSpec = {
  name: "user",
  entities: ["User"],
  operations: ["list", "create"],
  aiNotes: "Handles user registration and listing.",
};

Future versions of OrivusJS will generate full modules from SPEC files.

⸻

🚀 Roadmap

v0.1 (current)
	•	Base framework structure
	•	Domain Module architecture
	•	Next.js + tRPC + Prisma integration
	•	Initial example module (user)

v0.2
	•	CLI: orivus new + orivus generate module
	•	SPEC Engine v1
	•	AI prompt templates
	•	Auto-module generators

v0.3
	•	AI Maintainer (MCP-powered)
	•	SPEC → full module generation
	•	Job scheduler engine

v1.0
	•	Production-ready release
	•	Full documentation + examples
	•	Orivus Cloud (optional deployment platform)

⸻

🌍 Vision

OrivusJS aims to become the global AI-Native full-stack framework —
a foundation for builders to create products faster, smarter, and with AI as a first-class collaborator.

This is not an iteration of past frameworks.
It is a new generation for a new era.

⸻

🤝 Contributing

OrivusJS is open to the world.
Developers, founders, and AI engineers are invited to contribute:
	•	modules
	•	docs
	•	generators
	•	agents
	•	templates

Together we will build the future of the AI-Native web.

⸻

🧑‍🚀 Author

Johann Pino
Founder of Orivus Enterprise
Creator of OrivusJS

⸻

📄 License

MIT

