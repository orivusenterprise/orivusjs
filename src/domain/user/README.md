# User Module

This module handles user management for the OrivusJS application.

## Structure

- **Model**: `user.model.ts` - Zod schemas and TypeScript types.
- **Router**: `user.router.ts` - tRPC router definitions (list, create).
- **Service**: `user.service.ts` - Business logic (currently minimal).
- **UI**: `user.ui.tsx` - Reusable React components (`UserList`, `CreateUserForm`).
- **Pages**: `pages/` - Full page components (e.g., `list.page.tsx`).
- **Spec**: `user.spec.ts` - Module metadata for AI generation.

## Domain Pages Pattern

Pages are defined within the domain to keep the module self-contained.
To expose a page in the application, re-export it from `src/app`:

```typescript
// src/app/users/page.tsx
export { default } from "@/domain/user/pages/list.page";
```

## Usage

### Query: List Users
```typescript
const { data } = trpc.user.list.useQuery();
```

### Mutation: Create User
```typescript
const mutation = trpc.user.create.useMutation();
mutation.mutate({ input: { name: "John", email: "john@example.com" } });
```
