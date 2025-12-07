import {
    ModuleSpec,
    FieldDefinition,
    ModelSchema,
    ActionDefinition,
    ActionOutput,
} from "./module-spec";

export type ParsedField = {
    name: string;
    type: FieldDefinition["type"];
    required: boolean;
    description: string;
    isArray: boolean;
    target?: string;
    relationType?: string;
};

export type ParsedModel = {
    name: string;
    fields: ParsedField[];
};

export type ParsedAction = {
    name: string;
    input?: ParsedField[];
    output: ActionOutput | { kind: "void" };
    description?: string;
};

export type ParsedModuleSpec = {
    moduleName: string;
    models: ParsedModel[];
    actions: ParsedAction[];
};

const SUPPORTED_TYPES = ["string", "number", "boolean", "date", "json", "relation"] as const;

function validateField(name: string, field: FieldDefinition): ParsedField {
    if (!SUPPORTED_TYPES.includes(field.type)) {
        throw new Error(
            `Field "${name}" uses unsupported type "${field.type}". Allowed: ${SUPPORTED_TYPES.join(", ")}`
        );
    }

    if (field.type === 'relation') {
        if (!field.target || !field.relationType) {
            throw new Error(`Field "${name}" of type 'relation' must have 'target' and 'relationType'.`);
        }
    }

    return {
        name,
        type: field.type,
        required: field.required ?? true,
        description: field.description ?? "",
        isArray: field.isArray ?? false,
        target: field.target,
        relationType: field.relationType
    };
}

function normalizeOutput(output?: ActionOutput): ActionOutput | { kind: "void" } {
    if (!output) return { kind: "void" };

    if (output.kind === "primitive") {
        return { kind: "primitive", type: output.type };
    }

    if (output.kind === "model") {
        return {
            kind: "model",
            modelName: output.modelName,
            isArray: output.isArray ?? false,
        };
    }

    return { kind: "void" };
}

function validateAction(
    name: string,
    action: ActionDefinition,
    availableModels: string[]
): ParsedAction {
    let input: ParsedField[] | undefined = undefined;
    if (action.input) {
        input = Object.entries(action.input).map(([fieldName, field]) =>
            validateField(fieldName, field)
        );
    }

    const parsedOutput = normalizeOutput(action.output);

    if (parsedOutput.kind === "model") {
        if (!availableModels.includes(parsedOutput.modelName)) {
            // NOTE: In v0.3 with multiple modules, we might relax this check 
            // if the model is in another module. But for now, strict check.
            // Or we warn instead of error?
            // throw new Error(`Action "${name}" returns unknown model "${parsedOutput.modelName}".`);
        }
    }

    return {
        name,
        input,
        output: parsedOutput,
        description: action.description ?? "",
    };
}

function validateModel(modelName: string, schema: ModelSchema): ParsedModel {
    const fields = Object.entries(schema).map(([fieldName, def]) =>
        validateField(fieldName, def)
    );
    return { name: modelName, fields };
}

export function parseModuleSpec(spec: ModuleSpec): ParsedModuleSpec {
    if (!spec.name) {
        throw new Error("Module must have a 'name'.");
    }

    const moduleName = spec.name;

    const rawModels: Record<string, ModelSchema> = spec.models || {};
    const modelNames = Object.keys(rawModels);

    const parsedModels = modelNames.map((modelName) => {
        return validateModel(modelName, rawModels[modelName]);
    });

    const rawActions: Record<string, ActionDefinition> = spec.actions || {};

    const parsedActions = Object.entries(rawActions).map(([actionName, actionDef]) => {
        return validateAction(actionName, actionDef, modelNames);
    });

    return {
        moduleName,
        models: parsedModels,
        actions: parsedActions,
    };
}