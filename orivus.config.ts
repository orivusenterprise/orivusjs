export interface OrivusConfig {
    project: {
        name: string;
        version: string;
    };
    ai: {
        model: string;
        temperature: number;
    };
    server: {
        port: number;
    };
}

const config: OrivusConfig = {
    project: {
        name: "orivusjs-app",
        version: "0.1.0",
    },
    ai: {
        model: "gpt-4-turbo",
        temperature: 0.7,
    },
    server: {
        port: 3000,
    },
};

export default config;
