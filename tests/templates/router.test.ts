/**
 * Template Tests: router.template
 * 
 * Tests the tRPC router generation template to ensure:
 * - Actions are mapped to correct procedure types (query vs mutation)
 * - Input validation schemas are generated correctly
 * - Output schemas reference the model schema
 * - Required strings have min(1) validation
 */

import { describe, it, expect } from "vitest";
import { generateRouterFile } from "../../src/orivus/generator/templates/router.template";
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

describe("router.template", () => {

    describe("Procedure Type Inference", () => {
        it("infers mutation for create* actions", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain(".mutation(async");
        });

        it("infers mutation for update* actions", () => {
            const spec = createSpec({
                actions: [{
                    name: "updateUser",
                    input: [{ name: "id", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain(".mutation(async");
        });

        it("infers mutation for delete* actions", () => {
            const spec = createSpec({
                actions: [{
                    name: "deleteUser",
                    input: [{ name: "id", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "primitive", type: "boolean" }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain(".mutation(async");
        });

        it("infers query for list* actions", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain(".query(async");
        });

        it("infers query for get* actions", () => {
            const spec = createSpec({
                actions: [{
                    name: "getUser",
                    input: [{ name: "id", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain(".query(async");
        });
    });

    describe("Input Schema Generation", () => {
        it("generates z.string() for string fields", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain("name: z.string()");
        });

        it("adds min(1) for required strings", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain("z.string().min(1)");
        });

        it("adds optional() for non-required fields", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "bio", type: "string", required: false, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain("bio: z.string().optional()");
        });

        it("generates z.number() for number fields", () => {
            const spec = createSpec({
                moduleName: "product",
                models: [{ name: "Product", fields: [] }],
                actions: [{
                    name: "createProduct",
                    input: [{ name: "price", type: "number", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "Product" }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain("price: z.number()");
        });

        it("generates z.boolean() for boolean fields", () => {
            const spec = createSpec({
                moduleName: "post",
                models: [{ name: "Post", fields: [] }],
                actions: [{
                    name: "createPost",
                    input: [{ name: "published", type: "boolean", required: false, description: "", isArray: false }],
                    output: { kind: "model", modelName: "Post" }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain("published: z.boolean().optional()");
        });

        it("generates z.coerce.date() for date fields", () => {
            const spec = createSpec({
                moduleName: "event",
                models: [{ name: "Event", fields: [] }],
                actions: [{
                    name: "createEvent",
                    input: [{ name: "startDate", type: "date", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "Event" }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain("startDate: z.coerce.date()");
        });

        it("adds empty input schema for query actions without input fields", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateRouterFile(spec);

            // Queries always have input for UI compatibility
            expect(result).toContain("listUsers: publicProcedure.input(z.object({}))");
        });
    });

    describe("Output Schema Generation", () => {
        it("references model schema for model output", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain(".output(UserSchema)");
        });

        it("uses array() for model array output", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain(".output(UserSchema.array())");
        });

        it("uses z.boolean() for primitive boolean output", () => {
            const spec = createSpec({
                actions: [{
                    name: "deleteUser",
                    input: [{ name: "id", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "primitive", type: "boolean" }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain(".output(z.boolean())");
        });
    });

    describe("Imports and Structure", () => {
        it("imports zod", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain('import { z } from "zod"');
        });

        it("imports the model schema", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain('import { UserSchema } from "./user.schema"');
        });

        it("imports the service", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain('import { userService } from "./user.service"');
        });

        it("exports the router with correct name", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateRouterFile(spec);

            expect(result).toContain("export const userRouter = router({");
        });
    });
});
