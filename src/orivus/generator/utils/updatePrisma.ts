import fs from "fs";
import path from "path";
import { ParsedModuleSpec, ParsedModel } from "../../core/spec-parser";
import { generatePrismaModel } from "../templates/prisma-model.template";

/**
 * Adds a field to an existing Prisma model in the schema file.
 * Returns the updated file content.
 */
function addFieldToModel(file: string, modelName: string, fieldLine: string): string {
    const regex = new RegExp(`(model\\s+${modelName}\\s+\\{[\\s\\S]*?)(\\})`, 'm');
    const match = file.match(regex);

    if (!match) {
        console.warn(`⚠️ Prisma: model ${modelName} not found for inverse relation injection.`);
        return file;
    }

    const existingBody = match[1];
    const fieldName = fieldLine.trim().split(/\s+/)[0];

    // Check if field already exists
    const fieldRegex = new RegExp(`^\\s*${fieldName}\\s+`, 'm');
    if (fieldRegex.test(existingBody)) {
        return file; // Field already exists
    }

    // Insert before closing brace
    const newBlock = existingBody + fieldLine + "\n}";
    return file.replace(match[0], newBlock);
}

/**
 * Infers the inverse relation field name for a belongsTo relation.
 * Example: Post.author (belongsTo User) -> User.posts (hasMany Post)
 */
function inferInverseFieldName(childModelName: string): string {
    // Simple pluralization: Post -> posts, Category -> categorys (not perfect but functional)
    return childModelName.charAt(0).toLowerCase() + childModelName.slice(1) + "s";
}

export function updatePrismaSchema(spec: ParsedModuleSpec, root: string) {
    const prismaPath = path.join(root, "prisma/schema.prisma");
    let file = fs.readFileSync(prismaPath, "utf-8");

    // Track inverse relations that need to be added to parent models
    const inverseRelations: { parentModel: string; fieldLine: string }[] = [];

    spec.models.forEach(model => {
        const modelDefinition = generatePrismaModel(model);

        // Detect belongsTo relations to schedule inverse relation injection
        model.fields.forEach(field => {
            if (field.type === "relation" && field.relationType === "belongsTo" && field.target) {
                const parentModel = field.target;
                const childModel = model.name;
                // Use field.name as the unique identifier to generate consistent relation names
                const relationName = `${childModel}_${field.name}`;
                const inverseFieldName = `${field.name}${childModel}s`; // More unique to avoid collisions

                // The inverse relation: User.posts Post[] @relation("Child_parentRequired")
                inverseRelations.push({
                    parentModel,
                    fieldLine: `  ${inverseFieldName} ${childModel}[] @relation("${relationName}")`
                });
            }
        });

        // Add model if doesn't exist
        if (!file.includes(`model ${model.name} {`) && !file.includes(`model ${model.name}  {`)) {
            file += `\n${modelDefinition}`;
            console.log(`🟦 Prisma: modelo ${model.name} añadido.`);
        } else {
            // v0.3 Smart Merge: Inject missing fields into existing models
            const regex = new RegExp(`model\\s+${model.name}\\s+\\{([\\s\\S]*?)\\}`, 'm');
            const match = file.match(regex);

            if (match) {
                const existingContent = match[0];
                const existingBody = match[1];

                const newLines = modelDefinition.split('\n')
                    .map(l => l.trimEnd())
                    .filter(l => l.trim().length > 0 && !l.startsWith("model ") && !l.startsWith("}"));

                let linesToAdd: string[] = [];

                for (const line of newLines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) continue;

                    const fieldName = trimmed.split(/\s+/)[0];
                    if (!fieldName) continue;

                    const fieldRegex = new RegExp(`^\\s*${fieldName}\\s+`, 'm');
                    if (!fieldRegex.test(existingBody)) {
                        linesToAdd.push(line);
                    }
                }

                if (linesToAdd.length > 0) {
                    const insertion = linesToAdd.join('\n');
                    const newBlock = existingContent.replace(/}\s*$/, `${insertion}\n}`);
                    file = file.replace(existingContent, newBlock);
                    console.log(`🔄 Prisma: updated ${model.name} with ${linesToAdd.length} new fields: ${linesToAdd.map(l => l.trim().split(' ')[0]).join(', ')}`);
                } else {
                    console.log(`🟨 Prisma: model ${model.name} is up to date.`);
                }
            }
        }
    });

    // 🔧 NEW: Inject inverse relations into parent models
    inverseRelations.forEach(({ parentModel, fieldLine }) => {
        const oldFile = file;
        file = addFieldToModel(file, parentModel, fieldLine);
        if (file !== oldFile) {
            const fieldName = fieldLine.trim().split(/\s+/)[0];
            console.log(`🔗 Prisma: added inverse relation ${parentModel}.${fieldName}`);
        }
    });

    fs.writeFileSync(prismaPath, file);
}