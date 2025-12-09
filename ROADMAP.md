# 🗺️ OrivusJS Technical Roadmap

This roadmap outlines the path from v0.4 (Current) to v1.0 (AI-Native Singularity).

## ✅ Completed Milestones
- [x] **v0.1 - v0.3**: Core CLI, Prisma Generation, tRPC Routers.
- [x] **v0.4.0**: Frontend Generation (React Components, Next.js Pages).
- [x] **v0.4.1**: Backend-Only Modules (`skipUI`), Smart Merge Logic.
- [x] **v0.4.2**: AI Governance (`AI_RULES.md`), Documentation (`/docs`), Test Stability.
- [x] **v0.4.3**: The Stability Release - Template Test Suite, Spec Validator, E2E Tests.
- [x] **v0.4.4**: Deterministic Developer Experience - Explicit action types, regex elimination.
- [x] **v0.4.5**: Zero-Touch Core - Action resolver, 21 modules tested, architectural stability.

---

## 🚀 Phase 1: The Usable Foundation (CURRENT)
*Goal: OrivusJS generates production-ready applications, not just code files.*

### 🔹 v0.5.0: The Usable Foundation Release (IN PROGRESS)
**Theme**: *"Production-Ready Generated Code"*

> OrivusJS deja de ser solo un generador de módulos y se convierte en un framework capaz de producir aplicaciones completas, cohesivas y listas para despliegue.

#### Added
- **Kernel Lite (Relation Graph)**: Lightweight version of the Orivus Kernel
  - Understands dependencies between modules
  - Detects cross-module relations
  - Powers Smart Relations UI
  - Prepares foundation for full Kernel in v0.6

- **Smart Relations UI**: Auto-generate `<RelationSelect>` with:
  - Debounced search
  - Loading states
  - Empty states
  - Smart auto-selection
  - Support for 1:N and N:1 relations

- **Navigation v2**: Dynamic sidebar with:
  - Auto-injected links from CLI
  - Module grouping
  - Active states
  - Collapsible sections

- **Form Validation Feedback**:
  - Inline error messages
  - Zod-derived messages
  - "Touched" field tracking
  - React Hook Form + Zod Resolver behavior

- **Starter App**: Complete example in `/examples/starter-app/`
  - Multiple modules with real relations
  - Functional UI
  - Ideal for demos and regression tests

#### Improved
- **UI Templates**: Loading skeletons, empty states, error boundaries
- **Smart Merge v2**: Preserve `// ORIVUS:CUSTOM:` blocks across regenerations
- **E2E Stability**: 25+ modules validated (CRM, PM, LMS specs)

**Success Criteria**:
```bash
npm run orivus:e2e-test specs/products/starter-app
# ✅ All modules generated with Smart Relations
# ✅ Navigation auto-populated
# ✅ Forms have validation feedback
# ✅ Application is navigable without code changes
```

> **"Es la primera versión de OrivusJS que puede usarse para construir un producto real."**

---

## 🏗️ Phase 2: Production & AI Readiness
*Goal: Make OrivusJS deployment-ready and prepare for AI integration.*

### 🔹 v0.6.0: The Kernel Service & Auth Layer
- **Orivus Kernel (Full)**: Complete schema understanding with query capabilities.
- **Context Protocol Draft**: `orivus:context` command generates project manifest.
- **Auth Scaffolding**: `protectedProcedure`, `ctx.session`, role-based access.
- **Deployment Ready**: Docker support, environment configuration.

### 🔹 v0.7.0: The Context Protocol
- **`orivus:context`**: High-density "Project Map" optimized for LLM context windows.
- **Benefits**: Cursor/Windsurf/Copilot understand the entire project instantly.

---

## 🧠 Phase 3: The Intelligence Layer
*Goal: Make the framework "speak" the language of LLMs.*

### 🔹 v0.8.0: The Prompt Interface (NL-to-Spec)
- **`orivus prompt "..."`**: Natural language to valid JSON specs.
- Integration with LLMs (Cloud or Local/Ollama).

### 🔹 v0.9.0: Self-Healing
- **Auto-Fixer Agents**: Analyze test failures and patch automatically.
- **Smart Seeding**: Auto-generate realistic mock data.

---

## 🤖 Phase 4: The Singularity (Autonomous)
*Goal: Self-maintaining codebases.*

### 🏆 v1.0.0: General Availability
- Full stability and production-proven.
- Plugin ecosystem for custom generators.
- The first truly AI-Native Full-Stack Framework.

---

## 📊 Key Metrics

| Version | Key Deliverable | Status |
|---------|-----------------|--------|
| v0.4.5 | Zero-Touch Core | ✅ Complete |
| v0.5.0 | Kernel Lite + Smart Relations | 🔴 In Progress |
| v0.6.0 | Full Kernel + Auth | ⬜ Planned |
| v0.7.0 | Context Protocol | ⬜ Planned |
| v0.8.0 | NL-to-Spec | ⬜ Planned |
| v1.0.0 | GA Release | ⬜ Future |

---

> *"The best framework is one that disappears — you describe what you want, and it just works."*
