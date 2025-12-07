# OrivusJS Spec Examples

This directory contains Example Specs to help you get started with OrivusJS.

## 📂 Examples (Ready to use)
Use these specs to scaffold common application modules.

- **[blog-simple.json](./examples/blog-simple.json)**: A standard Blog Post module with basic CRUD. Good starting point.

## 🧪 Tests (Internal & Advanced)
These specs cover advanced features and edge cases used for testing the framework itself.

- **[relation-test.json](./tests/relation-test.json)**: Demonstrates how to define interactions between models (e.g. `hasMany` vs `belongsTo`).
- **[complex-types.json](./tests/complex-types.json)**: Testing exotic types like Enums, JSON arrays, and Dates.

## 🚀 How to Run

To generate a module from any of these specs, run:

```bash
# Example: Generate a Blog
npm run orivus:create specs/examples/blog-simple.json
```
