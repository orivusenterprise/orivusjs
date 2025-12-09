/**
 * Template Tests: prisma-model.template
 * 
 * Tests the Prisma model generation template to ensure:
 * - hasMany relations are skipped (target doesn't exist yet)
 * - belongsTo relations generate FK correctly
 * - manyToMany is skipped (not supported)
 * - Standard fields are auto-injected
 */

import { describe, it, expect } from "vitest";
import { generatePrismaModel } from "../../src/orivus/generator/templates/prisma-model.template";
import { ParsedModel } from "../../src/orivus/core/spec-parser";

describe("prisma-model.template", () => {

    describe("Basic Model Generation", () => {
        it("generates a model with string fields", () => {
            const model: ParsedModel = {
                name: "User",
                fields: [
                    { name: "name", type: "string", required: true, description: "", isArray: false },
                    { name: "email", type: "string", required: true, description: "", isArray: false },
                ]
            };

            const result = generatePrismaModel(model);

            expect(result).toContain("model User {");
            expect(result).toContain("name String");
            expect(result).toContain("email String");
            expect(result).toContain("id String @id @default(cuid())");
            expect(result).toContain("createdAt DateTime @default(now())");
            expect(result).toContain("updatedAt DateTime @updatedAt");
        });

        it("marks optional fields with ?", () => {
            const model: ParsedModel = {
                name: "User",
                fields: [
                    { name: "bio", type: "string", required: false, description: "", isArray: false },
                ]
            };

            const result = generatePrismaModel(model);

            expect(result).toContain("bio String?");
        });

        it("maps number to Int", () => {
            const model: ParsedModel = {
                name: "Product",
                fields: [
                    { name: "price", type: "number", required: true, description: "", isArray: false },
                ]
            };

            const result = generatePrismaModel(model);

            expect(result).toContain("price Int");
        });

        it("maps boolean to Boolean", () => {
            const model: ParsedModel = {
                name: "Post",
                fields: [
                    { name: "published", type: "boolean", required: false, description: "", isArray: false },
                ]
            };

            const result = generatePrismaModel(model);

            expect(result).toContain("published Boolean?");
        });

        it("maps date to DateTime", () => {
            const model: ParsedModel = {
                name: "Event",
                fields: [
                    { name: "startDate", type: "date", required: true, description: "", isArray: false },
                ]
            };

            const result = generatePrismaModel(model);

            expect(result).toContain("startDate DateTime");
        });
    });

    describe("Relation Handling", () => {
        it("SKIPS hasMany relations (target model doesnt exist yet)", () => {
            const model: ParsedModel = {
                name: "User",
                fields: [
                    { name: "name", type: "string", required: true, description: "", isArray: false },
                    { name: "posts", type: "relation", target: "Post", relationType: "hasMany", required: false, description: "", isArray: false },
                ]
            };

            const result = generatePrismaModel(model);

            // Should NOT contain the hasMany relation
            expect(result).not.toContain("posts Post[]");
            // Should still have other fields
            expect(result).toContain("name String");
        });

        it("generates belongsTo with FK correctly", () => {
            const model: ParsedModel = {
                name: "Post",
                fields: [
                    { name: "title", type: "string", required: true, description: "", isArray: false },
                    { name: "author", type: "relation", target: "User", relationType: "belongsTo", required: true, description: "", isArray: false },
                ]
            };

            const result = generatePrismaModel(model);

            // Should include named relation to prevent Prisma ambiguity
            expect(result).toContain('author User @relation("Post_author"');
            expect(result).toContain("authorId String");
        });

        it("generates optional belongsTo with optional FK", () => {
            const model: ParsedModel = {
                name: "Post",
                fields: [
                    { name: "reviewer", type: "relation", target: "User", relationType: "belongsTo", required: false, description: "", isArray: false },
                ]
            };

            const result = generatePrismaModel(model);

            expect(result).toContain("reviewer User? @relation");
            expect(result).toContain("reviewerId String?");
        });

        it("SKIPS manyToMany relations (not yet supported)", () => {
            const model: ParsedModel = {
                name: "Post",
                fields: [
                    { name: "tags", type: "relation", target: "Tag", relationType: "manyToMany", required: false, description: "", isArray: false },
                ]
            };

            const result = generatePrismaModel(model);

            expect(result).not.toContain("tags");
            expect(result).not.toContain("Tag");
        });
    });
});
