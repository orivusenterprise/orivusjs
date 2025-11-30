import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc";
import { createContext } from "@/server/trpc/context";

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext,
        onError:
            process.env.NODE_ENV === "development"
                ? ({ path, error }) => {
                    console.error(
                        `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
                    );
                }
                : ({ error }) => {
                    // OWASP A09: Security Logging and Monitoring Failures
                    // Log the full error internally but don't leak details to the client
                    console.error(error);
                    if (error.code === "INTERNAL_SERVER_ERROR") {
                        error.message = "Something went wrong";
                    }
                },
    });

export { handler as GET, handler as POST };