/**
 * Template Tests: service.template
 * 
 * Tests the Prisma service generation template to ensure:
 * - Actions are mapped to correct Prisma operations
 * - Input signatures are properly typed
 * - Model name is correctly converted to camelCase for Prisma client
 */

import { describe, it, expect } from "vitest";
import { generateServiceFile } from "../../src/orivus/generator/templates/service.template";
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

describe("service.template", () => {

    describe("Prisma Operation Inference", () => {
        it("uses create for create* actions", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("prisma.user.create");
            expect(result).toContain("{ data: input }");
        });

        it("uses create for add* actions", () => {
            const spec = createSpec({
                actions: [{
                    name: "addUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("prisma.user.create");
        });

        it("uses findMany for list* actions", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("prisma.user.findMany");
        });

        it("uses findFirstOrThrow for get* actions returning single model", () => {
            const spec = createSpec({
                actions: [{
                    name: "getUser",
                    input: [{ name: "id", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("prisma.user.findFirstOrThrow");
            expect(result).toContain("where: { id: input.id }");
        });

        it("uses count for actions returning number", () => {
            const spec = createSpec({
                actions: [{
                    name: "countUsers",
                    output: { kind: "primitive", type: "number" }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("prisma.user.count");
        });

        it("uses delete for delete* actions returning boolean", () => {
            const spec = createSpec({
                actions: [{
                    name: "deleteUser",
                    input: [{ name: "id", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "primitive", type: "boolean" }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("prisma.user.delete");
            expect(result).toContain("where: { id: input.id }");
            expect(result).toContain(".then(() => true).catch(() => false)");
        });

        it("uses update for update* actions", () => {
            const spec = createSpec({
                actions: [{
                    name: "updateUser",
                    input: [
                        { name: "id", type: "string", required: true, description: "", isArray: false },
                        { name: "name", type: "string", required: true, description: "", isArray: false }
                    ],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("prisma.user.update");
            expect(result).toContain("where: { id: input.id }");
            expect(result).toContain("data: input");
        });
    });

    describe("Input Signature Generation", () => {
        it("generates typed input for string fields", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("name: string");
        });

        it("generates optional fields with ?", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "bio", type: "string", required: false, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("bio?: string");
        });

        it("maps number type correctly", () => {
            const spec = createSpec({
                moduleName: "product",
                models: [{ name: "Product", fields: [] }],
                actions: [{
                    name: "createProduct",
                    input: [{ name: "price", type: "number", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "Product" }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("price: number");
        });

        it("maps boolean type correctly", () => {
            const spec = createSpec({
                moduleName: "post",
                models: [{ name: "Post", fields: [] }],
                actions: [{
                    name: "createPost",
                    input: [{ name: "published", type: "boolean", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "Post" }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("published: boolean");
        });

        it("maps date type to Date", () => {
            const spec = createSpec({
                moduleName: "event",
                models: [{ name: "Event", fields: [] }],
                actions: [{
                    name: "createEvent",
                    input: [{ name: "startDate", type: "date", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "Event" }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("startDate: Date");
        });

        it("handles array fields", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "tags", type: "string", required: true, description: "", isArray: true }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("tags: string[]");
        });
    });

    describe("Model Name Handling", () => {
        it("converts PascalCase model to camelCase for Prisma client", () => {
            const spec = createSpec({
                moduleName: "userProfile",
                models: [{ name: "UserProfile", fields: [] }],
                actions: [{
                    name: "listUserProfiles",
                    output: { kind: "model", modelName: "UserProfile", isArray: true }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("prisma.userProfile");
        });
    });

    describe("Structure and Exports", () => {
        it("imports prisma from core", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain('import { db as prisma } from "../../orivus/core/db"');
        });

        it("exports service with correct name", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("export const userService = {");
        });

        it("generates async methods", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateServiceFile(spec);

            expect(result).toContain("async listUsers");
        });
    });

    describe("Deterministic Type Logic (v0.4.4)", () => {
        it("uses explicit type 'create' regardless of action name", () => {
            const spec = createSpec({
                actions: [{
                    name: "weirdActionName",
                    type: "create",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateServiceFile(spec);
            expect(result).toContain("prisma.user.create");
        });

        it("uses explicit type 'update' regardless of action name", () => {
            const spec = createSpec({
                actions: [{
                    name: "somethingElse",
                    type: "update",
                    input: [{ name: "id", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateServiceFile(spec);
            expect(result).toContain("prisma.user.update");
        });

        it("uses explicit type 'delete' regardless of name", () => {
            const spec = createSpec({
                actions: [{
                    name: "removeThing",
                    type: "delete",
                    input: [{ name: "id", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "primitive", type: "boolean" }
                }]
            });

            const result = generateServiceFile(spec);
            expect(result).toContain("prisma.user.delete");
        });

        it("uses explicit type 'list' regardless of output array status", () => {
            const spec = createSpec({
                actions: [{
                    name: "customQuery",
                    type: "list",
                    output: { kind: "model", modelName: "User", isArray: false }
                }]
            });

            const result = generateServiceFile(spec);
            expect(result).toContain("prisma.user.findMany");
        });
    });
});
