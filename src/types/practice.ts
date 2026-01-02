
import { PracticeProblem } from './content';

export interface PracticePack {
    slug: string; // matches tutorial slug
    problems: PracticeProblem[];
}

// Standards: 
// Beginner: 15-20
// Intermediate: 20-30
// Advanced: 10-15
// Total: 45-65

export function categorizeProblems(problems: PracticeProblem[]) {
    return {
        beginner: problems.filter(p => p.difficulty === 'Beginner'),
        intermediate: problems.filter(p => p.difficulty === 'Intermediate'),
        advanced: problems.filter(p => p.difficulty === 'Advanced')
    };
}
