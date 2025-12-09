# 🪐 OrivusJS (v0.5.0-alpha)

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
The entire stack — DB → Service → Router → UI — is fully typed:

- Prisma  
- Zod  
- tRPC  
- React / Tailwind

LLMs understand types, and types guide them to produce better, safer code.

### 4. **Smart Merge Protection** (New in v0.5)
Modify generated code with confidence. OrivusJS uses **checksum-based collision detection**:
- ✅ **Safe Updates**: Regenerating a module *updates* the file if you haven't touched it.
- 🛡️ **Conflict Protection**: If you modified a file manually, OrivusJS detects it and saves the new version as `.new`, preserving your work.

---

## 🛠️ Quick Start

### 1. Installation

```bash
git clone https://github.com/orivusenterprise/orivusjs.git
cd orivusjs
npm install
npm run dev
```

Visit `http://localhost:3000` to see the **Developer Dashboard**.

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
- ✅ `ui/CreatePostForm.tsx` — React Form with Validation
- ✅ `ui/PostList.tsx` — List with Skeletons & Empty States
- ✅ `schema.prisma` — new DB model
- ✅ Database auto-synced & Navigation updated

Developers focus on the domain.
OrivusJS handles the rest.

---

## 🏗️ Architecture (v0.5)

```
src/
  ├── app/               # Next.js App Router
  ├── domain/            # Vertical Slices (Modules)
  │   ├── user/
  │   └── post/
  ├── orivus/            # Framework Core
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

## 🔮 What's New in v0.5.0-alpha

### 💎 Theme: "Premium Developer Experience"

> *"It just works, and it looks good doing it."*

**�️ Smart Merge Protection**
- **Safe Hashing**: Files are stamped with check-sums to detect manual edits.
- **No Data Loss**: Conflict resolution never overwrites your custom code.

**� UI Polish & UX**
- **Validation Feedback**: Real-time error messages on form fields (no more raw JSON errors).
- **Loading Skeletons**: Smooth shimmering loading states for lists.
- **Empty States**: Beautiful illustrations when no data is found.
- **Navigation v2**: Grouped sidebar items for multi-module products.

**🚀 Starter Experience**
- **New Dashboard**: A functional landing page with system health, quick actions, and resource links.

---

### Previous: v0.4.x

**v0.4.5** - Navigation Groups & Relation Pickers
**v0.4.4** - Deterministic Generation (Spec v2)
**v0.4.3** - Stability Release (E2E Tests)
**v0.4.0** - Frontend Generation (React/Tailwind)

---

## 🚀 Roadmap

**Coming next:**

- [ ] **AI Spec Generator**: Natural language → JSON Spec (`orivus ask`)
- [ ] **Deploy Utils**: Docker, Vercel, Railway configs
- [ ] **Auth Pre-built**: Integrated Authentication module
- [ ] **File Uploads**: Native support for S3/Blob storage fields

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
