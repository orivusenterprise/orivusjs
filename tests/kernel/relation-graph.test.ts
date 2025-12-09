/**
 * Kernel Lite Tests
 * 
 * Tests the relation graph building and query functions.
 */

import { describe, it, expect } from "vitest";
import {
    buildRelationGraph,
    getDependencies,
    getDependents,
    getRelationFields,
    hasDependency,
    detectCircularDependencies,
    getGenerationOrder,
    summarizeGraph,
} from "../../src/orivus/kernel/relation-graph";
import { ParsedModuleSpec } from "../../src/orivus/core/spec-parser";

// Helper to create test specs
function createSpec(overrides: Partial<ParsedModuleSpec> & { name?: string }): ParsedModuleSpec {
    const name = overrides.name || "test";
    return {
        name,
        moduleName: name,
        description: "Test module",
        models: [],
        actions: [],
        ...overrides,
    };
}

describe("Kernel Lite - Relation Graph", () => {
    describe("buildRelationGraph", () => {
        it("creates empty graph for no specs", () => {
            const graph = buildRelationGraph([]);

            expect(graph.modules.size).toBe(0);
            expect(graph.edges.length).toBe(0);
        });

        it("creates module nodes for each spec", () => {
            const specs: ParsedModuleSpec[] = [
                createSpec({ name: "user", models: [{ name: "User", fields: [] }] }),
                createSpec({ name: "post", models: [{ name: "Post", fields: [] }] }),
            ];

            const graph = buildRelationGraph(specs);

            expect(graph.modules.size).toBe(2);
            expect(graph.modules.has("user")).toBe(true);
            expect(graph.modules.has("post")).toBe(true);
        });

        it("detects belongsTo relations", () => {
            const specs: ParsedModuleSpec[] = [
                createSpec({
                    name: "user",
                    models: [{ name: "User", fields: [] }]
                }),
                createSpec({
                    name: "post",
                    models: [{
                        name: "Post",
                        fields: [
                            {
                                name: "author",
                                type: "relation",
                                target: "User",
                                relationType: "belongsTo",
                                required: true,
                                isArray: false,
                                description: ""
                            }
                        ]
                    }]
                }),
            ];

            const graph = buildRelationGraph(specs);

            expect(graph.edges.length).toBe(1);
            expect(graph.edges[0].from).toBe("post");
            expect(graph.edges[0].to).toBe("user");
            expect(graph.edges[0].fieldName).toBe("author");
            expect(graph.edges[0].relationType).toBe("belongsTo");
        });

        it("builds dependency and dependent maps", () => {
            const specs: ParsedModuleSpec[] = [
                createSpec({ name: "user", models: [{ name: "User", fields: [] }] }),
                createSpec({
                    name: "post",
                    models: [{
                        name: "Post",
                        fields: [
                            { name: "author", type: "relation", target: "User", relationType: "belongsTo", required: true, isArray: false, description: "" }
                        ]
                    }]
                }),
            ];

            const graph = buildRelationGraph(specs);

            expect(getDependencies(graph, "post")).toContain("user");
            expect(getDependents(graph, "user")).toContain("post");
        });
    });

    describe("Query Functions", () => {
        it("getRelationFields returns all relation edges for a module", () => {
            const specs: ParsedModuleSpec[] = [
                createSpec({ name: "user", models: [{ name: "User", fields: [] }] }),
                createSpec({ name: "category", models: [{ name: "Category", fields: [] }] }),
                createSpec({
                    name: "post",
                    models: [{
                        name: "Post",
                        fields: [
                            { name: "author", type: "relation", target: "User", relationType: "belongsTo", required: true, isArray: false, description: "" },
                            { name: "category", type: "relation", target: "Category", relationType: "belongsTo", required: false, isArray: false, description: "" }
                        ]
                    }]
                }),
            ];

            const graph = buildRelationGraph(specs);
            const relations = getRelationFields(graph, "post");

            expect(relations.length).toBe(2);
            expect(relations.map(r => r.to)).toContain("user");
            expect(relations.map(r => r.to)).toContain("category");
        });

        it("hasDependency detects direct dependency", () => {
            const specs: ParsedModuleSpec[] = [
                createSpec({ name: "user", models: [{ name: "User", fields: [] }] }),
                createSpec({
                    name: "post",
                    models: [{
                        name: "Post",
                        fields: [
                            { name: "author", type: "relation", target: "User", relationType: "belongsTo", required: true, isArray: false, description: "" }
                        ]
                    }]
                }),
            ];

            const graph = buildRelationGraph(specs);

            expect(hasDependency(graph, "post", "user")).toBe(true);
            expect(hasDependency(graph, "user", "post")).toBe(false);
        });

        it("hasDependency detects transitive dependency", () => {
            const specs: ParsedModuleSpec[] = [
                createSpec({ name: "user", models: [{ name: "User", fields: [] }] }),
                createSpec({
                    name: "post",
                    models: [{
                        name: "Post",
                        fields: [
                            { name: "author", type: "relation", target: "User", relationType: "belongsTo", required: true, isArray: false, description: "" }
                        ]
                    }]
                }),
                createSpec({
                    name: "comment",
                    models: [{
                        name: "Comment",
                        fields: [
                            { name: "post", type: "relation", target: "Post", relationType: "belongsTo", required: true, isArray: false, description: "" }
                        ]
                    }]
                }),
            ];

            const graph = buildRelationGraph(specs);

            // comment -> post -> user
            expect(hasDependency(graph, "comment", "user")).toBe(true);
        });
    });

    describe("Generation Order", () => {
        it("returns modules in dependency order", () => {
            const specs: ParsedModuleSpec[] = [
                createSpec({
                    name: "comment",
                    models: [{
                        name: "Comment",
                        fields: [
                            { name: "post", type: "relation", target: "Post", relationType: "belongsTo", required: true, isArray: false, description: "" }
                        ]
                    }]
                }),
                createSpec({
                    name: "post",
                    models: [{
                        name: "Post",
                        fields: [
                            { name: "author", type: "relation", target: "User", relationType: "belongsTo", required: true, isArray: false, description: "" }
                        ]
                    }]
                }),
                createSpec({ name: "user", models: [{ name: "User", fields: [] }] }),
            ];

            const graph = buildRelationGraph(specs);
            const order = getGenerationOrder(graph);

            // User should come before Post, Post before Comment
            const userIdx = order.indexOf("user");
            const postIdx = order.indexOf("post");
            const commentIdx = order.indexOf("comment");

            expect(userIdx).toBeLessThan(postIdx);
            expect(postIdx).toBeLessThan(commentIdx);
        });
    });

    describe("Circular Dependency Detection", () => {
        it("detects circular dependencies", () => {
            const specs: ParsedModuleSpec[] = [
                createSpec({
                    name: "a",
                    models: [{
                        name: "A",
                        fields: [
                            { name: "b", type: "relation", target: "B", relationType: "belongsTo", required: true, isArray: false, description: "" }
                        ]
                    }]
                }),
                createSpec({
                    name: "b",
                    models: [{
                        name: "B",
                        fields: [
                            { name: "a", type: "relation", target: "A", relationType: "belongsTo", required: true, isArray: false, description: "" }
                        ]
                    }]
                }),
            ];

            const graph = buildRelationGraph(specs);
            const cycles = detectCircularDependencies(graph);

            expect(cycles.length).toBeGreaterThan(0);
        });

        it("returns empty for acyclic graphs", () => {
            const specs: ParsedModuleSpec[] = [
                createSpec({ name: "user", models: [{ name: "User", fields: [] }] }),
                createSpec({
                    name: "post",
                    models: [{
                        name: "Post",
                        fields: [
                            { name: "author", type: "relation", target: "User", relationType: "belongsTo", required: true, isArray: false, description: "" }
                        ]
                    }]
                }),
            ];

            const graph = buildRelationGraph(specs);
            const cycles = detectCircularDependencies(graph);

            expect(cycles.length).toBe(0);
        });
    });

    describe("summarizeGraph", () => {
        it("generates readable summary", () => {
            const specs: ParsedModuleSpec[] = [
                createSpec({ name: "user", models: [{ name: "User", fields: [] }] }),
                createSpec({
                    name: "post",
                    models: [{
                        name: "Post",
                        fields: [
                            { name: "author", type: "relation", target: "User", relationType: "belongsTo", required: true, isArray: false, description: "" }
                        ]
                    }]
                }),
            ];

            const graph = buildRelationGraph(specs);
            const summary = summarizeGraph(graph);

            expect(summary).toContain("Orivus Kernel");
            expect(summary).toContain("Modules (2)");
            expect(summary).toContain("Relations (1)");
            expect(summary).toContain("post.author");
        });
    });
});
