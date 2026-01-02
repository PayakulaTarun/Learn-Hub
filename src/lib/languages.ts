export interface LanguageConfig {
    id: string;
    name: string;
    monacoId: string; // ID used by Monaco Editor
    pistonRuntime: string; // ID used by Piston API
    version: string;
    fileExtension: string;
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
    javascript: {
        id: 'javascript',
        name: 'JavaScript (Node.js)',
        monacoId: 'javascript',
        pistonRuntime: 'javascript',
        version: '18.15.0',
        fileExtension: 'js'
    },
    python: {
        id: 'python',
        name: 'Python 3',
        monacoId: 'python',
        pistonRuntime: 'python',
        version: '3.10.0',
        fileExtension: 'py'
    },
    cpp: {
        id: 'cpp',
        name: 'C++ (GCC)',
        monacoId: 'cpp',
        pistonRuntime: 'cpp',
        version: '10.2.0',
        fileExtension: 'cpp'
    },
    java: {
        id: 'java',
        name: 'Java (OpenJDK)',
        monacoId: 'java',
        pistonRuntime: 'java',
        version: '15.0.2',
        fileExtension: 'java'
    }
};

export const DEFAULT_LANGUAGE = 'javascript';
