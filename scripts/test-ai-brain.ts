import { searchKnowledge } from '../src/lib/ai/searchEngine';
import { generateMockResponse } from '../src/lib/ai/llm';
import { AIContextData } from '../src/lib/ai/llm';

const TEST_CASES = [
    { query: "html", expected: "Introduction to HTML", expectAction: true },
    { query: "explain arrays", expected: "Array", expectAction: false }, // "explain" might not trigger auto-nav
    { query: "open java", expected: "Java", expectAction: true },
    { query: "merge sort", expected: "Merge", expectAction: true }, // High confidence
    { query: "what is a stack", expected: "Stack", expectAction: false },
    { query: "react hooks", expected: "Hooks", expectAction: true }
];

console.log("🤖 Running AI Brain Stress Test...\n");

let passed = 0;
let failed = 0;

TEST_CASES.forEach(test => {
    // 1. Test Search Engine Ranks
    const results = searchKnowledge(test.query);
    const topResult = results[0];

    const isRankSuccess = topResult && topResult.title.toLowerCase().includes(test.expected.toLowerCase());

    // 2. Test LLM Action Generation
    const context: AIContextData = {};
    const response = generateMockResponse([{ role: 'user', content: test.query }], context);

    let isActionSuccess = true;
    if (test.expectAction) {
        isActionSuccess = response.includes('"action":"navigate"');
    }

    if (isRankSuccess && isActionSuccess) {
        console.log(`✅ PASS: "${test.query}" -> Found "${topResult?.title}" [Action: ${test.expectAction ? 'YES' : 'NO'}]`);
        passed++;
    } else {
        console.error(`❌ FAIL: "${test.query}"`);
        console.error(`   - Expected: "${test.expected}" (Action: ${test.expectAction})`);
        console.error(`   - Found:    "${topResult?.title}"`);
        console.error(`   - Response: ${response.substring(0, 100)}...`);
        failed++;
    }
});

console.log(`\nResults: ${passed}/${TEST_CASES.length} Passed.`);
if (failed > 0) process.exit(1);
