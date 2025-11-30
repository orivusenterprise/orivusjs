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
├── orivus.config.ts       # Framework configuration
├── vitest.config.ts       # Testing configuration
├── prisma/
│   └── schema.prisma      # Database schema
└── src/
    ├── app/               # Next.js App Router (Routing Layer)
    │   ├── users/         # Route delegating to domain page
    │   └── api/trpc/      # tRPC API handler
    ├── domain/            # 🧠 The Brain (Business Logic)
    │   ├── user/
    │   │   ├── ui/        # Reusable Components
    │   │   ├── pages/     # Full Page Components
    │   │   ├── user.model.ts
    │   │   ├── user.router.ts
    │   │   ├── user.service.ts
    │   │   ├── user.spec.ts
    │   │   └── user.test.ts
    ├── server/
    │   ├── trpc/          # Auto-generated Router
    │   ├── jobs/          # Background Jobs
    │   └── emails/        # Email Templates
    └── orivus/            # Framework Core
        ├── core/          # Utilities (DB, Auth)
        ├── cli/           # Automation Tools
        └── ai/            # Future AI Engine
```

---

# ✨ Features v0.1

- **AI-Ready Architecture**: Modular `domain/` structure designed for LLM context windows.
- **Auto-Router CLI**: `npm run orivus:gen` automatically wires up your API.
- **Domain Pages**: Portable UI pages that live with their business logic.
- **Type-Safety**: End-to-end typing from Database to UI.
- **Security**: OWASP-ready error handling and authentication patterns.
- **Testing**: Integrated Vitest setup for unit and integration tests.

---

# 🚀 Roadmap

### v0.1 (Completed ✅)
- [x] Base framework structure (Next.js + tRPC + Prisma)
- [x] Domain Module architecture
- [x] Auto-loader for Routers
- [x] Security Foundation (OWASP)
- [x] Testing Infrastructure

### v0.2 (Coming Soon 🚧)
- [ ] **AI Spec Engine**: `orivus scaffold` to generate code from `spec.ts`.
- [ ] **Natural Language CLI**: `orivus ai "create blog module"`
- [ ] **Vector Database**: Native support for embeddings (pgvector).
- [ ] **Self-Healing**: Agents that fix build errors automatically.

### v1.0 (Vision)
- [ ] Production-ready Orivus Cloud
- [ ] Full AI Maintainer (MCP-powered)


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

