# Changelog

All notable changes to OrivusJS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.4.5-alpha] - 2025-12-08

### 🎯 Theme: "Zero-Touch Core"

> *"If a product requires touching the core to generate successfully, the framework has failed."*

This release focuses on architectural stability and exhaustive testing. The framework was stress-tested with 4 products (21 modules total) without requiring any manual intervention.

### Added
- **Centralized Action Resolver** (`src/orivus/core/action-resolver.ts`): Single source of truth for action selection logic across all templates.
- **Intelligent Pre-Generation Validation**:
  - `validateListActionExists()` - Warns if no list action exists for relation dropdowns.
  - `validateModelNaming()` - Warns about pluralization edge cases (category → categories).
  - `validateDefaultValues()` - Errors if default value type doesn't match field type.
- **Prisma Generate Step**: E2E test now runs `prisma generate` before TypeScript check.
- **Proper Pluralization**: Added `pluralize()` function for correct English pluralization (category → categories, box → boxes).

### Fixed
- **Date Handling in Tests**: Tests now pass native `Date` objects instead of ISO strings for tRPC caller compatibility.
- **Date Handling in UI Forms**: Proper Date lifecycle (Date → string for input value, string → Date for onChange).
- **Multiple Relations to Same Model**: Added unique relation names (`@relation("ModelName_fieldName")`) to prevent Prisma ambiguity errors.
- **Module Name Casing**: Changed from `toLowerCase()` to `toCamelCase()` for proper tRPC router references (BaseEntity → baseEntity, not baseentity).
- **Action Selection Consistency**: Eliminated duplicate heuristics across templates by using centralized `action-resolver.ts`.

### Verification (Stress Testing)
All products generated successfully with **0 errors** and **0 core modifications**:

| Product | Modules | Complexity | Status |
|---------|---------|------------|--------|
| E-commerce | 5 | Medium | ✅ PASSED |
| Canonical Test | 3 | High (edge cases) | ✅ PASSED |
| Social Network | 6 | High (self-referential) | ✅ PASSED |
| Chaos Test | 7 | **EXTREME** | ✅ PASSED |

**Chaos Test Details:**
- 5 levels of nested relations (A→B→C→D→E)
- 22 fields, 10 actions per entity
- 3 relations to same parent model (TripleRef)
- All data types combined

### Test Coverage
- Framework Tests: 123 passed
- Integration Tests: 15 passed (Chaos), 14 passed (Social), 13 passed (E-commerce), 11 passed (Canonical)

---

## [0.4.4-alpha] - 2025-12-08

### 🎯 Theme: "Deterministic Developer Experience"

> *"Explicit is better than implicit." - The Zen of Python (and OrivusJS)*

This release eliminates "magic" heuristics in favor of deterministic code generation using explicit action types in the spec.

### Added
- **Explicit Action Types**: `type` field in `action` definition (`create`, `update`, `delete`, `list`, `get`, `count`, `custom`).
- **Deterministic Templates**: Service and Router generation now prioritize explicit types over regex guessing.
- **Spec Documentation**: Updated `specs/README.md` with new format.

### Fixed
- **Regex Fragility**: Fixed issues where actions like `enrollStudent` or `trackProgress` were misclassified.
- **Input Handling**: Fixed `useQuery` empty input issues (`{}`).
- **Validation**: Validator now checks and recommends explicit action types.

### Verification
- **SaaS LMS (6 Modules)**: Generated successfully with 0 errors.
   - Verified scalability on complex relational project.
   - `Instructor`, `Course`, `Lesson`, `Student`, `Enrollment`, `Progress`.

---

## [0.4.3-alpha] - 2025-12-08

### 🎯 Theme: "The Stability Release"

> *"A framework that fails on a simple blog cannot promise AI-Native capabilities."*

This release focuses on testing, validation, and reliability. The Blog Platform now generates successfully with a single command.

### Added
- **Template Test Suite** (96 tests) covering all templates.
- **Spec Validator** integrated into CLI.
- **E2E Test Command** (`orivus:e2e-test`).
- **Blog Platform Spec** (Canonical Example).

### Fixed
- **Prisma Relations**: Fixed injection of inverse relations.
- **Schema Nullability**: Using `nullish()` for proper Prisma compatibility.
- **Service Generation**: Correct handling of `findFirstOrThrow` and `delete`.

### Verification
- **Blog Platform (4 Modules)**: PASSED.

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
