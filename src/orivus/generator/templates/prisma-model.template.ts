import { ParsedModel } from "../../core/spec-parser";

export function generatePrismaModel(model: ParsedModel): string {
    const hasId = model.fields.some((f) => f.name === "id");

    // Store generated lines
    const lines: string[] = [];
    const foreignKeysNeeded: { name: string; optional: boolean }[] = [];

    // Check explicitly defined fields to avoid duplicates
    const explicitFieldNames = new Set(model.fields.map(f => f.name));

    model.fields.forEach((f) => {
        let prismaType = "String";

        if (f.type === "relation") {
            const targetModel = f.target || "UnknownModel";
            const relationType = f.relationType || "hasMany"; // Default fallback

            if (relationType === "hasMany") {
                // posts Post[]
                lines.push(`  ${f.name} ${targetModel}[]`);
            } else if (relationType === "belongsTo") {
                // author User @relation(...)
                const fkName = `${f.name}Id`;

                // If the relation is optional, the FK and Object must be optional
                const optionalMod = !f.required ? "?" : "";

                lines.push(`  ${f.name} ${targetModel}${optionalMod} @relation(fields: [${fkName}], references: [id])`);

                // Track that we need an FK field, unless it exists explicitly
                if (!explicitFieldNames.has(fkName)) {
                    foreignKeysNeeded.push({ name: fkName, optional: !f.required });
                }
            } else if (relationType === "hasOne") {
                // profile Profile?
                const optionalMod = !f.required ? "?" : "";
                lines.push(`  ${f.name} ${targetModel}${optionalMod}`);
            }

            return; // Done with relation
        }

        // Standard Fields
        switch (f.type) {
            case "string": prismaType = "String"; break;
            case "number": prismaType = "Int"; break;
            case "boolean": prismaType = "Boolean"; break;
            case "date": prismaType = "DateTime"; break;
            case "json":
                // SQLite compat: String for now, ideally Json if Postgres
                prismaType = "String";
                break;
            default: prismaType = "String";
        }

        if (f.name === "id") {
            const defaultAttr = f.type === "number" ? "@default(autoincrement())" : "@default(cuid())";
            lines.push(`  ${f.name} ${prismaType} @id ${defaultAttr}`);
            return;
        }

        const arrayMod = f.isArray ? "[]" : "";
        const optionalMod = !f.required ? "?" : "";

        lines.push(`  ${f.name} ${prismaType}${arrayMod}${optionalMod}`);
    });

    // Inject missing Foreign Keys
    foreignKeysNeeded.forEach(fk => {
        const optionalMod = fk.optional ? "?" : "";
        lines.push(`  ${fk.name} String${optionalMod}`);
    });

    let fieldsContent = lines.join("\n");

    if (!hasId) {
        fieldsContent = `  id String @id @default(cuid())\n` + fieldsContent;
    }

    // Auto-timestamps (check if not explicitly defined first? assume safe to add for now)
    if (!explicitFieldNames.has("createdAt")) fieldsContent += `\n  createdAt DateTime @default(now())`;
    if (!explicitFieldNames.has("updatedAt")) fieldsContent += `\n  updatedAt DateTime @updatedAt`;

    return `
model ${model.name} {
${fieldsContent}
}
`;
}