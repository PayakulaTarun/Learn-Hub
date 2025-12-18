
import { CompanyBattleground, MockExam } from '../types/evaluator';

export const companies: CompanyBattleground[] = [
    {
        id: 'google',
        name: 'Google',
        hiringPattern: {
            pattern: 'Focuses heavily on raw problem-solving, algorithmic efficiency, and scalable system design. Usually includes 4-5 technical rounds.',
            questionTypes: ['Advanced DSA', 'System Design', 'Concurrency'],
            difficultyDistribution: { Easy: '10%', Medium: '50%', Hard: '40%' },
            hotTopics: ['Graphs', 'Dynamic Programming', 'Tries', 'Large Scale Systems']
        },
        questions: [
            {
                id: 'g-1',
                title: 'Trapping Rain Water',
                type: 'DSA',
                category: 'Arrays & Dynamic Programming',
                difficulty: 'Hard',
                description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
                constraints: ['n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
                solutionSlug: 'dynamic-programming-intro',
                language: 'javascript',
                initialCode: 'function trap(height) {\n  // Implement O(n) solution\n}'
            },
            {
                id: 'g-2',
                title: 'Word Search II',
                type: 'DSA',
                category: 'Backtracking & Tries',
                difficulty: 'Hard',
                description: 'Given an m x n board of characters and a list of strings words, return all words on the board.',
                solutionSlug: 'trie-implementation'
            }
        ]
    },
    {
        id: 'amazon',
        name: 'Amazon',
        hiringPattern: {
            pattern: 'Combines strong DSA requirements with a unique focus on "Leadership Principles". Expect questions about customer obsession and ownership.',
            questionTypes: ['DSA', 'Behavioral', 'System Design'],
            difficultyDistribution: { Easy: '20%', Medium: '60%', Hard: '20%' },
            hotTopics: ['Trees/Graphs', 'Hashing', 'Priority Queues', 'Object Oriented Design']
        },
        questions: [
            {
                id: 'amz-1',
                title: 'Lru Cache Implementation',
                type: 'DSA',
                category: 'Design & Data Structures',
                difficulty: 'Medium',
                description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
                solutionSlug: 'linked-list-basics'
            },
            {
                id: 'amz-2',
                title: 'Amazon Fresh Delivery',
                type: 'DSA',
                category: 'Heaps/Priority Queue',
                difficulty: 'Medium',
                description: 'Find the K closest delivery points to the origin (0,0).'
            }
        ]
    },
    {
        id: 'tcs',
        name: 'TCS',
        hiringPattern: {
            pattern: 'Focuses on Foundation (Aptitude + Basic Coding) for Ninja role and Advanced Coding/System concepts for Digital/Prime roles.',
            questionTypes: ['Aptitude', 'Core CS', 'Competitive Coding'],
            difficultyDistribution: { Easy: '50%', Medium: '40%', Hard: '10%' },
            hotTopics: ['Mathematics', 'DBMS', 'Operating Systems', 'String Manipulation']
        },
        questions: [
            {
                id: 'tcs-1',
                title: 'Process Scheduling',
                type: 'Core CS',
                category: 'Operating Systems',
                difficulty: 'Medium',
                description: 'Calculate average waiting time using Round Robin scheduling algorithm.',
                solutionSlug: 'os-introduction'
            }
        ]
    }
];

export const mockExams: MockExam[] = [
    {
        id: 'gate-cs-2025',
        title: 'GATE CS 2025 Full Length Mock',
        description: 'Comprehensive 65-question mock following exact GATE formatting.',
        durationMinutes: 180,
        sections: [
            { id: 'ga', title: 'General Aptitude', questionCount: 10, marksPerQuestion: 1.5 },
            { id: 'technical', title: 'Core CS Topics', questionCount: 55, marksPerQuestion: 1.5 }
        ],
        predictedWeightage: {
            'Algorithms': 15,
            'DBMS': 10,
            'OS': 10,
            'Computer Networks': 8,
            'Theory of Computation': 12,
            'Discrete Maths': 15
        },
        questions: [
            {
                id: 'q-1',
                text: 'What is the time complexity of building a heap of size n?',
                options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(n^2)'],
                correctAnswer: 'O(n)',
                explanation: 'Using the bottom-up heap construction method, it takes linear time.',
                type: 'MCQ',
                subject: 'Algorithms',
                marks: 2
            }
        ]
    }
];
