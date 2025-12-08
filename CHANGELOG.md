# Changelog

All notable changes to OrivusJS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
