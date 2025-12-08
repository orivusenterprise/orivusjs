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
      // --- Lógica Heurística v0.3 ---
      let prismaOp = "findMany";
      let prismaArgs = "{}";
      let returnWrapper = ""; // For wrapping the return statement
      let returnSuffix = ""; // For adding after the prisma call

      const actionLower = action.name.toLowerCase();

      if (action.output.kind === "model") {
        if (action.output.isArray) {
          // List actions
          prismaOp = "findMany";
        } else {
          // Single model actions
          const isCreate = /^create|add|submit|register|link/i.test(actionLower);
          const isUpdate = /^update|edit|modify|patch/i.test(actionLower);
          const isApprove = /^approve|activate|enable|disable|toggle/i.test(actionLower);

          // Build where clause from input fields (use first field if not 'id')
          const inputFields = action.input || [];
          const whereField = inputFields.find(f => f.name === 'id')?.name
            || inputFields[0]?.name
            || 'id';
          const whereClause = `{ where: { ${whereField}: input.${whereField} } }`;

          if (isCreate) {
            prismaOp = "create";
            prismaArgs = "{ data: input }";
          } else if (isUpdate || isApprove) {
            // Update action - needs where and data
            prismaOp = "update";
            // For update, use id if available, else first field
            prismaArgs = `{ where: { ${whereField}: input.${whereField} }, data: input }`;
          } else {
            // Get/Find action - use findFirstOrThrow to ensure non-null return
            prismaOp = "findFirstOrThrow";
            prismaArgs = whereClause;
          }
        }
      } else if (action.output.kind === "primitive") {
        const outputType = action.output.type;

        // Build where clause from input fields
        const inputFields = action.input || [];
        const whereField = inputFields.find(f => f.name === 'id')?.name
          || inputFields[0]?.name
          || 'id';
        const whereClause = `{ where: { ${whereField}: input.${whereField} } }`;

        if (outputType === "boolean") {
          // Delete actions typically return boolean
          const isDelete = /^delete|remove|destroy/i.test(actionLower);

          if (isDelete) {
            prismaOp = "delete";
            prismaArgs = whereClause;
            // Wrap in try-catch to return boolean
            returnWrapper = "await ";
            returnSuffix = ".then(() => true).catch(() => false)";
          } else {
            // Other boolean actions (e.g., exists check)
            prismaOp = "count";
            prismaArgs = "{ where: input }";
            returnSuffix = " > 0";
          }
        } else if (outputType === "number") {
          // Count actions
          prismaOp = "count";
          prismaArgs = "{}";
        }
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