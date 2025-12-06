import { ParsedModel } from "../../core/spec-parser";

export function generatePrismaModel(model: ParsedModel): string {
    const hasId = model.fields.some((f) => f.name === "id");

    let fieldsContent = model.fields
        .map((f) => {
            let prismaType = "String";

            switch (f.type) {
                case "string":
                    prismaType = "String";
                    break;
                case "number":
                    prismaType = "Int";
                    break;
                case "boolean":
                    prismaType = "Boolean";
                    break;
                case "date":
                    prismaType = "DateTime";
                    break;
                case "json":
                    // SQLite does not support Json type natively in Prisma.
                    // For broad compatibility in v0.2, we use String.
                    // Ideally, this should detect the provider.
                    prismaType = "String";
                    break;
                default:
                    prismaType = "String";
            }

            if (f.name === "id") {
                const defaultAttr = f.type === "number"
                    ? "@default(autoincrement())"
                    : "@default(cuid())";

                return `  ${f.name} ${prismaType} @id ${defaultAttr}`;
            }

            const arrayMod = f.isArray ? "[]" : "";
            const optionalMod = !f.required ? "?" : "";

            return `  ${f.name} ${prismaType}${arrayMod}${optionalMod}`;
        })
        .join("\n");

    if (!hasId) {
        fieldsContent = `  id String @id @default(cuid())\n` + fieldsContent;
    }

    fieldsContent += `\n  createdAt DateTime @default(now())`;
    fieldsContent += `\n  updatedAt DateTime @updatedAt`;

    return `
model ${model.name} {
${fieldsContent}
}
`;
}