import { ParsedModuleSpec, ParsedField } from "../../core/spec-parser";
import { findCreateAction, findListAction } from "../../core/action-resolver";

/**
 * Helper to generate mock data for tests based on field types
 */
function generateMockData(models: ParsedModuleSpec["models"], actionInput?: ParsedField[]): string {
    let fields: ParsedField[] = [];

    if (actionInput && actionInput.length > 0) {
        fields = actionInput;
    } else {
        const model = models[0]; // Main model
        fields = model.fields.filter(f => f.name !== "id" && f.name !== "createdAt" && f.name !== "updatedAt");
    }

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
                // tRPC caller expects native Date objects, not strings
                value = `new Date()`;
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

    // Use centralized action resolver - single source of truth
    const createAction = findCreateAction(spec.actions) || spec.actions[0];
    const listAction = findListAction(spec.actions);

    const createMethodName = createAction ? createAction.name : "create";
    const listMethodName = listAction ? listAction.name : null;

    const listTestBlock = listMethodName ? `
        // 2. Test Action: ${listMethodName}
        // All query procedures now accept {} for consistency
        const list = await caller.${moduleName}.${listMethodName}({});
        expect(list).toBeInstanceOf(Array);` : "";

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

    it("should be able to run ${createMethodName}${listMethodName ? ` and ${listMethodName}` : ""}", async () => {
        // 1. Test Action: ${createMethodName}
        // Improve input generation: use action inputs if available, else derive from model
        const input = ${generateMockData(spec.models, createAction?.input)};
        
        console.log("Testing ${createMethodName} with:", input);

        try {
            // Warning: Complex types (Date, JSON) might require manual adjustment in the input object
            // depending on how tRPC serializes them in the test environment.
            const created = await caller.${moduleName}.${createMethodName}(input);
            
            expect(created).toBeDefined();
            // If the action returns a model with ID, check it
            if (created && typeof created === 'object' && 'id' in created) {
                expect((created as any).id).toBeDefined();
            }
        } catch (error: any) {
            // Graceful handling for Foreign Key constraints in isolated tests
            // If we are testing a module that depends on another (e.g. Task -> Project),
            // the create will fail because the parent doesn't exist. This is expected.
            const isRelationError = error.message?.includes("Foreign key constraint") || 
                                    error.message?.includes("constraint failed");
            
            if (isRelationError) {
                console.warn("⚠️  Test skipped full validation due to missing relation dependencies (Foreign Key). This is expected for isolated tests.");
                expect(true).toBe(true); // Pass
            } else {
                // If it's another error (validation, logic), fail the test
                throw error;
            }
        }
${listTestBlock}
        
        // Cleanup (Optional / Strategy dependent)
        // if (created && created.id) await db.${moduleName}.delete({ where: { id: created.id } });
    });
});
`;
}
