# Changelog

All notable changes to OrivusJS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.4.2-alpha] - 2025-12-07
### Added
- **AI Governance**: Added `AI_RULES.md` as a universal system prompt for LLMs working on the project.
- **Documentation**: New `/docs` page integrated into the framework.
- **Testing Stability**: Improved test templates to gracefully handle foreign key constraints and avoid duplicate tests.

### Fixed
- **Service Generation**: "Link" actions now correctly infer `create` logic instead of `findFirst`.
- **Relationship Tests**: Fixed generated tests for modules with required relations.

## [0.4.1-alpha] - 2025-12-07

### 🎉 Major Features

#### Backend-Only Modules
- **NEW**: `skipUI` option in ModuleSpec
  - Allows generation of backend-only modules without UI components
  - Perfect for relation-only modules (e.g., junction tables, enrollment systems)
  - Generates router, service, schema, and tests but skips UI/screens/routes

### 📚 Documentation
- Added E2E test specs demonstrating modular architecture:
  - `specs/examples/e2e-1-user.json` - User domain with UI
  - `specs/examples/e2e-2-course.json` - Course domain with UI
  - `specs/examples/e2e-3-enrollment.json` - Enrollment domain (backend-only)

### ✨ Enhancements
- Module generator now conditionally generates UI based on `skipUI` flag
- Cleaner console output indicating when UI generation is skipped

### 🔧 Internal
- Updated `ModuleSpec` type to include optional `skipUI` property
- Updated `ParsedModuleSpec` to propagate `skipUI` flag
- Enhanced `module-generator.ts` with conditional UI generation logic

---

## [0.4.0-alpha] - 2025-12-07

### 🎉 Major Features

#### Frontend Generator
- **NEW**: Auto-generate React UI components from ModuleSpec
  - `CreateFormComponent` - Type-safe forms with tRPC mutations
  - `ListComponent` - Data tables with loading states
  - `ScreenComponent` - Full page layouts combining UI components
- **NEW**: Automatic Next.js App Router integration
  - Generates `src/app/{module}s/page.tsx` routes
  - Re-exports domain screens for clean architecture
- **NEW**: Smart form field generation
  - Text inputs for strings
  - Number inputs with proper type coercion
  - Checkboxes for booleans
  - Textareas for description/content fields
  - Date inputs with Zod coercion
- **NEW**: Built-in UX patterns
  - Loading states (`mutation.isLoading`)
  - Error handling (`mutation.error`)
  - Auto-invalidation of queries on success
  - Form reset after successful submission

### ✨ Enhancements
- Added `.min(1)` validation to required string fields in router
- Improved form template to match tRPC input signature (removed unnecessary wrapper)
- Enhanced module generator to create `ui/` and `screens/` directories
- Better field type detection for optimal input elements

### 📚 Documentation
- Added `specs/tests/frontend-test.json` - Example product catalog spec
- Updated README with v0.4 features and examples
- Updated ROADMAP to reflect completed frontend generation

### 🐛 Bug Fixes
- Fixed form mutation payload structure to match router expectations
- Fixed optional field handling in forms (no `required` attribute for optional fields)
- Fixed state initialization types in form components

### 🔧 Internal
- Created `ui-form.template.ts` for form component generation
- Created `ui-list.template.ts` for list component generation
- Created `screen-list.template.ts` for page generation
- Updated `module-generator.ts` to orchestrate UI generation

---

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
