import fs from "fs";
import path from "path";
import { ParsedModuleSpec } from "../../core/spec-parser";
import { generatePrismaModel } from "../templates/prisma-model.template";

export function updatePrismaSchema(spec: ParsedModuleSpec, root: string) {
    const prismaPath = path.join(root, "prisma/schema.prisma");
    let file = fs.readFileSync(prismaPath, "utf-8");

    spec.models.forEach(model => {
        const modelDefinition = generatePrismaModel(model);

        // Añadir modelo si no existe
        if (!file.includes(`model ${model.name} `)) {
            file += `\n${modelDefinition}`;
            console.log(`🟦 Prisma: modelo ${model.name} añadido.`);
        } else {
            // v0.3 Smart Merge: Inject missing fields (like relations) into existing models
            const regex = new RegExp(`model\\s+${model.name}\\s+\\{([\\s\\S]*?)\\}`, 'm');
            const match = file.match(regex);

            if (match) {
                const existingContent = match[0]; // Full block including braces
                const existingBody = match[1];    // Content inside braces

                // Parse generated definition to extract potential new lines
                // generatePrismaModel returns: "\nmodel Name {\n  field ... \n}\n"
                // Split by newline and filter interesting lines
                const newLines = modelDefinition.split('\n')
                    .map(l => l.trimEnd()) // Keep indentation but trim end
                    .filter(l => l.trim().length > 0 && !l.startsWith("model ") && !l.startsWith("}"));

                let linesToAdd: string[] = [];

                for (const line of newLines) {
                    const trimmed = line.trim();
                    // Skip comments or block attributes for now, focus on fields
                    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) continue;

                    // Extract field name (first word)
                    const fieldName = trimmed.split(/\s+/)[0];
                    if (!fieldName) continue;

                    // Check if field exists in existing body (naive regex but robust enough for Prisma)
                    // Matches "  fieldName Type..." or "fieldName Type..."
                    const fieldRegex = new RegExp(`^\\s*${fieldName}\\s+`, 'm');
                    if (!fieldRegex.test(existingBody)) {
                        linesToAdd.push(line);
                    }
                }

                if (linesToAdd.length > 0) {
                    // Insert new lines before the closing brace
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

    fs.writeFileSync(prismaPath, file);
}