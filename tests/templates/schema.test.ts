/**
 * Template Tests: schema.template
 * 
 * Tests the Zod schema generation template to ensure:
 * - Fields are mapped to correct Zod types
 * - Optional fields use nullish() for Prisma compatibility
 * - FK fields are generated for belongsTo relations
 * - Standard fields (id, createdAt, updatedAt) are auto-injected
 */

import { describe, it, expect } from "vitest";
import { generateSchemaFile } from "../../src/orivus/generator/templates/schema.template";
import { ParsedModuleSpec } from "../../src/orivus/core/spec-parser";

function createSpec(models: ParsedModuleSpec["models"]): ParsedModuleSpec {
    return {
        moduleName: "test",
        models,
        actions: []
    };
}

describe("schema.template", () => {

    describe("Basic Type Mapping", () => {
        it("maps string to z.string()", () => {
            const spec = createSpec([{
                name: "User",
                fields: [
                    { name: "name", type: "string", required: true, description: "", isArray: false }
                ]
            }]);

            const result = generateSchemaFile(spec);

            expect(result).toContain("name: z.string()");
        });

        it("maps number to z.number()", () => {
            const spec = createSpec([{
                name: "Product",
                fields: [
                    { name: "price", type: "number", required: true, description: "", isArray: false }
                ]
            }]);

            const result = generateSchemaFile(spec);

            expect(result).toContain("price: z.number()");
        });

        it("maps boolean to z.boolean()", () => {
            const spec = createSpec([{
                name: "Post",
                fields: [
                    { name: "published", type: "boolean", required: true, description: "", isArray: false }
                ]
            }]);

            const result = generateSchemaFile(spec);

            expect(result).toContain("published: z.boolean()");
        });

        it("maps date to z.coerce.date()", () => {
            const spec = createSpec([{
                name: "Event",
                fields: [
                    { name: "startDate", type: "date", required: true, description: "", isArray: false }
                ]
            }]);

            const result = generateSchemaFile(spec);

            expect(result).toContain("startDate: z.coerce.date()");
        });
    });

    describe("Optional Fields (Prisma Compatibility)", () => {
        it("uses nullish() for optional fields (handles both null and undefined)", () => {
            const spec = createSpec([{
                name: "User",
                fields: [
                    { name: "bio", type: "string", required: false, description: "", isArray: false }
                ]
            }]);

            const result = generateSchemaFile(spec);

            // Should use nullish() not optional() because Prisma returns null
            expect(result).toContain("bio: z.string().nullish()");
            expect(result).not.toContain("bio: z.string().optional()");
        });

        it("uses nullish() for optional boolean fields", () => {
            const spec = createSpec([{
                name: "Comment",
                fields: [
                    { name: "approved", type: "boolean", required: false, description: "Approval status", isArray: false }
                ]
            }]);

            const result = generateSchemaFile(spec);

            expect(result).toContain("approved: z.boolean()");
            expect(result).toContain(".nullish()");
        });
    });

    describe("Relation FK Generation", () => {
        it("generates FK field for belongsTo relation", () => {
            const spec = createSpec([{
                name: "Post",
                fields: [
                    { name: "title", type: "string", required: true, description: "", isArray: false },
                    { name: "author", type: "relation", target: "User", relationType: "belongsTo", required: true, description: "", isArray: false }
                ]
            }]);

            const result = generateSchemaFile(spec);

            expect(result).toContain("authorId: z.string()");
        });

        it("generates optional FK for optional belongsTo", () => {
            const spec = createSpec([{
                name: "Post",
                fields: [
                    { name: "reviewer", type: "relation", target: "User", relationType: "belongsTo", required: false, description: "", isArray: false }
                ]
            }]);

            const result = generateSchemaFile(spec);

            expect(result).toContain("reviewerId: z.string().optional()");
        });

        it("skips hasMany relations in schema", () => {
            const spec = createSpec([{
                name: "User",
                fields: [
                    { name: "posts", type: "relation", target: "Post", relationType: "hasMany", required: false, description: "", isArray: false }
                ]
            }]);

            const result = generateSchemaFile(spec);

            expect(result).not.toContain("posts");
        });
    });

    describe("Auto-injected Fields", () => {
        it("auto-injects id field", () => {
            const spec = createSpec([{
                name: "User",
                fields: [
                    { name: "name", type: "string", required: true, description: "", isArray: false }
                ]
            }]);

            const result = generateSchemaFile(spec);

            expect(result).toContain('id: z.string().describe("Auto-generated ID")');
        });

        it("auto-injects createdAt and updatedAt", () => {
            const spec = createSpec([{
                name: "User",
                fields: [
                    { name: "name", type: "string", required: true, description: "", isArray: false }
                ]
            }]);

            const result = generateSchemaFile(spec);

            expect(result).toContain("createdAt: z.coerce.date()");
            expect(result).toContain("updatedAt: z.coerce.date()");
        });
    });

    describe("Type Export", () => {
        it("exports TypeScript type alongside schema", () => {
            const spec = createSpec([{
                name: "User",
                fields: [
                    { name: "name", type: "string", required: true, description: "", isArray: false }
                ]
            }]);

            const result = generateSchemaFile(spec);

            expect(result).toContain("export type User = z.infer<typeof UserSchema>");
        });
    });
});
