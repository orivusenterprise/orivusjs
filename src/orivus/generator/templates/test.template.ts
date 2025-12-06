import { ParsedModuleSpec } from "../../core/spec-parser";

/**
 * Helper to generate mock data for tests based on field types
 */
function generateMockData(models: ParsedModuleSpec["models"]): string {
    const model = models[0]; // Main model
    const fields = model.fields.filter(f => f.name !== "id" && f.name !== "createdAt" && f.name !== "updatedAt");

    const props = fields.map(f => {
        let value: string;
        switch (f.type) {
            case "string":
                value = `"${f.name}-test-value"`;
                break;
            case "number":
                value = "42";
                break;
            case "boolean":
                value = "true";
                break;
            case "date":
                // Send as ISO String to simulate real API JSON payload.
                // Zod z.coerce.date() will handle this.
                value = `new Date().toISOString()`;
                break;
            case "json":
                value = "{}";
                break;
            default:
                value = '""';
        }
        return `            ${f.name}: ${value}`;
    }).join(",\n");

    return `{\n${props}\n        }`;
}

export function generateTestFile(spec: ParsedModuleSpec): string {
    const moduleName = spec.moduleName;
    const pascalName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

    // Intelligent Action Detection
    const createAction = spec.actions.find(a =>
        (a.name.toLowerCase().includes("create") || a.name.toLowerCase().includes("add") || a.name.toLowerCase().includes("apply") || (a.input && !(a.output as any)?.isArray))
    ) || spec.actions[0]; // Fallback to first action

    const listAction = spec.actions.find(a =>
        (a.name.toLowerCase().includes("list") || a.name.toLowerCase().includes("get") || a.name.toLowerCase().includes("dashboard") || (a.output as any)?.isArray)
    ) || spec.actions[1]; // Fallback

    const createMethodName = createAction ? createAction.name : "create";
    const listMethodName = listAction ? listAction.name : "list";

    return `import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "../../server/trpc/index";
import { createCallerFactory } from "../../server/trpc/router";
import { db } from "../../orivus/core/db";

describe("${pascalName} Module Integration", () => {
    // Factory for tRPC caller
    const createCaller = createCallerFactory(appRouter);
    const caller = createCaller({ 
        db, 
        user: { id: "test-admin", role: "admin" } // Mock Auth Context
    } as any);

    it("should be able to run ${createMethodName} and ${listMethodName}", async () => {
        // 1. Test Action: ${createMethodName}
        const input = ${generateMockData(spec.models)};
        
        console.log("Testing ${createMethodName} with:", input);

        // Warning: Complex types (Date, JSON) might require manual adjustment in the input object
        // depending on how tRPC serializes them in the test environment.
        const created = await caller.${moduleName}.${createMethodName}(input);
        
        expect(created).toBeDefined();
        // If the action returns a model with ID, check it
        if (created && typeof created === 'object' && 'id' in created) {
            expect(created.id).toBeDefined();
        }

        // 2. Test Action: ${listMethodName}
        const list = await caller.${moduleName}.${listMethodName}({});
        expect(list).toBeInstanceOf(Array);
        expect(list.length).toBeGreaterThan(0);
        
        // Cleanup (Optional / Strategy dependent)
        // if (created && created.id) await db.${moduleName}.delete({ where: { id: created.id } });
    });
});
`;
}
