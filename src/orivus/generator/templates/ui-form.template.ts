import { ParsedModuleSpec, ParsedField } from "../../core/spec-parser";
import { findCreateAction } from "../../core/action-resolver";

/**
 * Generates a Create Form component for a module using Orivus UI Kit
 */
export function generateFormComponent(spec: ParsedModuleSpec): string {
    const model = spec.models[0];
    const modelName = model.name;
    const moduleName = spec.moduleName;

    // Use centralized action resolver - single source of truth
    const createAction = findCreateAction(spec.actions);

    if (!createAction) {
        return `// No create action found for ${modelName}`;
    }

    const actionName = createAction.name;
    const inputFields = createAction.input || [];

    // 1. Identify Relations (explicit type=relation OR inferred from *Id pattern)
    const relationFields: { field: ParsedField; targetModule: string; targetModel: string }[] = [];

    inputFields.forEach(field => {
        // Explicit relation type
        if (field.type === 'relation' && field.target) {
            relationFields.push({
                field,
                targetModule: toCamelCase(field.target),
                targetModel: field.target
            });
        }
        // Inferred FK: field ends with "Id" (e.g., authorId -> author -> User)
        else if (field.type === 'string' && field.name.endsWith('Id')) {
            const baseName = field.name.slice(0, -2); // "authorId" -> "author"
            // Try to find the relation in the model definition
            const modelRelation = model.fields.find(f =>
                f.name === baseName && f.type === 'relation' && f.target
            );

            if (modelRelation && modelRelation.target) {
                relationFields.push({
                    field,
                    targetModule: toCamelCase(modelRelation.target),
                    targetModel: modelRelation.target
                });
            }
        }
    });

    // 2. Generate Relation Queries
    // Always pass {} because the target list action may have optional filters
    const relationQueries = relationFields.map(({ field, targetModule }) => {
        const pluralName = pluralize(capitalize(targetModule));
        return `    const { data: ${field.name}Options, isLoading: is${capitalize(field.name)}Loading } = trpc.${targetModule}.list${pluralName}.useQuery({});`;
    }).join('\n');

    // 3. Create a set of relation field names for quick lookup
    const relationFieldNames = new Set(relationFields.map(r => r.field.name));

    const stateDeclarations = inputFields
        .map(field => `    const [${field.name}, set${capitalize(field.name)}] = useState${getStateType(field)}(${getDefaultValue(field)});`)
        .join('\n');

    const resetStatements = inputFields
        .map(field => `            set${capitalize(field.name)}(${getDefaultValue(field)});`)
        .join('\n');

    const inputObject = inputFields
        .map(field => {
            if (field.type === 'date' && field.required) {
                return `${field.name}: ${field.name}!`;
            }
            return `${field.name}`;
        })
        .join(', ');

    const formFields = inputFields
        .map(field => {
            // Check if this field is a relation (FK)
            const relationInfo = relationFields.find(r => r.field.name === field.name);
            if (relationInfo) {
                return generateRelationField(field, relationInfo.targetModel);
            }
            return generateFormField(field);
        })
        .join('\n\n');

    return `"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Button } from "@orivus-ui/components/Button";
import { Input } from "@orivus-ui/components/Input";
import { Label } from "@orivus-ui/components/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@orivus-ui/components/Card";
import { RelationSelect } from "@orivus-ui/components/RelationSelect";
import { Switch } from "@orivus-ui/components/Switch";

export function Create${modelName}Form() {
${stateDeclarations}

    const utils = trpc.useContext();
    
    // Relation Queries
${relationQueries}

    const mutation = trpc.${moduleName}.${actionName}.useMutation({
        onSuccess: () => {
${resetStatements}
            utils.${moduleName}.invalidate();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ ${inputObject} });
    };

    const getFieldError = (field: string) => {
        // 1. Try standard tRPC Zod error (if aggregated by superjson/trpc)
        const zodError = (mutation.error as any)?.data?.zodError;
        if (zodError?.fieldErrors?.[field]) {
             return zodError.fieldErrors[field][0];
        }

        // 2. Fallback: Parse raw Zod array from message (common in some tRPC configs)
        const msg = mutation.error?.message;
        if (msg && msg.startsWith('[') && msg.includes('"code":')) {
            try {
                const parsed = JSON.parse(msg);
                const fieldErr = parsed.find((e: any) => e.path.includes(field));
                if (fieldErr) return fieldErr.message;
            } catch { /* ignore parse errors */ }
        }
        return null;
    };

    const isRawZodError = mutation.error?.message.startsWith('[') && mutation.error?.message.includes('"code":');
    const globalErrorMessage = isRawZodError ? "Please check the highlighted fields." : mutation.error?.message;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New ${modelName}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
${formFields}
                    <Button
                        type="submit"
                        disabled={mutation.isLoading}
                        className="w-full"
                    >
                        {mutation.isLoading ? "Creating..." : "Create ${modelName}"}
                    </Button>
                    {mutation.error && (
                        <p className="text-destructive text-sm text-center">{globalErrorMessage}</p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
`;
}

/**
 * Generates a RelationSelect field for FK inputs (v2)
 * Uses the new Smart Relations component with search and better UX
 */
function generateRelationField(field: ParsedField, targetModel: string): string {
    const label = formatLabel(field.name.replace(/Id$/, '')); // "authorId" -> "Author"
    const setterName = `set${capitalize(field.name)}`;
    const optionsName = `${field.name}Options`;
    const loadingName = `is${capitalize(field.name)}Loading`;
    const isRequired = field.required;

    return `            {/* Smart Relation: ${targetModel} */}
            <div className="space-y-2">
                <RelationSelect
                    label="${label}"
                    items={${optionsName} || []}
                    value={${field.name}}
                    onChange={${setterName}}
                    isLoading={${loadingName}}
                    placeholder="Select ${label.toLowerCase()}..."
                    required={${isRequired}}
                    searchable={true}
                />
                {getFieldError('${field.name}') && (
                    <p className="text-sm text-destructive">{getFieldError('${field.name}')}</p>
                )}
            </div>`;
}

function generateFormField(field: ParsedField): string {
    const label = capitalize(field.name);
    const setterName = `set${capitalize(field.name)}`;

    let inputType = "text";
    let inputElement = "Input";

    if (field.name.toLowerCase().includes('content') ||
        field.name.toLowerCase().includes('description')) {
        inputElement = "textarea";
    }

    switch (field.type) {
        case "string": inputType = "text"; break;
        case "number": inputType = "number"; break;
        case "boolean": inputType = "checkbox"; break;
        case "date": inputType = "date"; break;
    }

    // Common error display chunk
    const errorDisplay = `{getFieldError('${field.name}') && <p className="text-sm text-destructive">{getFieldError('${field.name}')}</p>}`;
    // For inside template literals (backticks): ${condition ? ... : ...}
    const errorTemplate = `\${getFieldError('${field.name}') ? "border-destructive" : ""}`;
    // For direct JSX prop: condition ? ... : ...
    const errorExpression = `getFieldError('${field.name}') ? "border-destructive" : ""`;

    if (inputElement === "textarea") {
        return `            <div className="space-y-2">
                <Label>${label}</Label>
                <textarea
                    value={${field.name}}
                    onChange={(e) => ${setterName}(e.target.value)}
                    className={\`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errorTemplate}\`}
                    required={${field.required}}
                />
                ${errorDisplay}
            </div>`;
    }

    if (inputType === "checkbox") {
        return `            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="${field.name}"
                        checked={${field.name}}
                        onCheckedChange={(checked) => ${setterName}(checked)}
                    />
                    <Label htmlFor="${field.name}">${label}</Label>
                </div>
                ${errorDisplay}
            </div>`;
    }

    if (field.type === "date") {
        return `            <div className="space-y-2">
                <Label>${label}</Label>
                <Input
                    type="date"
                    value={${field.name} instanceof Date ? ${field.name}.toISOString().split('T')[0] : ''}
                    onChange={(e) => ${setterName}(e.target.value ? new Date(e.target.value) : undefined)}
                    className={${errorExpression}}
                    required={${field.required}}
                />
                ${errorDisplay}
            </div>`;
    }

    return `            <div className="space-y-2">
                <Label>${label}</Label>
                <Input
                    type="${inputType}"
                    value={${field.name}}
                    onChange={(e) => ${setterName}(${inputType === 'number' ? 'Number(e.target.value)' : 'e.target.value'})}
                    className={${errorExpression}}
                    required={${field.required}}
                />
                ${errorDisplay}
            </div>`;
}

function getStateType(field: ParsedField): string {
    switch (field.type) {
        case "number": return "<number>";
        case "boolean": return "<boolean>";
        case "date": return "<Date | undefined>";
        default: return "<string>";
    }
}

function getDefaultValue(field: ParsedField): string {
    switch (field.type) {
        case "number": return "0";
        case "boolean": return "false";
        case "date": return "undefined";
        default: return '""';
    }
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function pluralize(word: string): string {
    // Handle common English pluralization rules
    if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word.charAt(word.length - 2).toLowerCase())) {
        return word.slice(0, -1) + 'ies'; // category -> categories
    }
    if (word.endsWith('s') || word.endsWith('x') || word.endsWith('ch') || word.endsWith('sh')) {
        return word + 'es'; // box -> boxes
    }
    return word + 's'; // default: product -> products
}

function toCamelCase(str: string): string {
    // Convert PascalCase to camelCase: BaseEntity -> baseEntity
    return str.charAt(0).toLowerCase() + str.slice(1);
}

function formatLabel(str: string): string {
    // Convert camelCase to Title Case: authorId -> Author, categoryName -> Category Name
    return str
        .replace(/([A-Z])/g, ' $1') // Add space before capitals
        .replace(/^./, s => s.toUpperCase()) // Capitalize first letter
        .trim();
}
