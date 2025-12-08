# 🗺️ OrivusJS Technical Roadmap

This roadmap outlines the path from v0.4 (Current) to v1.0 (AI-Native Singularity).

## ✅ Completed Milestones
- [x] **v0.1 - v0.3**: Core CLI, Prisma Generation, tRPC Routers.
- [x] **v0.4.0**: Frontend Generation (React Components, Next.js Pages).
- [x] **v0.4.1**: Backend-Only Modules (`skipUI`), Smart Merge Logic.
- [x] **v0.4.2**: AI Governance (`AI_RULES.md`), Documentation (`/docs`), Test Stability.

---

## 🚨 Phase 0: Stability First (NEW)
*Goal: The framework must "just work" before adding advanced features.*

### 🔹 v0.4.3: The Stability Release (CURRENT PRIORITY)
**Motivation**: *"A framework that fails on a simple blog cannot promise AI-Native capabilities."*

Focus on testing, validation, and reliability:
- [ ] **Template Test Suite**: Unit tests for every template (Prisma, Schema, Router, Service, UI)
- [ ] **Spec Validator**: Validate specs BEFORE generation with clear error messages
- [ ] **E2E Generation Test**: `npm run orivus:e2e-test specs/products/blog` proves the pipeline works
- [ ] **Better Error Messages**: Replace cryptic Prisma/tRPC errors with actionable guidance
- [ ] **Blog Platform**: Must generate with zero manual intervention

**Success Criteria**:
```bash
npm run orivus:e2e-test specs/products/blog
# ✅ Spec validation passed (4 modules)
# ✅ Generation completed (16 files)  
# ✅ All tests passed (4/4)
# ✅ Blog Platform ready at http://localhost:3000
```

📄 See [docs/v0.4.3-STABILITY-PLAN.md](./docs/v0.4.3-STABILITY-PLAN.md) for full implementation plan.

---

## 🏗️ Phase 1: Solid Foundation (UX & Production)
*Goal: Ensure the generated code is "Senior Developer" quality before adding heavy AI.*

### 🔹 v0.5.0: The Cohesive UI & Kernel Genesis
Focus on usability and the birth of the Intelligence Engine.
- **Orivus Kernel (Internal)**: A new core library that maps the entire schema graph to understand relationships deeply.
- **Smart Relations UI**: Powered by the Kernel, automatically generate `<Select>`/Combobox inputs for foreign keys.
- **Auto-Navigation**: Inject links into a dynamic Sidebar/AppShell.
- **Enhanced UI Templates**: Professional Look & Feel.

### 🔹 v0.6.0: The Kernel Service & Production Layer
Focus on AI-readiness and deployment.
- **Orivus Kernel (Service)**: Expose the "Context Protocol" (`orivus:context`). Generates a Project Map for Cursor/LLMs.
- **Auth Scaffolding**: Standardize `protectedProcedure` and `ctx.session`.
- **Role-Based Access**: Support roles in Specs.
- **Deployment Ready**: Docker support.

---

## 🧠 Phase 2: The Intelligence Layer
*Goal: Make the framework "speak" the language of LLMs facilitated by local context.*

### 🔹 v0.7.0: The Context Protocol
- **command `orivus:context`**: Generates a high-density "Project Map" (Markdown/JSON) optimized for LLM Context Windows.
- **Benefits**: Allows Cursor/Windsurf/Copilot to understand the entire project state instantly without reading every file.

### 🔹 v0.8.0: The Prompt Interface (NL-to-Spec)
- **command `orivus prompt "..."`**: 
- Integration with LLMs (Cloud or Local/Ollama) to generate valid JSON Specs from natural language descriptions.

---

## 🤖 Phase 3: The Singularity (Autonomous)
*Goal: Self-maintaining codebases.*

### 🔹 v0.9.0: Self-Healing
- **Auto-Fixer Agents**: If `npm run test` fails, the CLI analyzes the stack trace and patches the implementation or test.
- **Smart Seeding**: Auto-generate realistic mock data for local development based on schema constraints.

### 🏆 v1.0.0: General Availability
- Full Stability.
- Plugin Ecosystem.
- The first truly AI-Native Full-Stack Framework.

---

## 📊 Key Metrics

| Version | Key Deliverable | Status |
|---------|-----------------|--------|
| v0.4.3 | Blog generates first-try | 🔴 In Progress |
| v0.5.0 | Kernel + Smart Relations | ⬜ Planned |
| v0.6.0 | Context Protocol | ⬜ Planned |
| v0.7.0 | NL-to-Spec | ⬜ Planned |
| v1.0.0 | GA Release | ⬜ Future |

---

> *"The best framework is one that disappears — you describe what you want, and it just works."*
