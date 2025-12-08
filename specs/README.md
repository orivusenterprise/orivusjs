# 📋 OrivusJS Module Specifications

This directory contains Specifications ("Specs") that define full-stack modules for OrivusJS.

## 📂 Directory Structure

```
specs/
├── examples/           # Learning examples (disconnected modules)
│   ├── starter-*.json  # Simple single-module demos
│   ├── saas-*.json     # SaaS platform modules
│   └── pm-*.json       # Project manager modules
├── products/           # Complete product blueprints
│   └── blog/           # ✨ Canonical Example
│       ├── _manifest.json
│       ├── 1-user.json
│       ├── 2-post.json
│       └── ...
└── README.md
```

---

## 🏆 Products (Recommended for Real Apps)

Products are **complete, interconnected module sets** that demonstrate how to build real applications.

### 📝 Blog Platform (Canonical Example)
**Path**: `specs/products/blog/`

The reference implementation for OrivusJS. Tests all core features:
- ✅ Complete CRUD operations
- ✅ `belongsTo` relations (Post → User)
- ✅ `hasMany` relations (User → Posts)
- ✅ `manyToMany` relations (Post ↔ Tag)
- ✅ UI generation
- ✅ Integration tests

```bash
# Generate in order:
npm run orivus:create specs/products/blog/1-user.json
npm run orivus:create specs/products/blog/2-post.json
npm run orivus:create specs/products/blog/3-comment.json
npm run orivus:create specs/products/blog/4-tag.json
```

See [`products/blog/README.md`](./products/blog/README.md) for full documentation.

---

## 📚 Examples (For Learning)

Examples are **individual modules** for learning specific patterns. They may not interconnect.

### 🚀 Starter Kit
Simple, single-file modules to get started:
- `examples/starter-blog.json` - Basic blog post

### 🏢 SaaS Kit (E-Learning)
Modular SaaS architecture:
- `examples/saas-1-user.json` - User management
- `examples/saas-2-course.json` - Course with Lessons
- `examples/saas-3-enrollment.json` - Junction table (`skipUI: true`)

### 💼 PM Kit (Project Manager)
Complex relationships:
- `examples/pm-1-project.json` - Core entity
- `examples/pm-2-task.json` - Tasks (1:N)
- `examples/pm-3-tag.json` - Tags
- `examples/pm-4-project-tags.json` - Junction (N:N, `skipUI: true`)

---

## 🛠️ Usage

### Generate a Single Module
```bash
npm run orivus:create specs/examples/<filename>.json
```

### Generate a Complete Product
```bash
# Always follow the order in _manifest.json
npm run orivus:create specs/products/blog/1-user.json
npm run orivus:create specs/products/blog/2-post.json
# ... continue in order
```

---

## 📐 Spec Format Reference

```json
{
    "name": "moduleName",           // Required: lowercase, singular
    "description": "What it does",  // Optional: for documentation
    "skipUI": false,                // Optional: skip frontend generation
    "models": {
        "ModelName": {              // PascalCase
            "fieldName": {
                "type": "string",   // string|number|boolean|date|json|relation
                "required": true,
                "target": "User",   // For relations only
                "relationType": "belongsTo"  // belongsTo|hasMany|hasOne|manyToMany
            }
        }
    },
    "actions": {
        "actionName": {             // camelCase
            "description": "What it does",
            "input": { /* fields */ },
            "output": {
                "kind": "model",    // model|primitive
                "modelName": "ModelName",
                "isArray": true
            }
        }
    }
}
```
