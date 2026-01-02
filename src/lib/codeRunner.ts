
export interface ExecutionResult {
    stdout: string;
    stderr: string;
    output: string;
    exitCode: number;
}

const LANGUAGE_MAP: Record<string, string> = {
    javascript: 'javascript',
    js: 'javascript',
    python: 'python3',
    py: 'python3',
    c: 'c',
    cpp: 'cpp',
    java: 'java',
};

export const executeCode = async (code: string, language: string): Promise<ExecutionResult> => {
    const pistonLang = LANGUAGE_MAP[language.toLowerCase()] || language;

    try {
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: pistonLang,
                version: '*',
                files: [{ content: code }],
            }),
        });

        const data = await response.json();
        return {
            stdout: data.run.stdout,
            stderr: data.run.stderr,
            output: data.run.output,
            exitCode: data.run.code,
        };
    } catch (error) {
        return {
            stdout: '',
            stderr: 'Failed to connect to execution server.',
            output: 'Error: Execution server unreachable.',
            exitCode: 1,
        };
    }
};
