import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { db } from "@/orivus/core/db";

export function createContext({ req }: FetchCreateContextFnOptions) {
    // OWASP A07: Identification and Authentication Failures
    // In a real scenario, validate the JWT/Session here.
    // For this POC, we simulate a user if an Authorization header is present.
    const token = req.headers.get("authorization");
    const user = token ? { id: "usr_123", role: "user" } : null;

    return { db, user };
}

export type Context = ReturnType<typeof createContext>;