import { tokenize } from './nlp';
import knowledgeBase from './knowledgeIndex.json'; // Make sure this JSON exists (initially empty)

export interface KnowledgeItem {
    id: string;
    title: string;
    description: string;
    content: string; // The specific snippet/paragraph
    tokens: string[];
    type: 'concept' | 'problem' | 'tutorial';
    url: string;
}

// Fallback if JSON is missing during build
const INDEX: KnowledgeItem[] = (knowledgeBase as any) || [];

export function searchKnowledge(query: string, context?: string): KnowledgeItem[] {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const scoredItems = INDEX.map(item => {
        let score = 0;

        // boost for context relevance
        if (context && item.title.toLowerCase().includes(context.toLowerCase())) {
            score += 20;
        }

        queryTokens.forEach(token => {
            // Title Match (High Priority)
            if (item.title.toLowerCase().includes(token)) score += 10;
            // Token Match (Exact)
            if (item.tokens.includes(token)) score += 5;
            // Content substring match (Low Priority)
            if (item.content.toLowerCase().includes(token)) score += 1;
        });

        return { item, score };
    });

    return scoredItems
        .filter(match => match.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3) // Top 3
        .map(match => match.item);
}
