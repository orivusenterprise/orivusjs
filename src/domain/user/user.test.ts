import { describe, it, expect, vi } from "vitest";
import { appRouter } from "@/server/trpc/index"; // Import appRouter directly
import { createContext } from "@/server/trpc/context";

// Mock the DB client
vi.mock("@/orivus/core/db", () => ({
    db: {
        user: {
            findMany: vi.fn().mockResolvedValue([
                { id: "1", name: "Test User", email: "test@example.com" },
            ]),
            create: vi.fn().mockImplementation((args) => Promise.resolve({ id: "2", ...args.data })),
        },
    },
}));

describe("User Router", () => {
    it("should list users", async () => {
        const ctx = createContext({ req: { headers: new Headers() } } as any);
        const caller = appRouter.createCaller(ctx);

        const result = await caller.user.list();
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Test User");
    });

    it("should create user when authorized", async () => {
        // Simulate auth header
        const headers = new Headers();
        headers.set("authorization", "Bearer token");

        const ctx = createContext({ req: { headers } } as any);
        const caller = appRouter.createCaller(ctx);

        const input = { name: "New User", email: "new@example.com" };
        // Note: The router expects { input: ... } wrapper, but createCaller might unwrap it depending on tRPC version.
        // Let's try passing the raw input first as per standard tRPC caller behavior usually matches the procedure input definition.
        // Our procedure input is z.object({ input: ... })

        const result = await caller.user.create({ input });

        expect(result.name).toBe("New User");
        expect(result.email).toBe("new@example.com");
    });
});
