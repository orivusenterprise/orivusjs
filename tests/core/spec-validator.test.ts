/**
 * Tests for Spec Validator
 */

import { describe, it, expect } from "vitest";
import { validateSpec, ValidationResult } from "../../src/orivus/core/spec-validator";
import { ModuleSpec } from "../../src/orivus/core/module-spec";

function createValidSpec(): ModuleSpec {
    return {
        name: "user",
        models: {
            User: {
                name: { type: "string", required: true },
                email: { type: "string", required: true }
            }
        },
        actions: {
            createUser: {
                input: {
                    name: { type: "string", required: true },
                    email: { type: "string", required: true }
                },
                output: { kind: "model", modelName: "User" }
            },
            listUsers: {
                output: { kind: "model", modelName: "User", isArray: true }
            }
        }
    };
}

describe("spec-validator", () => {

    describe("Basic Structure", () => {
        it("passes for valid spec", () => {
            const spec = createValidSpec();
            const result = validateSpec(spec);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it("fails when name is missing", () => {
            const spec = { ...createValidSpec(), name: undefined } as any;
            const result = validateSpec(spec);

            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.code === "MISSING_NAME")).toBe(true);
        });

        it("fails when models is empty", () => {
            const spec = { ...createValidSpec(), models: {} };
            const result = validateSpec(spec);

            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.code === "MISSING_MODELS")).toBe(true);
        });

        it("fails when actions is empty", () => {
            const spec = { ...createValidSpec(), actions: {} };
            const result = validateSpec(spec);

            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.code === "MISSING_ACTIONS")).toBe(true);
        });
    });

    describe("Module Name Validation", () => {
        it("fails for PascalCase module name", () => {
            const spec = { ...createValidSpec(), name: "User" };
            const result = validateSpec(spec);

            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.code === "INVALID_MODULE_NAME")).toBe(true);
        });

        it("passes for camelCase module name", () => {
            const spec = { ...createValidSpec(), name: "userProfile" };
            const result = validateSpec(spec);

            expect(result.errors.some(e => e.code === "INVALID_MODULE_NAME")).toBe(false);
        });
    });

    describe("Model Name Validation", () => {
        it("fails for camelCase model name", () => {
            const spec = createValidSpec();
            spec.models = { user: spec.models.User };
            delete spec.models.User;

            const result = validateSpec(spec);

            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.code === "INVALID_MODEL_NAME")).toBe(true);
        });

        it("passes for PascalCase model name", () => {
            const spec = createValidSpec();
            const result = validateSpec(spec);

            expect(result.errors.some(e => e.code === "INVALID_MODEL_NAME")).toBe(false);
        });
    });

    describe("Field Type Validation", () => {
        it("fails for invalid field type", () => {
            const spec = createValidSpec();
            (spec.models.User as any).age = { type: "integer" }; // invalid

            const result = validateSpec(spec);

            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.code === "INVALID_FIELD_TYPE")).toBe(true);
        });

        it("fails when field type is missing", () => {
            const spec = createValidSpec();
            (spec.models.User as any).age = { required: true }; // missing type

            const result = validateSpec(spec);

            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.code === "MISSING_FIELD_TYPE")).toBe(true);
        });

        it("passes for all valid types", () => {
            const spec = createValidSpec();
            spec.models.User = {
                name: { type: "string", required: true },
                age: { type: "number", required: false },
                active: { type: "boolean", required: false },
                joinedAt: { type: "date", required: false },
                metadata: { type: "json", required: false }
            };

            const result = validateSpec(spec);

            expect(result.errors.some(e => e.code === "INVALID_FIELD_TYPE")).toBe(false);
        });
    });

    describe("Relation Validation", () => {
        it("fails when relation target is missing", () => {
            const spec = createValidSpec();
            (spec.models.User as any).posts = {
                type: "relation",
                relationType: "hasMany"
                // missing target
            };

            const result = validateSpec(spec);

            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.code === "MISSING_RELATION_TARGET")).toBe(true);
        });

        it("fails when relationType is missing", () => {
            const spec = createValidSpec();
            (spec.models.User as any).posts = {
                type: "relation",
                target: "Post"
                // missing relationType
            };

            const result = validateSpec(spec);

            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.code === "MISSING_RELATION_TYPE")).toBe(true);
        });

        it("fails for invalid relationType", () => {
            const spec = createValidSpec();
            (spec.models.User as any).posts = {
                type: "relation",
                target: "Post",
                relationType: "manyToOne" // invalid
            };

            const result = validateSpec(spec);

            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.code === "INVALID_RELATION_TYPE")).toBe(true);
        });

        it("warns when relation target is external", () => {
            const spec = createValidSpec();
            (spec.models.User as any).posts = {
                type: "relation",
                target: "Post", // Not defined in this spec
                relationType: "hasMany"
            };

            const result = validateSpec(spec);

            expect(result.warnings.some(w => w.code === "EXTERNAL_RELATION_TARGET")).toBe(true);
        });

        it("warns about manyToMany limited support", () => {
            const spec = createValidSpec();
            (spec.models.User as any).tags = {
                type: "relation",
                target: "Tag",
                relationType: "manyToMany"
            };

            const result = validateSpec(spec);

            expect(result.warnings.some(w => w.code === "MANYTOMANY_LIMITED")).toBe(true);
        });
    });

    describe("Action Validation", () => {
        it("fails for PascalCase action name", () => {
            const spec = createValidSpec();
            spec.actions.CreateUser = spec.actions.createUser;
            delete spec.actions.createUser;

            const result = validateSpec(spec);

            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.code === "INVALID_ACTION_NAME")).toBe(true);
        });

        it("fails when action output is missing", () => {
            const spec = createValidSpec();
            delete (spec.actions.createUser as any).output;

            const result = validateSpec(spec);

            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.code === "MISSING_ACTION_OUTPUT")).toBe(true);
        });

        it("fails when output references non-existent model", () => {
            const spec = createValidSpec();
            (spec.actions.createUser as any).output = { kind: "model", modelName: "NonExistent" };

            const result = validateSpec(spec);

            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.code === "INVALID_OUTPUT_MODEL")).toBe(true);
        });

        it("warns when no create action exists", () => {
            const spec = createValidSpec();
            delete spec.actions.createUser;

            const result = validateSpec(spec);

            expect(result.warnings.some(w => w.code === "NO_CREATE_ACTION")).toBe(true);
        });

        it("warns when no list action exists", () => {
            const spec = createValidSpec();
            delete spec.actions.listUsers;

            const result = validateSpec(spec);

            expect(result.warnings.some(w => w.code === "NO_LIST_ACTION")).toBe(true);
        });
    });

    describe("Reserved Fields Warning", () => {
        it("warns about id field", () => {
            const spec = createValidSpec();
            (spec.models.User as any).id = { type: "string", required: true };

            const result = validateSpec(spec);

            expect(result.warnings.some(w => w.code === "RESERVED_FIELD_NAME")).toBe(true);
        });

        it("warns about createdAt field", () => {
            const spec = createValidSpec();
            (spec.models.User as any).createdAt = { type: "date", required: true };

            const result = validateSpec(spec);

            expect(result.warnings.some(w => w.code === "RESERVED_FIELD_NAME")).toBe(true);
        });
    });
});
