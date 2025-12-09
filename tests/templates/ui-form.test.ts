/**
 * Template Tests: ui-form.template
 * 
 * Tests the React form component generation to ensure:
 * - Create actions are detected correctly
 * - FK fields (*Id) are detected and rendered as RelationSelect
 * - State declarations are generated for all input fields
 * - Correct components are used for different field types
 */

import { describe, it, expect } from "vitest";
import { generateFormComponent } from "../../src/orivus/generator/templates/ui-form.template";
import { ParsedModuleSpec } from "../../src/orivus/core/spec-parser";

function createSpec(overrides: Partial<ParsedModuleSpec> = {}): ParsedModuleSpec {
    return {
        name: "user",
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

describe("ui-form.template", () => {

    describe("Create Action Detection", () => {
        it("finds create* action", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateFormComponent(spec);

            expect(result).toContain("trpc.user.createUser.useMutation");
        });

        it("finds add* action", () => {
            const spec = createSpec({
                actions: [{
                    name: "addUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateFormComponent(spec);

            expect(result).toContain("trpc.user.addUser.useMutation");
        });

        it("returns comment when no create action found", () => {
            const spec = createSpec({
                actions: [{
                    name: "listUsers",
                    output: { kind: "model", modelName: "User", isArray: true }
                }]
            });

            const result = generateFormComponent(spec);

            expect(result).toContain("// No create action found");
        });
    });

    describe("FK Field Detection (*Id pattern)", () => {
        it("detects authorId as FK and generates RelationSelect", () => {
            const spec: ParsedModuleSpec = {
                name: "post",
                moduleName: "post",
                models: [{
                    name: "Post",
                    fields: [
                        { name: "title", type: "string", required: true, description: "", isArray: false },
                        { name: "author", type: "relation", target: "User", relationType: "belongsTo", required: true, description: "", isArray: false }
                    ]
                }],
                actions: [{
                    name: "createPost",
                    input: [
                        { name: "title", type: "string", required: true, description: "", isArray: false },
                        { name: "authorId", type: "string", required: true, description: "", isArray: false }
                    ],
                    output: { kind: "model", modelName: "Post" }
                }]
            };

            const result = generateFormComponent(spec);

            // Should generate RelationSelect for authorId
            expect(result).toContain("RelationSelect");
            expect(result).toContain("authorIdOptions");
            expect(result).toContain("trpc.user.listUsers.useQuery({})");
        });

        it("does NOT detect regular string fields as FK", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateFormComponent(spec);

            // Should use Input, not RelationSelect for this field
            expect(result).toContain("Input");
            // RelationSelect is imported but should NOT be used (no items prop with name)
            expect(result).not.toContain("nameOptions");
        });
    });

    describe("State Declarations", () => {
        it("generates useState for string fields", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateFormComponent(spec);

            expect(result).toContain('const [name, setName] = useState<string>("")');
        });

        it("generates useState for number fields with 0 default", () => {
            const spec = createSpec({
                moduleName: "product",
                models: [{ name: "Product", fields: [] }],
                actions: [{
                    name: "createProduct",
                    input: [{ name: "price", type: "number", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "Product" }
                }]
            });

            const result = generateFormComponent(spec);

            expect(result).toContain("const [price, setPrice] = useState<number>(0)");
        });

        it("generates useState for boolean fields with false default", () => {
            const spec = createSpec({
                moduleName: "post",
                models: [{ name: "Post", fields: [] }],
                actions: [{
                    name: "createPost",
                    input: [{ name: "published", type: "boolean", required: false, description: "", isArray: false }],
                    output: { kind: "model", modelName: "Post" }
                }]
            });

            const result = generateFormComponent(spec);

            expect(result).toContain("const [published, setPublished] = useState<boolean>(false)");
        });
    });

    describe("Form Field Rendering", () => {
        it("renders Input for string fields", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateFormComponent(spec);

            expect(result).toContain('<Input');
            expect(result).toContain('type="text"');
        });

        it("renders Switch for boolean fields", () => {
            const spec = createSpec({
                moduleName: "post",
                models: [{ name: "Post", fields: [] }],
                actions: [{
                    name: "createPost",
                    input: [{ name: "published", type: "boolean", required: false, description: "", isArray: false }],
                    output: { kind: "model", modelName: "Post" }
                }]
            });

            const result = generateFormComponent(spec);

            expect(result).toContain("<Switch");
            expect(result).toContain("onCheckedChange");
        });

        it("renders textarea for content/description fields", () => {
            const spec = createSpec({
                moduleName: "post",
                models: [{ name: "Post", fields: [] }],
                actions: [{
                    name: "createPost",
                    input: [{ name: "content", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "Post" }
                }]
            });

            const result = generateFormComponent(spec);

            expect(result).toContain("<textarea");
        });
    });

    describe("Form Structure", () => {
        it("wraps in Card component", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateFormComponent(spec);

            expect(result).toContain("<Card>");
            expect(result).toContain("<CardHeader>");
            expect(result).toContain("<CardContent>");
        });

        it("has submit button", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateFormComponent(spec);

            expect(result).toContain('<Button');
            expect(result).toContain('type="submit"');
        });

        it("exports component with correct name", () => {
            const spec = createSpec({
                actions: [{
                    name: "createUser",
                    input: [{ name: "name", type: "string", required: true, description: "", isArray: false }],
                    output: { kind: "model", modelName: "User" }
                }]
            });

            const result = generateFormComponent(spec);

            expect(result).toContain("export function CreateUserForm()");
        });
    });
});
