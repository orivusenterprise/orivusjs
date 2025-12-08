/**
 * Template Tests: ui-list.template
 * 
 * Tests the React list component generation to ensure:
 * - List actions are detected correctly
 * - Query passes {} for actions with input
 * - Title field is correctly detected
 * - Display fields are limited to first 3
 */

import { describe, it, expect } from "vitest";
import { generateListComponent } from "../../src/orivus/generator/templates/ui-list.template";
import { ParsedModuleSpec } from "../../src/orivus/core/spec-parser";

function createSpec(overrides: Partial<ParsedModuleSpec> = {}): ParsedModuleSpec {
    return {
        moduleName: "user",
        models: [{
            name: "User",
            fields: [
                { name: "name", type: "string", required: true, description: "", isArray: false },
                { name: "email", type: "string", required: true, description: "", isArray: false }
            ]
        }],
        actions: [],
        ...overrides
    };
}

describe("ui-list.template", () => {

    describe("List Action Detection", () => {
        it("finds list* action", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateListComponent(spec);

            expect(result).toContain("trpc.user.listUsers.useQuery");
        });

        it("finds all* action", () => {
            const spec = createSpec({
                actions: [{
                    name: "allUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateListComponent(spec);

            expect(result).toContain("trpc.user.allUsers.useQuery");
        });

        it("returns comment when no list action found", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateListComponent(spec);

            expect(result).toContain("// No list action found");
        });
    });

    describe("Query Input Handling", () => {
        it("passes {} for actions WITH input", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    input: [{ name: "filter", type: "string", required: false, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateListComponent(spec);

            expect(result).toContain("useQuery({})");
        });

        it("passes nothing for actions WITHOUT input", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateListComponent(spec);

            expect(result).toContain("useQuery()");
            expect(result).not.toContain("useQuery({})");
        });
    });

    describe("Title Field Detection", () => {
        it("uses name field as title", () => {
            const spec = createSpec({
                models: [{
                    name: "User",
                    fields: [
                        { name: "name", type: "string", required: true, description: "", isArray: false }
                    ]
                }],
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateListComponent(spec);

            expect(result).toContain("{item.name}");
        });

        it("uses title field when available", () => {
            const spec = createSpec({
                moduleName: "post",
                models: [{
                    name: "Post",
                    fields: [
                        { name: "title", type: "string", required: true, description: "", isArray: false }
                    ]
                }],
                actions: [{
                    name: "listPosts",
                    output: { kind: "model", modelName: "Post", isArray: true }
                }]
            });

            const result = generateListComponent(spec);

            expect(result).toContain("{item.title}");
        });

        it("uses email field when no name/title", () => {
            const spec = createSpec({
                models: [{
                    name: "User",
                    fields: [
                        { name: "email", type: "string", required: true, description: "", isArray: false },
                        { name: "bio", type: "string", required: false, description: "", isArray: false }
                    ]
                }],
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateListComponent(spec);

            expect(result).toContain("{item.email}");
        });

        it("falls back to Model # + id when no title field", () => {
            const spec = createSpec({
                moduleName: "task",
                models: [{
                    name: "Task",
                    fields: [
                        { name: "completed", type: "boolean", required: true, description: "", isArray: false }
                    ]
                }],
                actions: [{
                    name: "listTasks",
                    output: { kind: "model", modelName: "Task", isArray: true }
                }]
            });

            const result = generateListComponent(spec);

            expect(result).toContain('"Task #" + item.id');
        });
    });

    describe("Component Structure", () => {
        it("exports component with correct name", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateListComponent(spec);

            expect(result).toContain("export function UserList()");
        });

        it("has loading state", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateListComponent(spec);

            expect(result).toContain("isLoading");
            expect(result).toContain("Loading users");
        });

        it("has empty state", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateListComponent(spec);

            expect(result).toContain("No users found");
        });

        it("uses Card components", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateListComponent(spec);

            expect(result).toContain("<Card");
            expect(result).toContain("<CardHeader");
            expect(result).toContain("<CardTitle");
        });
    });
});
