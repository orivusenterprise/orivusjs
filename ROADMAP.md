# 🗺️ OrivusJS Roadmap

Welcome to the future of AI-Native Development. This document outlines the strategic path for OrivusJS.

## ✅ Completed (v0.4.0-alpha)
- **Core Generator**: Parse `ModuleSpec` (JSON) and generate strict TypeScript code.
- **Full-Stack Scaffolding**: Schema (Zod), Service (Prisma), Router (tRPC).
- **Auto-Discovery**: Automatic registration of routers in the main application.
- **Database Sync**: Automatic `prisma db push` on module generation.
- **Auto-Test Generation**: Basic integration tests (Vitest) generated alongside code.
- **CLI**: `npm run orivus:create <file>` command.
- **Relations Engine**: Support for `hasMany`, `belongsTo`, `hasOne` relations in Spec.
- **Smart Prisma Merge**: Incremental module generation with automatic field injection.
- **Multi-Model Support**: Process all models in a spec, not just the first one.
- **Frontend Generator**: Auto-generate React UI components (Forms, Lists, Screens).
- **Next.js Integration**: Automatic App Router page generation.
- **Type-Safe Forms**: tRPC-integrated forms with Zod validation.

## 🚧 Next Milestone (v0.5 - The "AI-Native" Update)
*Priority: High*

### 1. AI Spec Generator
- [ ] Natural language to JSON Spec conversion using LLM
- [ ] `orivus ask "Build a task manager with priorities"` command
- [ ] Spec validation and optimization by AI
- [ ] Interactive spec refinement

### 2. Advanced UI Components
- [ ] Detail/Edit views for individual records
- [ ] Pagination and infinite scroll for lists
- [ ] Search and filter components
- [ ] Client-side form validation with Zod

### 3. Testing Maturity
- [ ] **Unit Tests**: Generate `service.spec.ts` files that test logic in isolation (mocking Prisma)
- [ ] **Advanced Mocking**: Improve test templates to handle complex types (Dates, Enums, Arrays) robustly without manual intervention

### 4. Advanced Relations
- [ ] Support for `include` option in service layer for nested data fetching
- [ ] Many-to-many relation support with junction tables
- [ ] Cascade delete options in Spec

## 🔭 Future Vision (v1.0)
- **Natural Language CLI**: `orivus ask "I need an invoicing module"` -> Generates Spec -> Generates Code.
- **Vector Database Integration**: Native support for embeddings and vector search generation.
- **Plugin System**: Allow community templates (e.g., Generate GraphQL instead of tRPC).

---
*Last Updated: December 2025*
