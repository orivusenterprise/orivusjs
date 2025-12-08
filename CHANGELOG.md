# Changelog

All notable changes to OrivusJS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.4.3-alpha] - 2025-12-08

### 🎯 Theme: "The Stability Release"

> *"A framework that fails on a simple blog cannot promise AI-Native capabilities."*

This release focuses on testing, validation, and reliability. The Blog Platform now generates successfully with a single command.

### Added

- **Template Test Suite** (96 tests)
  - `prisma-model.template`: 9 tests (relations, field types)
  - `schema.template`: 12 tests (type mapping, nullish, FKs)
  - `router.template`: 19 tests (procedure types, input/output schemas)
  - `service.template`: 17 tests (Prisma operations, input signatures)
  - `ui-form.template`: 14 tests (FK detection, state, field rendering)
  - `ui-list.template`: 13 tests (query input, title detection)
  - `test.template`: 12 tests (action detection, mock data, FK errors)

- **Spec Validator** (23 tests)
  - Validates specs BEFORE generation
  - Clear error messages with suggestions
  - Warnings for non-critical issues
  - Integration with CLI

- **E2E Test Command**
  - `npm run orivus:e2e-test <product-path>`
  - Validates all specs
  - Generates all modules in order
  - Runs TypeScript check
  - Runs all tests
  - Reports results with timing

- **Blog Platform Spec** (`specs/products/blog/`)
  - Canonical example with 4 modules
  - User, Post, Comment, Tag with relations
  - Product manifest for execution order

- **Documentation**
  - `LLM_PERSPECTIVE.md`: AI feedback on framework design
  - `docs/v0.4.3-STABILITY-PLAN.md`: Implementation plan

### Fixed

- **prisma-model.template**
  - Skip `hasMany` relations during initial generation
  - Inject inverse relations when child model created
  - Skip `manyToMany` (not yet fully supported)

- **updatePrisma.ts**
  - Auto-inject inverse `hasMany` relations

- **schema.template**
  - Use `nullish()` instead of `optional()` for Prisma compatibility
  - Prisma returns `null`, not `undefined`

- **service.template** (major rewrite)
  - `findFirst` → `findFirstOrThrow` (ensures non-null return)
  - `delete` actions now properly use `prisma.delete` with boolean result
  - `update` actions use `prisma.update` with where clause
  - Smart `where` clause from actual input fields (not just `id`)

- **ui-form.template**
  - Detect `*Id` fields as FK and generate RelationSelect

- **ui-list.template**
  - Pass `{}` for actions with optional input

- **test.template**
  - Pass `{}` for list actions with optional input

### Changed

- **ROADMAP.md**: Added "Phase 0: Stability" before Kernel/Context
- **CLI**: Now validates specs before generation with clear error messages

### E2E Test Result

```
✅ PASSED: Blog Platform
   Modules: 4
   Tests: 12/12
   Duration: 25s
```

---

## [0.4.2-alpha] - 2025-12-07

### Added
- AI Governance (`AI_RULES.md`)
- In-app documentation (`/docs`)
- Test stabilization for relational modules

---

## [0.4.1-alpha] - Previous

### Added
- Backend-only modules (`skipUI`)
- Smart merge logic for Prisma schema

---

## [0.4.0-alpha] - Previous

### Added
- Frontend generation (React components, Next.js pages)
- Initial UI templates

---

## [0.1.0 - 0.3.0] - Previous

### Added
- Core CLI
- Prisma generation
- tRPC routers
- Spec-driven development foundation
