export type SupportedDataType = 'string' | 'number' | 'boolean' | 'date' | 'json';

export type FieldDefinition = {
    type: SupportedDataType;
    required?: boolean;
    description?: string;
    isArray?: boolean;
};

export type ModelSchema = Record<string, FieldDefinition>;

export interface PrimitiveOutput {
    kind: 'primitive';
    type: SupportedDataType;
}

export interface ModelReferenceOutput {
    kind: 'model';
    modelName: string;
    isArray?: boolean;
}

export type ActionOutput = PrimitiveOutput | ModelReferenceOutput;

export type ActionDefinition = {
    input?: ModelSchema;
    output?: ActionOutput;
    description?: string;
};

export type ModuleSpec = {
    name: string;
    description?: string;
    models: Record<string, ModelSchema>;
    actions: Record<string, ActionDefinition>;
};