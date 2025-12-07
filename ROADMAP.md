# 🗺️ OrivusJS Roadmap

Welcome to the future of AI-Native Development. This document outlines the strategic path for OrivusJS.

## ✅ Completed (v0.3.0-alpha)
- **Core Generator**: Parse `ModuleSpec` (JSON) and generate strict TypeScript code.
- **Full-Stack Scaffolding**: Schema (Zod), Service (Prisma), Router (tRPC).
- **Auto-Discovery**: Automatic registration of routers in the main application.
- **Database Sync**: Automatic `prisma db push` on module generation.
- **Auto-Test Generation**: Basic integration tests (Vitest) generated alongside code.
- **CLI**: `npm run orivus:create <file>` command.
- **Relations Engine**: Support for `hasMany`, `belongsTo`, `hasOne` relations in Spec.
- **Smart Prisma Merge**: Incremental module generation with automatic field injection.
- **Multi-Model Support**: Process all models in a spec, not just the first one.

## 🚧 Next Milestone (v0.4 - The "Full-Stack" Update)
*Priority: High*

### 1. Frontend Integration
- [ ] Generate React components consuming tRPC routers
- [ ] Auto-forms based on Zod Schemas (`react-hook-form`)
- [ ] Table/List views with pagination
- [ ] Detail/Edit views with type-safe mutations

### 2. Testing Maturity
- [ ] **Unit Tests**: Generate `service.spec.ts` files that test logic in isolation (mocking Prisma).
- [ ] **Advanced Mocking**: Improve test templates to handle complex types (Dates, Enums, Arrays) robustly without manual intervention.

### 3. Advanced Relations
- [ ] Support for `include` option in service layer for nested data fetching
- [ ] Many-to-many relation support with junction tables
- [ ] Cascade delete options in Spec

## 🔭 Future Vision (v1.0)
- **Natural Language CLI**: `orivus ask "I need an invoicing module"` -> Generates Spec -> Generates Code.
- **Vector Database Integration**: Native support for embeddings and vector search generation.
- **Plugin System**: Allow community templates (e.g., Generate GraphQL instead of tRPC).

---
*Last Updated: December 2025*
