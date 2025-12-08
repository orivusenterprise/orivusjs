/**
 * Template Tests: test.template
 * 
 * Tests the vitest test file generation to ensure:
 * - Create and list actions are detected correctly
 * - Mock data is generated for all field types
 * - List actions with input pass {} instead of nothing
 * - FK constraint errors are handled gracefully
 */

import { describe, it, expect } from "vitest";
import { generateTestFile } from "../../src/orivus/generator/templates/test.template";
import { ParsedModuleSpec } from "../../src/orivus/core/spec-parser";

function createSpec(overrides: Partial<ParsedModuleSpec> = {}): ParsedModuleSpec {
    return {
        moduleName: "user",
        models: [{
            name: "User",
            fields: [
                { name: "name", type: "string", required: true, description: "", isArray: false }
            ]
        }],
        actions: [],
        ...overrides
    };
}

describe("test.template", () => {

    describe("Action Detection", () => {
        it("detects create* action", () => {
            const spec = createSpec({
                actions: [
                    {
                        name: "createUser",
                        input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                        output: { kind: "model", modelName: "User" }
                    },
                    {
                        name: "listUsers",
                        output: { kind: "model", modelName: "User", isArray: true }
                    }
                ]
            });

            const result = generateTestFile(spec);

            expect(result).toContain("caller.user.createUser");
        });

        it("detects list* action", () => {
            const spec = createSpec({
                actions: [
                    {
                        name: "createUser",
                        input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                        output: { kind: "model", modelName: "User" }
                    },
                    {
                        name: "listUsers",
                        output: { kind: "model", modelName: "User", isArray: true }
                    }
                ]
            });

            const result = generateTestFile(spec);

            expect(result).toContain("caller.user.listUsers");
        });
    });

    describe("List Action Input Handling", () => {
        it("passes {} for list actions WITH input defined", () => {
            const spec = createSpec({
                actions: [
                    {
                        name: "createUser",
                        input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                        output: { kind: "model", modelName: "User" }
                    },
                    {
                        name: "listUsers",
                        input: [{ name: "filter", type: "string", required: false, description: "", isArray: false }],
                        output: { kind: "model", modelName: "User", isArray: true }
                    }
                ]
            });

            const result = generateTestFile(spec);

            // Should pass {} because action has input
            expect(result).toContain("caller.user.listUsers({})");
        });

        it("passes {} for list actions WITHOUT input too - for tRPC consistency", () => {
            const spec = createSpec({
                actions: [
                    {
                        name: "createUser",
                        input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                        output: { kind: "model", modelName: "User" }
                    },
                    {
                        name: "listUsers",
                        output: { kind: "model", modelName: "User", isArray: true }
                    }
                ]
            });

            const result = generateTestFile(spec);

            // All query procedures now accept {} for consistency
            expect(result).toContain("caller.user.listUsers({})");
        });
    });

    describe("Mock Data Generation", () => {
        it("generates string mock data", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateTestFile(spec);

            expect(result).toContain('name: "name-test-value"');
        });

        it("generates number mock data", () => {
            const spec = createSpec({
                moduleName: "product",
                models: [{ name: "Product", fields: [] }],
                actions: [{
                    name: "createProduct",
                    input: [{ name: "price", type: "number", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "Product" }
                }]
            });

            const result = generateTestFile(spec);

            expect(result).toContain("price: 42");
        });

        it("generates boolean mock data", () => {
            const spec = createSpec({
                moduleName: "post",
                models: [{ name: "Post", fields: [] }],
                actions: [{
                    name: "createPost",
                    input: [{ name: "published", type: "boolean", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "Post" }
                }]
            });

            const result = generateTestFile(spec);

            expect(result).toContain("published: true");
        });

        it("generates date mock data as ISO string", () => {
            const spec = createSpec({
                moduleName: "event",
                models: [{ name: "Event", fields: [] }],
                actions: [{
                    name: "createEvent",
                    input: [{ name: "startDate", type: "date", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "Event" }
                }]
            });

            const result = generateTestFile(spec);

            expect(result).toContain("startDate: new Date().toISOString()");
        });
    });

    describe("FK Error Handling", () => {
        it("includes Foreign Key constraint catch block", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateTestFile(spec);

            expect(result).toContain("Foreign key constraint");
            expect(result).toContain("constraint failed");
        });
    });

    describe("Test Structure", () => {
        it("imports vitest functions", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateTestFile(spec);

            expect(result).toContain('import { describe, it, expect');
        });

        it("creates tRPC caller", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateTestFile(spec);

            expect(result).toContain("createCallerFactory(appRouter)");
        });

        it("uses correct describe block name", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateTestFile(spec);

            expect(result).toContain('describe("User Module Integration"');
        });
    });
});
