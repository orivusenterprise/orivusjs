# 🪐 OrivusJS (v0.4.5-alpha)

> **The AI-Native Framework for Building Modern Startups.**  
> Describe your domain. Generate your backend. Build at the speed of thought.

OrivusJS is the first backend framework intentionally designed for a world where **developers and LLMs build software together**.  
Instead of writing routers, services, schemas, and boilerplate, you describe your **domain in a Spec**, and OrivusJS generates a clean, type-safe, production-ready backend in seconds.

It is not “AI-powered.”  
It is **AI-native** — meaning the framework gives AI models the structure, constraints, and patterns they need to generate real software with quality and consistency.

---

## 🚀 Why OrivusJS Exists

Modern development breaks when you try to move fast:

- Too much boilerplate  
- Too many decisions for simple tasks  
- Frameworks not built for LLM collaboration  
- Hard to validate ideas quickly  
- Difficult to maintain architectural quality at speed  

And when you bring AI into the equation, the gap becomes even bigger:  
LLMs generate code, but without **structure**, **constraints**, and **consistent patterns**, the output quickly becomes spaghetti.

OrivusJS was created to solve this.

> **The mission: let humans focus on ideas, while OrivusJS and LLMs handle the scaffolding.**  
> Faster prototypes. Cleaner architecture. Zero boilerplate.

This is not just another framework —  
This is an **operating system for building startups with AI**.

---

## 🧠 What Makes OrivusJS AI-Native?

### 1. **Spec-Driven Development**
Developers (or LLMs) write a simple domain Spec that describes:

- models  
- fields  
- relations  
- actions  
- input/output contracts  

From that, OrivusJS generates everything.

### 2. **Deterministic Architecture**
LLMs perform best when the framework provides:

- strict folder structure  
- predictable module boundaries  
- enforced layers  
- templates and naming conventions  

OrivusJS is designed around those constraints — not as an afterthought, but as a foundational concept.

### 3. **End-to-End Type Safety**
The entire stack — DB → Service → Router — is fully typed:

- Prisma  
- Zod  
- tRPC  

LLMs understand types, and types guide them to produce better, safer code.

### 4. **Zero Boilerplate for 90% of CRUD**
You never write:

- routers  
- services  
- DTOs  
- validation schemas  
- database models  
- integration tests  

OrivusJS generates all of them with perfect consistency.

---

## 🛠️ Quick Start

### 1. Installation

```bash
git clone https://github.com/orivus/orivusjs.git
cd orivusjs
npm install
```

### 2. Define your Module Spec

Create a JSON or TS Spec (e.g., `specs/examples/blog-simple.json`):

```json
{
  "name": "post",
  "description": "Blog management system",
  "models": {
    "Post": {
      "title": { "type": "string", "required": true },
      "content": { "type": "string" },
      "published": { "type": "boolean" },
      "tags": { "type": "string", "isArray": true }
    }
  },
  "actions": {
    "create": {
      "type": "create",
      "description": "Publish a new post",
      "input": { "title": { "type": "string" }, "content": { "type": "string" } },
      "output": { "kind": "model", "modelName": "Post" }
    },
    "list": {
      "type": "list",
      "output": { "kind": "model", "modelName": "Post", "isArray": true }
    }
  }
}
```

### 3. Generate the Module

```bash
npm run orivus:create specs/examples/blog-simple.json
```

### 4. What gets generated? ✨

- ✅ `post.schema.ts` — Zod validation + types
- ✅ `post.service.ts` — business logic with Prisma
- ✅ `post.router.ts` — tRPC API ready to use
- ✅ `post.test.ts` — integration tests
- ✅ `schema.prisma` — new DB model
- ✅ Database auto-synced
- ✅ Router auto-registered

Developers focus on the domain.
OrivusJS handles the rest.

---

## 🏗️ Architecture (v0.4)

```
src/
  ├── domain/
  │   ├── user/
  │   └── post/
  ├── orivus/
  │   ├── core/          # Spec types & parsing
  │   ├── generator/     # Code generation engine
  │   └── cli/           # OrivusJS CLI
  └── server/
      └── trpc/          # Main API router
```

This ensures:
- modular DDD
- predictable boundaries
- clear separation of concerns
- easy LLM navigation
- excellent developer experience

---


## 🔮 What's New in v0.4.4-alpha

### 🎯 Theme: "Deterministic Developer Experience"

> *"Explicit is better than implicit."*

**🛠️ Deterministic Generation**
- **Explicit Action Types**: Eliminating "magic" guesswork. Define `type: "create" | "update" | "list" | ...` in your spec and get guaranteed results.
- **Robustness**: 100% predictable service and router generation.

**📦 SaaS LMS (Complex Example)**
- Successfully generates a **6-module Learning Management System** with complex relations.
- **Modules**: `Instructor`, `Course`, `Lesson`, `Student`, `Enrollment`, `Progress`.
- **Zero manual fixes required.**

---

### Previous: v0.4.3 (The Stability Release)

**🧪 Template Tests (119 tests)**
- 96 tests for all generation templates
- 23 tests for spec validation

**✅ Spec Validator**
- Validates specs BEFORE generation
- Clear error messages with suggestions

**🚀 E2E Test Command**
- Validates pipeline integrity on Blog & LMS products.

**E2E Test Result:**
```
✅ PASSED: SaaS LMS (6 modules)
   Tests: 14/14
```

---

### Previous Features

**v0.4.2** - AI Governance (`AI_RULES.md`), In-app docs

**v0.4.1** - Backend-only modules (`skipUI`)

**v0.4.0** - Frontend generation (React, Next.js pages)

**v0.3** - Relations Engine (`hasMany`, `belongsTo`, `hasOne`)

---

## 🚀 Roadmap to v0.5

**Coming next:**

- [ ] **AI Spec Generator**: Natural language → JSON Spec
  - *Example*: `orivus ask "Build a task manager with priorities"`
- [ ] **Advanced UI Components**: Detail/Edit views, pagination, search
- [ ] **Form Validation**: Client-side Zod validation with error messages
- [ ] **Unit Testing**: Generate `service.spec.ts` with Prisma mocks
- [ ] **Deployment Templates**: Docker, Vercel, Railway configs

These are the foundations for a future where **building a startup is as simple as describing it**.

---

## 🤝 Contributing

OrivusJS is open source and community-driven.
If you want to help shape the future of AI-native development, we welcome:
- Issues
- Ideas
- Discussions
- PRs
- Experiments

---

## 📄 License

MIT · Created by Johann Pino

---

## 🌍 Vision

To empower a new generation of founders and developers to build software at the speed of imagination —
where the human provides **clarity**,
the AI provides **velocity**,
and the framework provides **structure**.

**OrivusJS is the bridge between ideas and software.**
This is just the beginning.
