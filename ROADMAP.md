# 🗺️ OrivusJS Roadmap

Welcome to the future of AI-Native Development. This document outlines the strategic path for OrivusJS.

## ✅ Completed (v0.2 Beta)
- **Core Generator**: Parse `ModuleSpec` (JSON) and generate strict TypeScript code.
- **Full-Stack Scaffolding**: Schema (Zod), Service (Prisma), Router (tRPC).
- **Auto-Discovery**: Automatic registration of routers in the main application.
- **Database Sync**: Automatic `prisma db push` on module generation.
- **Auto-Test Generation**: Basic integration tests (Vitest) generated alongside code.
- **CLI**: `npm run orivus:create <file>` command.

## 🚧 Next Milestone (v0.3 - The "Relations" Update)
*Priority: High*

### 1. Database Relations
- [ ] Support `type: "relation"` in Spec Fields.
- [ ] Auto-generate `@relation` syntax in Prisma Schema.
- [ ] Handle `include` and `connect` in Service Layer logic.

### 2. Testing Maturity
- [ ] **Unit Tests**: Generate `service.spec.ts` files that test logic in isolation (mocking Prisma).
- [ ] **Advanced Mocking**: Improve test templates to handle complex types (Dates, Enums, Arrays) robustly without manual intervention.

### 3. Frontend Integration
- [ ] Generate basic React Hooks / Components consuming the tRPC router.
- [ ] Auto-forms based on Zod Schemas (`react-hook-form`).

## 🔭 Future Vision (v1.0)
- **Natural Language CLI**: `orivus ask "I need an invoicing module"` -> Generates Spec -> Generates Code.
- **Vector Database Integration**: Native support for embeddings and vector search generation.
- **Plugin System**: Allow community templates (e.g., Generate GraphQL instead of tRPC).

---
*Last Updated: December 2025*
