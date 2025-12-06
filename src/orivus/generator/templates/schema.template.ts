import { ParsedModuleSpec, ParsedField } from "../../core/spec-parser";

/**
 * Maps the internal framework types to Zod schema definitions.
 * * Uses 'z.coerce' for dates to handle JSON string serialization automatically.
 * * Maps 'json' type to 'z.any()' (or z.record) since Zod lacks a native JSON primitive.
 */
function mapToZodType(field: ParsedField): string {
    let zodType = "";

    switch (field.type) {
        case "string":
            zodType = "z.string()";
            break;
        case "number":
            zodType = "z.number()";
            break;
        case "boolean":
            zodType = "z.boolean()";
            break;
        case "date":
            // Expert Tip: APIs receive dates as strings. 'coerce' converts them automatically.
            zodType = "z.coerce.date()";
            break;
        case "json":
            // 'z.any()' or 'z.record(z.string(), z.any())' is safest for unstructured JSON
            zodType = "z.any()";
            break;
        default:
            zodType = "z.any()"; // Fallback for safety
    }

    // Add Metadata for AI Agents
    if (field.description) {
        // Sanitizing quotes to prevent syntax errors
        const safeDesc = field.description.replace(/"/g, '\\"');
        zodType += `.describe("${safeDesc}")`;
    }

    // Handle Modifiers
    if (field.isArray) {
        zodType += ".array()";
    }

    if (!field.required) {
        zodType += ".optional()";
    }

    return zodType;
}

/**
 * Generates the Zod schema content for all models in the module.
 * * Produces both the runtime Zod schema and the static TypeScript type.
 */
export function generateSchemaFile(spec: ParsedModuleSpec): string {
    const imports = `import { z } from "zod";`;

    // We map over ALL models, not just the first one.
    // This allows defining auxiliary types (e.g. Address) alongside User.
    const modelsCode = spec.models.map((model) => {
        // Detect manually defined standard fields
        const hasId = model.fields.some(f => f.name === "id");
        const hasCreatedAt = model.fields.some(f => f.name === "createdAt");
        const hasUpdatedAt = model.fields.some(f => f.name === "updatedAt");

        let fieldsCode = model.fields
            .map((field) => {
                const zodLine = mapToZodType(field);
                return `  ${field.name}: ${zodLine},`;
            })
            .join("\n");

        // Auto-inject Standard Fields (to match Prisma Model)
        if (!hasId) {
            fieldsCode = `  id: z.string().describe("Auto-generated ID"),\n` + fieldsCode;
        }
        if (!hasCreatedAt) {
            fieldsCode += `\n  createdAt: z.coerce.date().optional(),`; // Optional because usually DB handles creation
        }
        if (!hasUpdatedAt) {
            fieldsCode += `\n  updatedAt: z.coerce.date().optional(),`;
        }

        return `
export const ${model.name}Schema = z.object({
${fieldsCode}
});

export type ${model.name} = z.infer<typeof ${model.name}Schema>;
`;
    }).join("\n");

    return `${imports}\n${modelsCode}`;
}