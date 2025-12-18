
import { CodeReviewResult } from '../types/evaluator';

export function analyzeCode(code: string, language: string): CodeReviewResult {
    const findings: CodeReviewResult['findings'] = [];
    let score = 90;
    let cleanCodeScore = 85;
    let readabilityScore = 88;

    // 1. Complexity Heuristics (Simple regex based for now)
    const lines = code.split('\n');
    let hasNestedLoops = false;
    let loopCount = 0;

    // Check for nested loops (O(n^2) hint)
    const nestedLoopRegex = /(for|while).*\{[\s\S]*?(for|while)/g;
    if (nestedLoopRegex.test(code)) {
        hasNestedLoops = true;
        findings.push({
            type: 'optimization',
            message: 'Nested loops detected.',
            suggestion: 'Consider if an O(n) approach using a Hash Map or Two Pointers is possible to avoid O(n^2) complexity.'
        });
        score -= 15;
    }

    // 2. Naming Conventions
    const varRegex = /(var|let|const)\s+([a-zA-Z0-9_$]+)\s*=/g;
    let match;
    while ((match = varRegex.exec(code)) !== null) {
        const varName = match[2];
        if (varName.length < 3 && !['i', 'j', 'k', 'n', 'x', 'y'].includes(varName)) {
            findings.push({
                type: 'style',
                message: `Cryptic variable name: "${varName}"`,
                suggestion: 'Use descriptive names like "studentCount" instead of "sc".'
            });
            cleanCodeScore -= 5;
        }
    }

    // 3. Comments & Documentation
    const commentCount = (code.match(/\/\/|\/\* /g) || []).length;
    if (commentCount === 0 && lines.length > 10) {
        findings.push({
            type: 'style',
            message: 'Insufficient documentation.',
            suggestion: 'Add comments to explain complex logic blocks for better maintainability.'
        });
        readabilityScore -= 10;
    }

    // 4. Industry Standards (e.g., using var in JS)
    if (language === 'javascript' && code.includes('var ')) {
        findings.push({
            type: 'style',
            message: 'Avoid "var" keyword.',
            suggestion: 'Use "let" or "const" for better block scoping and to avoid variable hoisting issues.'
        });
        cleanCodeScore -= 10;
    }

    // 5. Complexity Estimation
    let timeComp = 'O(n)';
    let spaceComp = 'O(1)';

    if (hasNestedLoops) timeComp = 'O(n²)';
    if (code.includes('new Array') || code.includes('[]') || code.includes('set') || code.includes('map')) {
        spaceComp = 'O(n)';
    }

    return {
        score: Math.max(0, score),
        cleanCodeScore: Math.max(0, cleanCodeScore),
        readabilityScore: Math.max(0, readabilityScore),
        complexityAnalysis: {
            time: timeComp,
            space: spaceComp
        },
        findings
    };
}
