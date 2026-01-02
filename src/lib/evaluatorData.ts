
import { CompanyBattleground, MockExam } from '../types/evaluator';

export const companies: CompanyBattleground[] = [
    // Product-Based Companies
    {
        id: 'google',
        name: 'Google',
        hiringPattern: {
            pattern: 'Focuses heavily on raw problem-solving, algorithmic efficiency, and scalable system design. Usually includes 4-5 technical rounds.',
            questionTypes: ['Advanced DSA', 'System Design', 'Concurrency'],
            difficultyDistribution: { Easy: '10%', Medium: '40%', Hard: '50%' },
            hotTopics: ['Graphs', 'Dynamic Programming', 'Tries', 'Large Scale Systems']
        },
        questions: []
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
        questions: []
    },
    {
        id: 'microsoft',
        name: 'Microsoft',
        hiringPattern: {
            pattern: 'Problem solving with a focus on edge cases and code quality.',
            questionTypes: ['DSA', 'OS/Logic', 'Low Level Design'],
            difficultyDistribution: { Easy: '25%', Medium: '55%', Hard: '20%' },
            hotTopics: ['Linked Lists', 'Binary Trees', 'Strings']
        },
        questions: []
    },
    {
        id: 'meta',
        name: 'Meta',
        hiringPattern: {
            pattern: 'Fast-paced DSA rounds focusing on speed and accuracy.',
            questionTypes: ['DSA', 'System Design', 'Culture Fit'],
            difficultyDistribution: { Easy: '15%', Medium: '50%', Hard: '35%' },
            hotTopics: ['Recursion', 'Arrays', 'Performance Optimization']
        },
        questions: []
    },
    {
        id: 'netflix',
        name: 'Netflix',
        hiringPattern: {
            pattern: 'Deep focus on cultural fit, freedom and responsibility, and extreme technical excellence.',
            questionTypes: ['Cloud Architecture', 'Performance', 'Culture'],
            difficultyDistribution: { Easy: '5%', Medium: '40%', Hard: '55%' },
            hotTopics: ['Distributed Systems', 'Chaos Engineering', 'Java/JVM']
        },
        questions: []
    },
    {
        id: 'uber',
        name: 'Uber',
        hiringPattern: {
            pattern: 'Intense focus on concurrency, distributed systems, and graph algorithms.',
            questionTypes: ['DSA (Advanced)', 'System Design', 'Machine Coding'],
            difficultyDistribution: { Easy: '5%', Medium: '45%', Hard: '50%' },
            hotTopics: ['Graph Theory', 'Real-time Systems', 'Concurrency']
        },
        questions: []
    },
    {
        id: 'flipkart',
        name: 'Flipkart',
        hiringPattern: {
            pattern: 'Known for challenging Machine Coding rounds and deep DSA.',
            questionTypes: ['Machine Coding', 'DSA', 'LLD/HLD'],
            difficultyDistribution: { Easy: '10%', Medium: '50%', Hard: '40%' },
            hotTopics: ['Design Patterns', 'Complex DSA', 'Backend Logic']
        },
        questions: []
    },
    {
        id: 'adobe',
        name: 'Adobe',
        hiringPattern: {
            pattern: 'Focus on C++ fundamentals, creative problem solving, and product engineering.',
            questionTypes: ['DSA', 'Operating Systems', 'OOPs'],
            difficultyDistribution: { Easy: '20%', Medium: '50%', Hard: '30%' },
            hotTopics: ['C++', 'Memory Management', 'Data Structures']
        },
        questions: []
    },
    // Service-Based / Mass Recruiters
    {
        id: 'tcs',
        name: 'TCS',
        hiringPattern: {
            pattern: 'Foundation + Advanced sections. Ninja/Digital/Prime tracks.',
            questionTypes: ['Aptitude', 'Core CS', 'Coding'],
            difficultyDistribution: { Easy: '50%', Medium: '35%', Hard: '15%' },
            hotTopics: ['DBMS', 'OS', 'Aptitude', 'Strings']
        },
        questions: []
    },
    {
        id: 'infosys',
        name: 'Infosys',
        hiringPattern: {
            pattern: 'Focus on logical reasoning and programming fundamentals. Power Programmer track is high-DSA.',
            questionTypes: ['Quants', 'Programming', 'SP/DSE Rounds'],
            difficultyDistribution: { Easy: '40%', Medium: '40%', Hard: '20%' },
            hotTopics: ['Python/Java', 'Logic building', 'Puzzles']
        },
        questions: []
    },
    {
        id: 'wipro',
        name: 'Wipro',
        hiringPattern: {
            pattern: 'Elite and Turbo tracks focus heavily on coding and problem solving.',
            questionTypes: ['Aptitude', 'Java/C/Python', 'English'],
            difficultyDistribution: { Easy: '60%', Medium: '30%', Hard: '10%' },
            hotTopics: ['Flowcharts', 'Basic Algorithms', 'Verbal']
        },
        questions: []
    },
    {
        id: 'accenture',
        name: 'Accenture',
        hiringPattern: {
            pattern: 'Cognitive assessment followed by technical MCQ and coding.',
            questionTypes: ['Cognitive', 'Technical MCQ', 'Coding'],
            difficultyDistribution: { Easy: '45%', Medium: '45%', Hard: '10%' },
            hotTopics: ['Pseudocode', 'Networking', 'Cloud Basics']
        },
        questions: []
    },
    // Startups
    {
        id: 'zomato',
        name: 'Zomato',
        hiringPattern: {
            pattern: 'Real-world problem solving and system architectural design.',
            questionTypes: ['Machine Coding', 'HLD', 'DSA'],
            difficultyDistribution: { Easy: '10%', Medium: '60%', Hard: '30%' },
            hotTopics: ['System Mapping', 'API Design', 'Efficiency']
        },
        questions: []
    },
    {
        id: 'razorpay',
        name: 'Razorpay',
        hiringPattern: {
            pattern: 'Focus on high-quality engineering and attention to detail.',
            questionTypes: ['Coding', 'Architecture', 'Culture'],
            difficultyDistribution: { Easy: '15%', Medium: '60%', Hard: '25%' },
            hotTopics: ['FinTech Logic', 'Robust Code', 'Backend Systems']
        },
        questions: []
    },
    {
        id: 'zoho',
        name: 'Zoho',
        hiringPattern: {
            pattern: 'Unique focus on language-agnostic logic and aptitude.',
            questionTypes: ['C/Advanced C', 'Logic', 'App Development'],
            difficultyDistribution: { Easy: '30%', Medium: '50%', Hard: '20%' },
            hotTopics: ['Pointers', 'Logic Puzzles', 'Application Design']
        },
        questions: []
    },
    {
        id: 'atlassian',
        name: 'Atlassian',
        hiringPattern: {
            pattern: 'Values values-fit and clean, collaborative coding.',
            questionTypes: ['DSA', 'System Design', 'Values'],
            difficultyDistribution: { Easy: '10%', Medium: '50%', Hard: '40%' },
            hotTopics: ['Clean Code', 'Scalability', 'Collaboration']
        },
        questions: []
    }
];

export const mockExams: MockExam[] = [
    {
        id: 'amazon-sde-1',
        title: 'Amazon SDE-1 Recruitment Mock',
        description: 'Complete simulation of the OA with Leadership Principles and DSA.',
        durationMinutes: 90,
        companyId: 'amazon',
        sections: [
            { id: 'dsa', title: 'Data Structures & Algos', questionCount: 2, marksPerQuestion: 40 },
            { id: 'lp', title: 'Leadership Principles', questionCount: 10, marksPerQuestion: 2 }
        ],
        questions: [
            {
                id: 'amz-q1',
                text: 'A customer is angry about a delayed package. According to Leadership Principles, what is the best first step?',
                options: ['Blame the logistics partner', 'Apologize and provide an immediate workaround', 'Wait for the system to update', 'Tell the customer it is not your fault'],
                correctAnswer: 'Apologize and provide an immediate workaround',
                explanation: 'Customer Obsession is the primary principle.',
                type: 'MCQ',
                subject: 'Leadership Principles',
                marks: 10
            }
        ]
    },
    {
        id: 'tcs-nqt-2025',
        title: 'TCS NQT 2025 Foundation Mock',
        description: 'Practice for the non-technical foundation section of NQT.',
        durationMinutes: 75,
        companyId: 'tcs',
        negativeMarking: 0.25,
        sections: [
            { id: 'quant', title: 'Quantitative Aptitude', questionCount: 20, marksPerQuestion: 1 },
            { id: 'reasoning', title: 'Reasoning Ability', questionCount: 20, marksPerQuestion: 1 }
        ],
        questions: [
            {
                id: 'tcs-q1',
                text: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
                options: ['35', '42', '40', '48'],
                correctAnswer: '42',
                explanation: 'The difference increases by 2: +4, +6, +8, +10, +12.',
                type: 'MCQ',
                subject: 'Quantitative Aptitude',
                marks: 2
            }
        ]
    },
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
