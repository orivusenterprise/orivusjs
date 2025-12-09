/**
 * Spec Validator
 * 
 * Validates module specs BEFORE generation to catch errors early.
 * This prevents cryptic Prisma/tRPC errors by detecting issues at spec level.
 */

import { ModuleSpec, FieldDefinition, RelationType, SupportedDataType } from "./module-spec";

// ============================================================================
// Types
// ============================================================================

export interface ValidationError {
    code: string;
    message: string;
    path: string;
    suggestion?: string;
}

export interface ValidationWarning {
    code: string;
    message: string;
    path: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}

// ============================================================================
// Constants
// ============================================================================

const VALID_TYPES: SupportedDataType[] = ["string", "number", "boolean", "date", "json", "relation"];
const VALID_RELATION_TYPES: RelationType[] = ["belongsTo", "hasMany", "hasOne", "manyToMany"];
const RESERVED_FIELD_NAMES = ["id", "createdAt", "updatedAt"];
const PASCAL_CASE_REGEX = /^[A-Z][a-zA-Z0-9]*$/;
const CAMEL_CASE_REGEX = /^[a-z][a-zA-Z0-9]*$/;

// ============================================================================
// Main Validator
// ============================================================================

export function validateSpec(spec: ModuleSpec): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 1. Basic Structure
    validateBasicStructure(spec, errors);

    // 2. Module Name
    validateModuleName(spec, errors, warnings);

    // 3. Models
    if (spec.models) {
        validateModels(spec, errors, warnings);
        validateModelNaming(spec, warnings);
        validateDefaultValues(spec, errors);
    }

    // 4. Actions
    if (spec.actions) {
        validateActions(spec, errors, warnings);
    }

    // 5. Intelligent Validations (prevent generation failures)
    validateListActionExists(spec, warnings);

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateBasicStructure(spec: ModuleSpec, errors: ValidationError[]): void {
    if (!spec.name) {
        errors.push({
            code: "MISSING_NAME",
            message: "Module must have a 'name' field",
            path: "name",
            suggestion: "Add a 'name' field, e.g. \"name\": \"user\""
        });
    }

    if (!spec.models || Object.keys(spec.models).length === 0) {
        errors.push({
            code: "MISSING_MODELS",
            message: "Module must define at least one model",
            path: "models",
            suggestion: "Add a 'models' object with at least one model definition"
        });
    }

    if (!spec.actions || Object.keys(spec.actions).length === 0) {
        errors.push({
            code: "MISSING_ACTIONS",
            message: "Module must define at least one action",
            path: "actions",
            suggestion: "Add an 'actions' object with at least one action (e.g., createUser, listUsers)"
        });
    }
}

function validateModuleName(spec: ModuleSpec, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!spec.name) return;

    if (!CAMEL_CASE_REGEX.test(spec.name)) {
        errors.push({
            code: "INVALID_MODULE_NAME",
            message: `Module name '${spec.name}' should be camelCase`,
            path: "name",
            suggestion: `Use camelCase, e.g. '${spec.name.charAt(0).toLowerCase() + spec.name.slice(1)}'`
        });
    }
}

function validateModels(spec: ModuleSpec, errors: ValidationError[], warnings: ValidationWarning[]): void {
    const modelNames = Object.keys(spec.models);

    modelNames.forEach(modelName => {
        const model = spec.models[modelName];
        const modelPath = `models.${modelName}`;

        // Model name should be PascalCase
        if (!PASCAL_CASE_REGEX.test(modelName)) {
            errors.push({
                code: "INVALID_MODEL_NAME",
                message: `Model name '${modelName}' should be PascalCase`,
                path: modelPath,
                suggestion: `Use PascalCase, e.g. '${modelName.charAt(0).toUpperCase() + modelName.slice(1)}'`
            });
        }

        // Validate fields
        if (model && typeof model === 'object') {
            const fieldNames = Object.keys(model);

            if (fieldNames.length === 0) {
                warnings.push({
                    code: "EMPTY_MODEL",
                    message: `Model '${modelName}' has no fields defined`,
                    path: modelPath
                });
            }

            fieldNames.forEach(fieldName => {
                const field = model[fieldName] as FieldDefinition;
                const fieldPath = `${modelPath}.${fieldName}`;

                validateField(fieldName, field, fieldPath, modelNames, errors, warnings);
            });

            // Check for duplicate field names (case-insensitive)
            const lowerFieldNames = fieldNames.map(f => f.toLowerCase());
            const duplicates = lowerFieldNames.filter((name, index) => lowerFieldNames.indexOf(name) !== index);
            if (duplicates.length > 0) {
                errors.push({
                    code: "DUPLICATE_FIELDS",
                    message: `Model '${modelName}' has duplicate field names: ${duplicates.join(", ")}`,
                    path: modelPath
                });
            }
        }
    });
}

function validateField(
    fieldName: string,
    field: FieldDefinition,
    path: string,
    modelNames: string[],
    errors: ValidationError[],
    warnings: ValidationWarning[]
): void {
    // Field type is required
    if (!field.type) {
        errors.push({
            code: "MISSING_FIELD_TYPE",
            message: `Field '${fieldName}' is missing 'type'`,
            path,
            suggestion: `Add a type, one of: ${VALID_TYPES.join(", ")}`
        });
        return;
    }

    // Validate type
    if (!VALID_TYPES.includes(field.type as SupportedDataType)) {
        errors.push({
            code: "INVALID_FIELD_TYPE",
            message: `Field '${fieldName}' has invalid type '${field.type}'`,
            path: `${path}.type`,
            suggestion: `Valid types are: ${VALID_TYPES.join(", ")}`
        });
    }

    // Relation-specific validation
    if (field.type === "relation") {
        if (!field.target) {
            errors.push({
                code: "MISSING_RELATION_TARGET",
                message: `Relation field '${fieldName}' is missing 'target'`,
                path,
                suggestion: "Add a 'target' field pointing to the related model, e.g. \"target\": \"User\""
            });
        } else if (!modelNames.includes(field.target)) {
            // Target model doesn't exist in this spec - this might be intentional (external)
            warnings.push({
                code: "EXTERNAL_RELATION_TARGET",
                message: `Relation '${fieldName}' targets '${field.target}' which is not defined in this spec`,
                path: `${path}.target`
            });
        }

        if (!field.relationType) {
            errors.push({
                code: "MISSING_RELATION_TYPE",
                message: `Relation field '${fieldName}' is missing 'relationType'`,
                path,
                suggestion: `Add a 'relationType', one of: ${VALID_RELATION_TYPES.join(", ")}`
            });
        } else if (!VALID_RELATION_TYPES.includes(field.relationType as RelationType)) {
            errors.push({
                code: "INVALID_RELATION_TYPE",
                message: `Relation '${fieldName}' has invalid relationType '${field.relationType}'`,
                path: `${path}.relationType`,
                suggestion: `Valid relation types are: ${VALID_RELATION_TYPES.join(", ")}`
            });
        }

        // Warn about manyToMany (not fully supported yet)
        if (field.relationType === "manyToMany") {
            warnings.push({
                code: "MANYTOMANY_LIMITED",
                message: `manyToMany relations have limited support. Field '${fieldName}' may require manual schema adjustments.`,
                path
            });
        }
    }

    // Warn about reserved field names
    if (RESERVED_FIELD_NAMES.includes(fieldName)) {
        warnings.push({
            code: "RESERVED_FIELD_NAME",
            message: `Field '${fieldName}' is auto-generated. Your definition will be ignored.`,
            path
        });
    }
}

// Add constant for valid action types
const VALID_ACTION_TYPES = ['create', 'update', 'delete', 'list', 'get', 'count', 'custom'];

function validateActions(spec: ModuleSpec, errors: ValidationError[], warnings: ValidationWarning[]): void {
    const actionNames = Object.keys(spec.actions);
    const modelNames = Object.keys(spec.models || {});

    actionNames.forEach(actionName => {
        const action = spec.actions[actionName];
        const actionPath = `actions.${actionName}`;

        // Validate explicit type if present
        if (action.type) {
            if (!VALID_ACTION_TYPES.includes(action.type)) {
                errors.push({
                    code: "INVALID_ACTION_TYPE",
                    message: `Invalid action type '${action.type}'`,
                    path: `${actionPath}.type`,
                    suggestion: `Valid types are: ${VALID_ACTION_TYPES.join(", ")}`
                });
            }
        }

        // Action name should be camelCase
        if (!CAMEL_CASE_REGEX.test(actionName)) {
            errors.push({
                code: "INVALID_ACTION_NAME",
                message: `Action name '${actionName}' should be camelCase`,
                path: actionPath,
                suggestion: `Use camelCase, e.g. 'create${modelNames[0] || 'Entity'}'`
            });
        }

        // Validate output
        if (!action.output) {
            errors.push({
                code: "MISSING_ACTION_OUTPUT",
                message: `Action '${actionName}' is missing 'output'`,
                path: actionPath,
                suggestion: "Add an 'output' object, e.g. { \"kind\": \"model\", \"modelName\": \"User\" }"
            });
        } else {
            const output = action.output as any;
            if (output.kind === "model" && output.modelName) {
                if (!modelNames.includes(output.modelName)) {
                    errors.push({
                        code: "INVALID_OUTPUT_MODEL",
                        message: `Action '${actionName}' references model '${output.modelName}' which doesn't exist`,
                        path: `${actionPath}.output.modelName`,
                        suggestion: `Available models: ${modelNames.join(", ") || "none"}`
                    });
                }
            }
        }

        // Validate input fields if present
        if (action.input && typeof action.input === "object") {
            const inputFieldNames = Object.keys(action.input);
            inputFieldNames.forEach(inputFieldName => {
                const inputField = action.input![inputFieldName as keyof typeof action.input] as FieldDefinition;
                const inputPath = `${actionPath}.input.${inputFieldName}`;

                if (!inputField.type) {
                    errors.push({
                        code: "MISSING_INPUT_TYPE",
                        message: `Input field '${inputFieldName}' in action '${actionName}' is missing 'type'`,
                        path: inputPath,
                        suggestion: `Add a type, one of: ${VALID_TYPES.filter(t => t !== "relation").join(", ")}`
                    });
                }
            });
        }
    });

    // Check for recommended actions (Explicit type OR regex fallback)
    const hasCreate = actionNames.some(n => {
        const action = spec.actions[n];
        return action.type === 'create' || n.toLowerCase().includes("create") || n.toLowerCase().includes("add");
    });

    const hasList = actionNames.some(n => {
        const action = spec.actions[n];
        return action.type === 'list' || n.toLowerCase().includes("list") || n.toLowerCase().includes("get");
    });

    if (!hasCreate) {
        warnings.push({
            code: "NO_CREATE_ACTION",
            message: "No create/add action found. UI form generation will be skipped.",
            path: "actions"
        });
    }

    if (!hasList) {
        warnings.push({
            code: "NO_LIST_ACTION",
            message: "No list/get action found. UI list generation will be skipped.",
            path: "actions"
        });
    }
}

// ============================================================================
// Helper: Format Validation Result for CLI Output
// ============================================================================

export function formatValidationResult(result: ValidationResult): string {
    const lines: string[] = [];

    if (result.valid) {
        lines.push("✅ Spec validation passed");
    } else {
        lines.push("❌ Spec validation failed");
    }

    if (result.errors.length > 0) {
        lines.push("");
        lines.push("Errors:");
        result.errors.forEach(e => {
            lines.push(`  ❌ [${e.code}] ${e.message}`);
            lines.push(`     Path: ${e.path}`);
            if (e.suggestion) {
                lines.push(`     💡 ${e.suggestion}`);
            }
        });
    }

    if (result.warnings.length > 0) {
        lines.push("");
        lines.push("Warnings:");
        result.warnings.forEach(w => {
            lines.push(`  ⚠️  [${w.code}] ${w.message}`);
            lines.push(`     Path: ${w.path}`);
        });
    }

    return lines.join("\n");
}

// ============================================================================
// Intelligent Validations (Prevent common generation failures)
// ============================================================================

/**
 * Validates that the module has a list action if it will be used in relation dropdowns.
 * This prevents "listXxx not found" errors in generated UI forms.
 */
export function validateListActionExists(spec: ModuleSpec, warnings: ValidationWarning[]): void {
    const actions = spec.actions || {};
    const actionList = Object.values(actions);

    // Check if any action has type: "list" or name contains "list"
    const hasListAction = actionList.some(a =>
        (a as any).type === 'list' ||
        Object.keys(actions).some(name => name.toLowerCase().includes('list'))
    );

    if (!hasListAction) {
        warnings.push({
            code: "NO_LIST_ACTION",
            message: `Module '${spec.name}' has no 'list' action. If this module is referenced by relations, UI forms will fail.`,
            path: "actions"
        });
    }
}

/**
 * Validates model names for potential pluralization issues.
 * Warns about names that might pluralize incorrectly.
 */
export function validateModelNaming(spec: ModuleSpec, warnings: ValidationWarning[]): void {
    const modelNames = Object.keys(spec.models || {});

    modelNames.forEach(name => {
        // Check for names ending in 'y' preceded by consonant (category, company, etc.)
        if (name.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(name.charAt(name.length - 2).toLowerCase())) {
            warnings.push({
                code: "PLURALIZATION_NOTE",
                message: `Model '${name}' ends in 'y'. List action should be 'list${name.slice(0, -1)}ies' (not 'list${name}s')`,
                path: `models.${name}`
            });
        }
    });
}

/**
 * Validates that default values match their field types.
 */
export function validateDefaultValues(spec: ModuleSpec, errors: ValidationError[]): void {
    const models = spec.models || {};

    Object.entries(models).forEach(([modelName, model]) => {
        Object.entries(model).forEach(([fieldName, field]) => {
            const def = field as FieldDefinition;
            if (def.default !== undefined) {
                const defaultType = typeof def.default;
                let expectedType: string;

                switch (def.type) {
                    case 'string': expectedType = 'string'; break;
                    case 'number': expectedType = 'number'; break;
                    case 'boolean': expectedType = 'boolean'; break;
                    default: expectedType = 'any';
                }

                if (expectedType !== 'any' && defaultType !== expectedType) {
                    errors.push({
                        code: "INVALID_DEFAULT_TYPE",
                        message: `Field '${fieldName}' has type '${def.type}' but default value is '${defaultType}'`,
                        path: `models.${modelName}.${fieldName}`,
                        suggestion: `Change default to a ${expectedType} value`
                    });
                }
            }
        });
    });
}
