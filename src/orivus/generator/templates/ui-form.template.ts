import { ParsedModuleSpec, ParsedField } from "../../core/spec-parser";

/**
 * Generates a Create Form component for a module using Orivus UI Kit
 */
export function generateFormComponent(spec: ParsedModuleSpec): string {
    const model = spec.models[0];
    const modelName = model.name;
    const moduleName = spec.moduleName;

    const createAction = spec.actions.find(a =>
        a.name.toLowerCase().includes('create') ||
        a.name.toLowerCase().includes('add') ||
        a.name.toLowerCase().includes('new')
    );

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
                targetModule: field.target.toLowerCase(),
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
                    targetModule: modelRelation.target.toLowerCase(),
                    targetModel: modelRelation.target
                });
            }
        }
    });

    // 2. Generate Relation Queries
    const relationQueries = relationFields.map(({ field, targetModule }) => {
        // Find the appropriate list action name (listUsers, list, etc.)
        return `    const { data: ${field.name}Options, isLoading: is${capitalize(field.name)}Loading } = trpc.${targetModule}.list${capitalize(targetModule)}s.useQuery();`;
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
        .map(field => `${field.name}`)
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
                        <p className="text-destructive text-sm">{mutation.error.message}</p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
`;
}

/**
 * Generates a RelationSelect field for FK inputs
 */
function generateRelationField(field: ParsedField, targetModel: string): string {
    const label = targetModel; // Use model name instead of "AuthorId"
    const setterName = `set${capitalize(field.name)}`;
    const optionsName = `${field.name}Options`;
    const loadingName = `is${capitalize(field.name)}Loading`;

    return `            <div className="space-y-2">
                <Label>${label}</Label>
                <RelationSelect
                    items={${optionsName} || []}
                    value={${field.name}}
                    onChange={${setterName}}
                    isLoading={${loadingName}}
                    placeholder="Select ${targetModel}..."
                />
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

    if (inputElement === "textarea") {
        return `            <div className="space-y-2">
                <Label>${label}</Label>
                <textarea
                    value={${field.name}}
                    onChange={(e) => ${setterName}(e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required={${field.required}}
                />
            </div>`;
    }

    if (inputType === "checkbox") {
        return `            <div className="flex items-center space-x-2">
                <Switch
                    id="${field.name}"
                    checked={${field.name}}
                    onCheckedChange={(checked) => ${setterName}(checked)}
                />
                <Label htmlFor="${field.name}">${label}</Label>
            </div>`;
    }

    return `            <div className="space-y-2">
                <Label>${label}</Label>
                <Input
                    type="${inputType}"
                    value={${field.name}}
                    onChange={(e) => ${setterName}(${inputType === 'number' ? 'Number(e.target.value)' : 'e.target.value'})}
                    required={${field.required}}
                />
            </div>`;
}

function getStateType(field: ParsedField): string {
    switch (field.type) {
        case "number": return "<number>";
        case "boolean": return "<boolean>";
        default: return "<string>";
    }
}

function getDefaultValue(field: ParsedField): string {
    switch (field.type) {
        case "number": return "0";
        case "boolean": return "false";
        default: return '""';
    }
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
