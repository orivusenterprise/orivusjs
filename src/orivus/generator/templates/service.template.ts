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
      // --- Lógica Determinista v0.4 (Explicit Types) ---
      let prismaOp = "findMany";
      let prismaArgs = "{}";
      let returnWrapper = "";
      let returnSuffix = "";

      const actionLower = action.name.toLowerCase();

      // Build common WHERE clause from input fields
      const inputFields = action.input || [];
      const whereField = inputFields.find(f => f.name === 'id')?.name
        || inputFields[0]?.name
        || 'id';
      const whereClause = `{ where: { ${whereField}: input.${whereField} } }`;

      // Determine 'type' (Explicit > Heuristic)
      let type = action.type;

      // Fallback: Heuristic Regex (Legacy)
      if (!type) {
        if (action.output.kind === "model") {
          if (action.output.isArray) type = 'list';
          else if (/^(create|add|submit|register|link|enroll|track)/i.test(actionLower)) type = 'create';
          else if (/^(update|edit|modify|patch|complete)/i.test(actionLower)) type = 'update';
          else type = 'get';
        } else if (action.output.kind === "primitive") {
          if (action.output.type === 'boolean' && /^(delete|remove|destroy)/i.test(actionLower)) type = 'delete';
          else if (action.output.type === 'number') type = 'count';
          else type = 'custom'; // boolean exists check?
        }
      }

      // Map Type to Prisma Operation
      switch (type) {
        case 'create':
          prismaOp = "create";
          prismaArgs = "{ data: input }";
          break;
        case 'update':
        case 'custom': // Default custom to update-like for safety? Or maybe just create?
          prismaOp = "update";
          prismaArgs = `{ where: { ${whereField}: input.${whereField} }, data: input }`;
          break;
        case 'delete':
          prismaOp = "delete";
          prismaArgs = whereClause;
          returnWrapper = "await ";
          returnSuffix = ".then(() => true).catch(() => false)";
          break;
        case 'list':
          prismaOp = "findMany";
          // If input exists, use it as filter, otherwise empty
          prismaArgs = inputFields.length > 0 ? "{ where: input }" : "{}";
          break;
        case 'get':
          prismaOp = "findFirstOrThrow";
          prismaArgs = whereClause;
          break;
        case 'count':
          prismaOp = "count";
          prismaArgs = inputFields.length > 0 ? "{ where: input }" : "{}";
          break;
        default:
          // Fallback default
          prismaOp = "findMany";
          prismaArgs = "{}";
      }

      // Special case: Output kind check overrides? 
      // No, we trust the type mapping. But for boolean deletes, returnSuffix adds the logic.
      if (action.output.kind === "primitive" && action.output.type === "boolean" && type !== 'delete') {
        // E.g. checkExists -> count > 0
        prismaOp = "count";
        prismaArgs = "{ where: input }";
        returnSuffix = " > 0";
      }

      // --- Generación de Código ---
      const signature = generateInputSignature(action.input);
      const args = signature ? signature : "input?: any";

      // Build the return statement
      let returnStatement = `return ${returnWrapper}prisma.${prismaClient}.${prismaOp}(${prismaArgs})${returnSuffix};`;

      return `
  async ${action.name}(${args}) {
    // Logic inferred: ${prismaOp} on ${model.name}
    ${returnStatement}
  }`;
    })
    .join(",\n"); // Correcto para Objetos

  return `
import { db as prisma } from "../../orivus/core/db";

export const ${spec.moduleName}Service = {
${methods}
};`;
}