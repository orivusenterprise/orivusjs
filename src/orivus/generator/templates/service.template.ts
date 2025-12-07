import { ParsedModuleSpec } from "../../core/spec-parser";

// Tipos auxiliares para no romper imports
type ActionDef = ParsedModuleSpec["actions"][number];
type InputDef = NonNullable<ActionDef["input"]>;

// 1. Helper para traducir tipos de ORIVUS a TYPESCRIPT
function getTsType(type: string): string {
  switch (type) {
    case "string": return "string";
    case "number": return "number";
    case "boolean": return "boolean";
    case "date": return "Date";
    case "json": return "any";
    default: return "any";
  }
}

// 2. Generador de la firma del input (Adiós 'any')
function generateInputSignature(fields?: InputDef): string {
  if (!fields || fields.length === 0) return "";

  const props = fields
    .map((f) => {
      const q = f.required ? "" : "?";
      const t = getTsType(f.type);
      const arr = f.isArray ? "[]" : "";
      return `${f.name}${q}: ${t}${arr}`;
    })
    .join("; "); // Separador para inline interface

  // Generamos: input: { name: string; age?: number }
  return `input: { ${props} }`;
}

// 3. Helper para CamelCase (Prisma Standard)
// UserProfile -> userProfile
function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function generateServiceFile(spec: ParsedModuleSpec): string {
  const model = spec.models[0]; // Asumimos modelo principal
  const actions = spec.actions;
  const prismaClient = toCamelCase(model.name); // prisma.user

  const methods = actions
    .map((action) => {
      // --- Lógica Heurística v0.2 ---
      let prismaOp = "findMany";
      let prismaArgs = "{}";

      if (action.output.kind === "model") {
        if (action.output.isArray) {
          prismaOp = "findMany";
        } else {
          // Detectamos intención de crear
          const isCreate = /^create|add|submit|register|link/i.test(action.name);

          if (isCreate) {
            prismaOp = "create";
            prismaArgs = "{ data: input }";
          } else {
            prismaOp = "findFirst";
          }
        }
      } else if (action.output.kind === "primitive") {
        // Si retorna numero, asumimos count o aggregate
        prismaOp = "count";
      }

      // --- Generación de Código ---
      // Usamos el generador de tipos estricto para el input
      const signature = generateInputSignature(action.input);
      // Si no hay input, ponemos parámetro opcional o vacío
      const args = signature ? signature : "input?: any";

      return `
  async ${action.name}(${args}) {
    // Logic inferred: ${prismaOp} on ${model.name}
    return prisma.${prismaClient}.${prismaOp}(${prismaArgs});
  }`;
    })
    .join(",\n"); // Correcto para Objetos

  return `
import { db as prisma } from "../../orivus/core/db";

export const ${spec.moduleName}Service = {
${methods}
};`;
}