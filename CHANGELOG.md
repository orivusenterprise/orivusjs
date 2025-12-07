# Changelog

All notable changes to OrivusJS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0-alpha] - 2025-12-06

### 🎉 Major Features

#### Relations Engine
- **NEW**: Support for database relations in ModuleSpec
  - `hasMany` - One-to-many relationships (e.g., User has many Posts)
  - `belongsTo` - Many-to-one relationships (e.g., Post belongs to User)
  - `hasOne` - One-to-one relationships
- **NEW**: Automatic foreign key generation in Prisma schema
- **NEW**: Relation-aware Zod schema generation (generates FK fields, avoids circular dependencies)

#### Smart Prisma Merge
- **NEW**: Incremental module generation without breaking existing code
- **NEW**: Automatic field injection into existing models
- **NEW**: Support for modular "Micro-Specs" architecture
- **BREAKING**: Multi-model support in single spec (previously only first model was processed)

### ✨ Enhancements
- Improved `updatePrisma.ts` to iterate through all models in spec
- Enhanced `prisma-model.template.ts` with relation syntax generation
- Updated `schema.template.ts` to handle relation types intelligently
- Better error messages and logging during generation

### 📚 Documentation
- Added `specs/v0.3-design.md` - Technical design document for Relations Engine
- Added example specs:
  - `specs/examples/e-learning.json` - Complex multi-model LMS example
  - `specs/examples/module-1-courses.json` - Micro-spec demonstration (Part 1)
  - `specs/examples/module-2-enrollment.json` - Micro-spec demonstration (Part 2)
- Reorganized `specs/` folder with `examples/` and `tests/` subdirectories
- Added `specs/README.md` explaining spec organization

### 🐛 Bug Fixes
- Fixed Prisma schema update to process all models, not just the first one
- Fixed Zod type mapping for `relation` fields
- Improved spec parser validation for relation-specific properties

### 🔧 Internal
- Updated type definitions in `module-spec.ts` to include `RelationType`
- Enhanced `spec-parser.ts` with relation field validation
- Added support for `target` and `relationType` in `FieldDefinition`

---

## [0.2.0] - 2025-12-06

### 🎉 Major Features

#### Core Generator
- **NEW**: Full backend generation from JSON ModuleSpec
- **NEW**: Automatic Prisma schema generation and database sync
- **NEW**: Zod validation schema generation with type inference
- **NEW**: tRPC router generation with type-safe endpoints
- **NEW**: Service layer generation with Prisma integration
- **NEW**: Integration test generation (Vitest)

#### CLI
- **NEW**: `npm run orivus:create <spec.json>` command
- **NEW**: Automatic router registration in main tRPC router
- **NEW**: Auto-sync database after generation (`prisma db push --accept-data-loss`)

### ✨ Enhancements
- Support for complex data types: `string`, `number`, `boolean`, `date`, `json`
- Array field support with `isArray` flag
- Optional/required field handling
- Auto-injection of standard fields (`id`, `createdAt`, `updatedAt`)
- SQLite compatibility (maps `json` type to `String` for compatibility)

### 📚 Documentation
- Professional README.md with AI-Native positioning
- ROADMAP.md outlining future development
- Example specs in `specs/` directory
- Clear installation and quick start guide

### 🔧 Internal
- Established modular architecture in `src/orivus/`
- Created template system for code generation
- Implemented spec parser with validation
- Set up utility functions for file operations and Prisma updates

---

## [0.1.0] - 2025-11-30

### 🎉 Initial Release
- Basic Next.js + tRPC + Prisma setup
- Manual User domain implementation
- Architecture documentation
- Testing infrastructure with Vitest

---

## Legend
- 🎉 Major Features
- ✨ Enhancements
- 🐛 Bug Fixes
- 📚 Documentation
- 🔧 Internal/Technical
- ⚠️ Breaking Changes
