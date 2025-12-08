export type SupportedDataType = 'string' | 'number' | 'boolean' | 'date' | 'json' | 'relation';

export type RelationType = 'hasOne' | 'hasMany' | 'belongsTo' | 'manyToMany';

export type FieldDefinition = {
    type: SupportedDataType;
    required?: boolean;
    description?: string;
    isArray?: boolean;
    // Relation specifics
    target?: string;       // Name of the target model (e.g., "User")
    relationType?: RelationType;
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

export type ActionType = 'create' | 'update' | 'delete' | 'list' | 'get' | 'count' | 'custom';

export type ActionDefinition = {
    type?: ActionType; // Explicit type hint to avoid heuristic guessing
    input?: ModelSchema;
    output?: ActionOutput;
    description?: string;
};

export type ModuleSpec = {
    name: string;
    description?: string;
    models: Record<string, ModelSchema>;
    actions: Record<string, ActionDefinition>;
    skipUI?: boolean; // v0.4.1: Skip frontend generation for backend-only modules
};