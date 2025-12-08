# 📝 Blog Platform - OrivusJS Canonical Product

This is the **canonical example** for validating the OrivusJS generation pipeline.
It demonstrates all core features: models, relations, CRUD actions, and UI generation.

## 🏗️ Architecture

```
┌─────────┐     hasMany     ┌─────────┐     hasMany     ┌─────────────┐
│  User   │ ───────────────>│  Post   │ ───────────────>│  Comment    │
│         │<─────────────── │         │<─────────────── │             │
└─────────┘   belongsTo     └─────────┘   belongsTo     └─────────────┘
     │                            │                            │
     │         hasMany            │       manyToMany           │
     │                            ▼                            │
     │                      ┌─────────┐                        │
     │                      │   Tag   │                        │
     │                      └─────────┘                        │
     │                                                         │
     └────────────────────── belongsTo ────────────────────────┘
```

## 📂 Specs (Execution Order)

| Order | File | Description | Required |
|-------|------|-------------|----------|
| 1 | `1-user.json` | User entity - authors | ✅ Yes |
| 2 | `2-post.json` | Blog posts | ✅ Yes |
| 3 | `3-comment.json` | Comments on posts | ❌ Optional |
| 4 | `4-tag.json` | Tags (many-to-many) | ❌ Optional |

## 🚀 Quick Start

### Generate All Modules
```bash
# Step 1: User (no dependencies)
npm run orivus:create specs/products/blog/1-user.json

# Step 2: Post (depends on User)
npm run orivus:create specs/products/blog/2-post.json

# Step 3: Comment (depends on Post + User)
npm run orivus:create specs/products/blog/3-comment.json

# Step 4: Tag (depends on Post for many-to-many)
npm run orivus:create specs/products/blog/4-tag.json
```

### Run the App
```bash
npm run dev
```

Then visit:
- `/users` - User management
- `/posts` - Blog posts
- `/comments` - Comment moderation
- `/tags` - Tag management

## 🧪 Validation Checklist

After generation, verify:

- [ ] **Files Created**: Each module has `schema.ts`, `service.ts`, `router.ts`, `test.ts`
- [ ] **UI Generated**: Each module has `ui/` and `screens/` folders
- [ ] **Prisma Updated**: All models appear in `prisma/schema.prisma`
- [ ] **Router Registered**: All routers in `src/server/trpc/index.ts`
- [ ] **Relations Work**: Creating a Post with `authorId` links to User
- [ ] **Tests Pass**: `npm run test` shows all green

## 📋 Relation Types Demonstrated

| Type | Example | Description |
|------|---------|-------------|
| `belongsTo` | Post.author → User | Foreign key on Post |
| `hasMany` | User.posts → Post[] | Reverse of belongsTo |
| `manyToMany` | Post.tags ↔ Tag.posts | Junction table auto-created |

## 🐛 Common Issues

### "Cannot find User model"
**Cause**: Running Post before User
**Fix**: Always execute specs in order (1 → 2 → 3 → 4)

### "FK constraint failed"
**Cause**: Creating Post without valid authorId
**Fix**: Create a User first, use their ID

### "Prisma schema conflict"
**Cause**: Model already exists from previous run
**Fix**: Delete the module folder and Prisma model, regenerate
